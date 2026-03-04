package com.escuelita.www.service.jpa;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.escuelita.www.entity.Evaluaciones;
import com.escuelita.www.repository.EvaluacionesRepository;
import com.escuelita.www.service.IEvaluacionesService;
import com.escuelita.www.util.TenantContext;

@Service
public class EvaluacionesService implements IEvaluacionesService {
    @Autowired
    private EvaluacionesRepository repoEvaluaciones;

    public List<Evaluaciones> buscarTodos() {
        if (TenantContext.isSuperAdmin()) {
            return repoEvaluaciones.findAll();
        }
        return repoEvaluaciones.findBySedeId(TenantContext.getSedeId());
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