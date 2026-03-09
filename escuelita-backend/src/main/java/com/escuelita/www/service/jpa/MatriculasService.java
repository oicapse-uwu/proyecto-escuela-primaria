package com.escuelita.www.service.jpa;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.escuelita.www.entity.Matriculas;
import com.escuelita.www.repository.MatriculasRepository;
import com.escuelita.www.service.IMatriculasService;
import com.escuelita.www.util.TenantContext;

import jakarta.persistence.EntityManager;
import jakarta.persistence.ParameterMode;
import jakarta.persistence.StoredProcedureQuery;

@Service
public class MatriculasService implements IMatriculasService{
    @Autowired
    private MatriculasRepository repoMatriculas;
    
    @Autowired
    private EntityManager entityManager;
    
    public List<Matriculas> buscarTodos(){
        // Super Admin ve todas las matrículas
        if (TenantContext.isSuperAdmin()) {
            return repoMatriculas.findAll();
        }
        // Usuario de sede solo ve matrículas de su sede
        return repoMatriculas.findBySedeId(TenantContext.getSedeId());
    }
    
    @Override
    public Matriculas guardar(Matriculas matriculas){
        // Validar que la sección pertenece a la sede del usuario
        if (!TenantContext.isSuperAdmin()) {
            Long sedeId = matriculas.getIdSeccion() != null && 
                         matriculas.getIdSeccion().getIdSede() != null
                         ? matriculas.getIdSeccion().getIdSede().getIdSede() 
                         : null;
            
            if (sedeId == null || !sedeId.equals(TenantContext.getSedeId())) {
                throw new RuntimeException("No tienes permiso para crear matrículas en esta sede");
            }
        }
        
        // Validar capacidad ANTES de crear la matrícula (solo para alumnos sin vacante garantizada)
        if (matriculas.getVacanteGarantizada() != null && !matriculas.getVacanteGarantizada()) {
            Long idSeccion = matriculas.getIdSeccion() != null ? matriculas.getIdSeccion().getIdSeccion() : null;
            Long idAnio = matriculas.getIdAnio() != null ? matriculas.getIdAnio().getIdAnioEscolar() : null;
            
            if (idSeccion != null && idAnio != null) {
                int vacantesDisponibles = consultarVacantesDisponibles(idSeccion, idAnio);
                
                if (vacantesDisponibles <= 0) {
                    throw new RuntimeException("No hay vacantes disponibles en esta sección. No se puede crear la matrícula.");
                }
            }
        }
        
        return repoMatriculas.save(matriculas);
    }
    
    @Override
    public Matriculas modificar(Matriculas matriculas){
        // Validar que la sección pertenece a la sede del usuario
        if (!TenantContext.isSuperAdmin()) {
            Long sedeId = matriculas.getIdSeccion() != null && 
                         matriculas.getIdSeccion().getIdSede() != null
                         ? matriculas.getIdSeccion().getIdSede().getIdSede() 
                         : null;
            
            if (sedeId == null || !sedeId.equals(TenantContext.getSedeId())) {
                throw new RuntimeException("No tienes permiso para modificar matrículas de esta sede");
            }
        }
        
        // Validar capacidad si se está cambiando de sección (solo para alumnos sin vacante garantizada)
        Optional<Matriculas> matriculaAnterior = repoMatriculas.findById(matriculas.getIdMatricula());
        if (matriculaAnterior.isPresent() && 
            matriculas.getVacanteGarantizada() != null && 
            !matriculas.getVacanteGarantizada()) {
            
            Long nuevaSeccion = matriculas.getIdSeccion() != null ? matriculas.getIdSeccion().getIdSeccion() : null;
            Long seccionAnterior = matriculaAnterior.get().getIdSeccion() != null ? 
                                   matriculaAnterior.get().getIdSeccion().getIdSeccion() : null;
            
            // Si cambió de sección, validar vacantes en la nueva
            if (nuevaSeccion != null && !nuevaSeccion.equals(seccionAnterior)) {
                Long idAnio = matriculas.getIdAnio() != null ? matriculas.getIdAnio().getIdAnioEscolar() : null;
                
                if (idAnio != null) {
                    int vacantesDisponibles = consultarVacantesDisponibles(nuevaSeccion, idAnio);
                    
                    if (vacantesDisponibles <= 0) {
                        throw new RuntimeException("No hay vacantes disponibles en la nueva sección.");
                    }
                }
            }
        }
        
        return repoMatriculas.save(matriculas);
    }
    
