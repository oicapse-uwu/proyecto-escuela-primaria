package com.escuelita.www.service.jpa;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.escuelita.www.entity.Evaluaciones;
import com.escuelita.www.repository.EvaluacionesRepository;
import com.escuelita.www.repository.PerfilDocenteRepository;
import com.escuelita.www.service.IEvaluacionesService;
import com.escuelita.www.util.TenantContext;

@Service
public class EvaluacionesService implements IEvaluacionesService {
    @Autowired
    private EvaluacionesRepository repoEvaluaciones;

    @Autowired
    private PerfilDocenteRepository repoPerfilDocente;

    public List<Evaluaciones> buscarTodos() {
        try {
            if (TenantContext.isSuperAdmin()) {
                return repoEvaluaciones.findAll();
            }
            Long userId = TenantContext.getUserId();
            Long sedeId = TenantContext.getSedeId();
            // Si tiene userId y es docente, filtrar solo por docente
            if (userId != null && repoPerfilDocente.findByIdUsuario_IdUsuario(userId).isPresent()) {
                return repoEvaluaciones.findByDocenteUsuarioId(userId);
            }
            // Si no es docente (director, secretaria), filtrar por sede
            if (sedeId != null) {
                return repoEvaluaciones.findBySedeId(sedeId);
            }
            return repoEvaluaciones.findAll();
        } catch (Exception e) {
            System.out.println("Error en EvaluacionesService.buscarTodos(): " + e.getMessage());
            e.printStackTrace();
            return repoEvaluaciones.findAll();
        }
    }
    
    @Override
    public Evaluaciones guardar(Evaluaciones evaluaciones) {
        if (!TenantContext.isSuperAdmin()) {
            Long sedeId = evaluaciones.getIdAsignacion() != null &&
                         evaluaciones.getIdAsignacion().getIdSeccion() != null &&
                         evaluaciones.getIdAsignacion().getIdSeccion().getIdSede() != null
                         ? evaluaciones.getIdAsignacion().getIdSeccion().getIdSede().getIdSede()
                         : null;
            
            if (sedeId == null || !sedeId.equals(TenantContext.getSedeId())) {
                throw new RuntimeException("No tienes permiso para crear evaluaciones en esta sede");
            }
        }
        return repoEvaluaciones.save(evaluaciones);
    }
    
    @Override
    public Evaluaciones modificar(Evaluaciones evaluaciones) {
        if (!TenantContext.isSuperAdmin()) {
            Long sedeId = evaluaciones.getIdAsignacion() != null &&
                         evaluaciones.getIdAsignacion().getIdSeccion() != null &&
                         evaluaciones.getIdAsignacion().getIdSeccion().getIdSede() != null
                         ? evaluaciones.getIdAsignacion().getIdSeccion().getIdSede().getIdSede()
                         : null;
            
            if (sedeId == null || !sedeId.equals(TenantContext.getSedeId())) {
                throw new RuntimeException("No tienes permiso para modificar evaluaciones de esta sede");
            }
        }
        return repoEvaluaciones.save(evaluaciones);
    }
    
    public Optional<Evaluaciones> buscarId(Long id) {
        Optional<Evaluaciones> evaluacion = repoEvaluaciones.findById(id);
        
        if (TenantContext.isSuperAdmin()) {
            return evaluacion;
        }
        
        if (evaluacion.isPresent()) {
            Long sedeId = evaluacion.get().getIdAsignacion() != null &&
                         evaluacion.get().getIdAsignacion().getIdSeccion() != null &&
                         evaluacion.get().getIdAsignacion().getIdSeccion().getIdSede() != null
                         ? evaluacion.get().getIdAsignacion().getIdSeccion().getIdSede().getIdSede()
                         : null;
            
            if (sedeId != null && sedeId.equals(TenantContext.getSedeId())) {
                return evaluacion;
            }
        }
        return Optional.empty();
    }
    
    public void eliminar(Long id) {
        Optional<Evaluaciones> evaluacion = repoEvaluaciones.findById(id);
        if (evaluacion.isPresent() && !TenantContext.isSuperAdmin()) {
            Long sedeId = evaluacion.get().getIdAsignacion() != null &&
                         evaluacion.get().getIdAsignacion().getIdSeccion() != null &&
                         evaluacion.get().getIdAsignacion().getIdSeccion().getIdSede() != null
                         ? evaluacion.get().getIdAsignacion().getIdSeccion().getIdSede().getIdSede()
                         : null;
            
            if (sedeId == null || !sedeId.equals(TenantContext.getSedeId())) {
                throw new RuntimeException("No tienes permiso para eliminar evaluaciones de esta sede");
            }
        }
        repoEvaluaciones.deleteById(id);
    }
}