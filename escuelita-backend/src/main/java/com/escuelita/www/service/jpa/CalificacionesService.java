package com.escuelita.www.service.jpa;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.escuelita.www.entity.Calificaciones;
import com.escuelita.www.repository.CalificacionesRepository;
import com.escuelita.www.repository.PerfilDocenteRepository;
import com.escuelita.www.service.ICalificacionesService;
import com.escuelita.www.util.TenantContext;

@Service
public class CalificacionesService implements ICalificacionesService {
    @Autowired
    private CalificacionesRepository repoCalificaciones;

    @Autowired
    private PerfilDocenteRepository repoPerfilDocente;

    public List<Calificaciones> buscarTodos() {
        if (TenantContext.isSuperAdmin()) {
            return repoCalificaciones.findAll();
        }
        Long userId = TenantContext.getUserId();
        Long sedeId = TenantContext.getSedeId();
        if (userId != null && repoPerfilDocente.findByIdUsuario_IdUsuario(userId).isPresent()) {
            return repoCalificaciones.findByDocenteUsuarioId(userId);
        }
        if (sedeId != null) {
            return repoCalificaciones.findBySedeId(sedeId);
        }
        return repoCalificaciones.findAll();
    }
    
    @Override
    public Calificaciones guardar(Calificaciones calificaciones) {
        if (!TenantContext.isSuperAdmin()) {
            Long sedeId = calificaciones.getIdMatricula() != null &&
                         calificaciones.getIdMatricula().getIdSeccion() != null &&
                         calificaciones.getIdMatricula().getIdSeccion().getIdSede() != null
                         ? calificaciones.getIdMatricula().getIdSeccion().getIdSede().getIdSede()
                         : null;
            
            if (sedeId == null || !sedeId.equals(TenantContext.getSedeId())) {
                throw new RuntimeException("No tienes permiso para registrar calificaciones en esta sede");
            }
        }
        return repoCalificaciones.save(calificaciones);
    }
    
    @Override
    public Calificaciones modificar(Calificaciones calificaciones) {
        if (!TenantContext.isSuperAdmin()) {
            Long sedeId = calificaciones.getIdMatricula() != null &&
                         calificaciones.getIdMatricula().getIdSeccion() != null &&
                         calificaciones.getIdMatricula().getIdSeccion().getIdSede() != null
                         ? calificaciones.getIdMatricula().getIdSeccion().getIdSede().getIdSede()
                         : null;
            
            if (sedeId == null || !sedeId.equals(TenantContext.getSedeId())) {
                throw new RuntimeException("No tienes permiso para modificar calificaciones de esta sede");
            }
        }
        return repoCalificaciones.save(calificaciones);
    }
    
    public Optional<Calificaciones> buscarId(Long id) {
        Optional<Calificaciones> calificacion = repoCalificaciones.findById(id);
        
        if (TenantContext.isSuperAdmin()) {
            return calificacion;
        }
        
        if (calificacion.isPresent()) {
            Long sedeId = calificacion.get().getIdMatricula() != null &&
                         calificacion.get().getIdMatricula().getIdSeccion() != null &&
                         calificacion.get().getIdMatricula().getIdSeccion().getIdSede() != null
                         ? calificacion.get().getIdMatricula().getIdSeccion().getIdSede().getIdSede()
                         : null;
            
            if (sedeId != null && sedeId.equals(TenantContext.getSedeId())) {
                return calificacion;
            }
        }
        return Optional.empty();
    }
    
    public void eliminar(Long id) {
        Optional<Calificaciones> calificacion = repoCalificaciones.findById(id);
        if (calificacion.isPresent() && !TenantContext.isSuperAdmin()) {
            Long sedeId = calificacion.get().getIdMatricula() != null &&
                         calificacion.get().getIdMatricula().getIdSeccion() != null &&
                         calificacion.get().getIdMatricula().getIdSeccion().getIdSede() != null
                         ? calificacion.get().getIdMatricula().getIdSeccion().getIdSede().getIdSede()
                         : null;
            
            if (sedeId == null || !sedeId.equals(TenantContext.getSedeId())) {
                throw new RuntimeException("No tienes permiso para eliminar calificaciones de esta sede");
            }
        }
        repoCalificaciones.deleteById(id);
    }
}