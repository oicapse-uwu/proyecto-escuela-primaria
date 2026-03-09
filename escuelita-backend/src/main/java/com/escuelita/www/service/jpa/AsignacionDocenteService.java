package com.escuelita.www.service.jpa;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.escuelita.www.entity.AsignacionDocente;
import com.escuelita.www.repository.AsignacionDocenteRepository;
import com.escuelita.www.service.IAsignacionDocenteService;
import com.escuelita.www.util.TenantContext;

@Service
public class AsignacionDocenteService implements IAsignacionDocenteService {
    @Autowired
    private AsignacionDocenteRepository repoAsignacionDocente;

    public List<AsignacionDocente> buscarTodos() {
        try {
            if (TenantContext.isSuperAdmin()) {
                return repoAsignacionDocente.findAll();
            }
            Long sedeId = TenantContext.getSedeId();
            if (sedeId == null) {
                return repoAsignacionDocente.findAll();
            }
            return repoAsignacionDocente.findBySedeId(sedeId);
        } catch (Exception e) {
            System.out.println("Error en AsignacionDocenteService.buscarTodos(): " + e.getMessage());
            e.printStackTrace();
            return repoAsignacionDocente.findAll();
        }
    }
    
    @Override
    public AsignacionDocente guardar(AsignacionDocente asignacionDocente) {
        if (!TenantContext.isSuperAdmin()) {
            Long sedeId = asignacionDocente.getIdSeccion() != null && 
                         asignacionDocente.getIdSeccion().getIdSede() != null
                         ? asignacionDocente.getIdSeccion().getIdSede().getIdSede() 
                         : null;
            
            if (sedeId == null || !sedeId.equals(TenantContext.getSedeId())) {
                throw new RuntimeException("No tienes permiso para crear asignaciones en esta sede");
            }
        }
        return repoAsignacionDocente.save(asignacionDocente);
    }
    
    @Override
    public AsignacionDocente modificar(AsignacionDocente asignacionDocente) {
        if (!TenantContext.isSuperAdmin()) {
            Long sedeId = asignacionDocente.getIdSeccion() != null && 
                         asignacionDocente.getIdSeccion().getIdSede() != null
                         ? asignacionDocente.getIdSeccion().getIdSede().getIdSede() 
                         : null;
            
            if (sedeId == null || !sedeId.equals(TenantContext.getSedeId())) {
                throw new RuntimeException("No tienes permiso para modificar asignaciones de esta sede");
            }
        }
        return repoAsignacionDocente.save(asignacionDocente);
    }
    
    public Optional<AsignacionDocente> buscarId(Long id) {
        Optional<AsignacionDocente> asignacion = repoAsignacionDocente.findById(id);
        
        if (TenantContext.isSuperAdmin()) {
            return asignacion;
        }
        
        if (asignacion.isPresent()) {
            Long sedeId = asignacion.get().getIdSeccion() != null && 
                         asignacion.get().getIdSeccion().getIdSede() != null
                         ? asignacion.get().getIdSeccion().getIdSede().getIdSede() 
                         : null;
            
            if (sedeId != null && sedeId.equals(TenantContext.getSedeId())) {
                return asignacion;
            }
        }
        return Optional.empty();
    }
    
    public void eliminar(Long id) {
        Optional<AsignacionDocente> asignacion = repoAsignacionDocente.findById(id);
        if (asignacion.isPresent() && !TenantContext.isSuperAdmin()) {
            Long sedeId = asignacion.get().getIdSeccion() != null && 
                         asignacion.get().getIdSeccion().getIdSede() != null
                         ? asignacion.get().getIdSeccion().getIdSede().getIdSede() 
                         : null;
            
            if (sedeId == null || !sedeId.equals(TenantContext.getSedeId())) {
                throw new RuntimeException("No tienes permiso para eliminar asignaciones de esta sede");
            }
        }
        repoAsignacionDocente.deleteById(id);
    }
}