    public Optional<Matriculas> buscarId(Long id){
        Optional<Matriculas> matricula = repoMatriculas.findById(id);
        
        // Super Admin puede ver cualquier matrícula
        if (TenantContext.isSuperAdmin()) {
            return matricula;
        }
        
        // Usuario de sede solo puede ver matrículas de su sede
        if (matricula.isPresent()) {
            Long sedeId = matricula.get().getIdSeccion() != null && 
                         matricula.get().getIdSeccion().getIdSede() != null
                         ? matricula.get().getIdSeccion().getIdSede().getIdSede() 
                         : null;
            
            if (sedeId != null && sedeId.equals(TenantContext.getSedeId())) {
                return matricula;
            }
        }
        return Optional.empty();
    }
    
    public void eliminar(Long id){
        Optional<Matriculas> matricula = repoMatriculas.findById(id);
        if (matricula.isPresent() && !TenantContext.isSuperAdmin()) {
            Long sedeId = matricula.get().getIdSeccion() != null && 
                         matricula.get().getIdSeccion().getIdSede() != null
                         ? matricula.get().getIdSeccion().getIdSede().getIdSede() 
                         : null;
            
            if (sedeId == null || !sedeId.equals(TenantContext.getSedeId())) {
                throw new RuntimeException("No tienes permiso para eliminar matrículas de esta sede");
            }
        }
        repoMatriculas.deleteById(id);
    }
    
    @Override
    @Transactional
    public String confirmarPagoMatricula(Long idMatricula) {
        try {
            StoredProcedureQuery query = entityManager.createStoredProcedureQuery("sp_confirmar_pago_matricula");
            
            query.registerStoredProcedureParameter("p_id_matricula", Long.class, ParameterMode.IN);
            query.registerStoredProcedureParameter("p_resultado", String.class, ParameterMode.OUT);
            query.registerStoredProcedureParameter("p_mensaje", String.class, ParameterMode.OUT);
            
            query.setParameter("p_id_matricula", idMatricula);
            
            query.execute();
            
            String resultado = (String) query.getOutputParameterValue("p_resultado");
            String mensaje = (String) query.getOutputParameterValue("p_mensaje");
            
            // Si no hay vacantes, lanzar excepción para que el frontend maneje el error
            if ("SIN_VACANTE".equals(resultado) || "ERROR".equals(resultado)) {
                throw new RuntimeException(mensaje);
            }
            
            return mensaje;
        } catch (Exception e) {
            throw new RuntimeException("Error al confirmar pago: " + e.getMessage());
        }
    }
    
    @Override
    public int consultarVacantesDisponibles(Long idSeccion, Long idAnio) {
        try {
            // Obtener capacidad máxima de la sección
            Integer capacidadMaxima = entityManager.createQuery(
                "SELECT s.capacidadMaxima FROM Secciones s WHERE s.idSeccion = :idSeccion", 
                Integer.class)
                .setParameter("idSeccion", idSeccion)
                .getSingleResult();
            
            if (capacidadMaxima == null) {
                throw new RuntimeException("Sección no encontrada");
            }
            
            // Contar matrículas activas en esa sección
            Long matriculasActivas = entityManager.createQuery(
                "SELECT COUNT(m) FROM Matriculas m WHERE m.idSeccion.idSeccion = :idSeccion " +
                "AND m.idAnio.idAnioEscolar = :idAnio " +
                "AND m.estadoMatricula = 'Activa' " +
                "AND m.estado = 1", 
                Long.class)
                .setParameter("idSeccion", idSeccion)
                .setParameter("idAnio", idAnio)
                .getSingleResult();
            
            // Calcular vacantes disponibles
            int vacantesDisponibles = capacidadMaxima - matriculasActivas.intValue();
            return Math.max(0, vacantesDisponibles); // No devolver negativos
            
        } catch (Exception e) {
            throw new RuntimeException("Error al consultar vacantes: " + e.getMessage());
        }
    }
}