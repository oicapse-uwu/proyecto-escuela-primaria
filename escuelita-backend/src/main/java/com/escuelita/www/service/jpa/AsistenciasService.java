package com.escuelita.www.service.jpa;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.escuelita.www.entity.Asistencias;
import com.escuelita.www.repository.AsistenciasRepository;
import com.escuelita.www.service.IAsistenciasService;
import com.escuelita.www.util.TenantContext;

@Service
public class AsistenciasService implements IAsistenciasService {
    @Autowired
    private AsistenciasRepository repoAsistencias;
    
    @Transactional(readOnly = true)
    public List<Asistencias> buscarTodos() {
        if (TenantContext.isSuperAdmin()) {
            return repoAsistencias.findAll();
        }
        return repoAsistencias.findBySedeId(TenantContext.getSedeId());
    }
    
    @Override
    public Asistencias guardar(Asistencias asistencias) {
        if (!TenantContext.isSuperAdmin()) {
            Long sedeId = asistencias.getIdMatricula() != null &&
                         asistencias.getIdMatricula().getIdSeccion() != null &&
                         asistencias.getIdMatricula().getIdSeccion().getIdSede() != null
                         ? asistencias.getIdMatricula().getIdSeccion().getIdSede().getIdSede()
                         : null;
            
            if (sedeId == null || !sedeId.equals(TenantContext.getSedeId())) {
                throw new RuntimeException("No tienes permiso para registrar asistencias en esta sede");
            }
        }
        return repoAsistencias.save(asistencias);
    }
    
    @Override
    public Asistencias modificar(Asistencias asistencias) {
        if (!TenantContext.isSuperAdmin()) {
            Long sedeId = asistencias.getIdMatricula() != null &&
                         asistencias.getIdMatricula().getIdSeccion() != null &&
                         asistencias.getIdMatricula().getIdSeccion().getIdSede() != null
                         ? asistencias.getIdMatricula().getIdSeccion().getIdSede().getIdSede()
                         : null;
            
            if (sedeId == null || !sedeId.equals(TenantContext.getSedeId())) {
                throw new RuntimeException("No tienes permiso para modificar asistencias de esta sede");
            }
        }
        return repoAsistencias.save(asistencias);
    }
    
    @Transactional(readOnly = true)
    public Optional<Asistencias> buscarId(Long id) {
        Optional<Asistencias> asistencia = repoAsistencias.findById(id);
        
        if (TenantContext.isSuperAdmin()) {
            return asistencia;
        }
        
        if (asistencia.isPresent()) {
            Long sedeId = asistencia.get().getIdMatricula() != null &&
                         asistencia.get().getIdMatricula().getIdSeccion() != null &&
                         asistencia.get().getIdMatricula().getIdSeccion().getIdSede() != null
                         ? asistencia.get().getIdMatricula().getIdSeccion().getIdSede().getIdSede()
                         : null;
            
            if (sedeId != null && sedeId.equals(TenantContext.getSedeId())) {
                return asistencia;
            }
        }
        return Optional.empty();
    }
    
    public void eliminar(Long id) {
        Optional<Asistencias> asistencia = repoAsistencias.findById(id);
        if (asistencia.isPresent() && !TenantContext.isSuperAdmin()) {
            Long sedeId = asistencia.get().getIdMatricula() != null &&
                         asistencia.get().getIdMatricula().getIdSeccion() != null &&
                         asistencia.get().getIdMatricula().getIdSeccion().getIdSede() != null
                         ? asistencia.get().getIdMatricula().getIdSeccion().getIdSede().getIdSede()
                         : null;
            
            if (sedeId == null || !sedeId.equals(TenantContext.getSedeId())) {
                throw new RuntimeException("No tienes permiso para eliminar asistencias de esta sede");
            }
        }
        repoAsistencias.deleteById(id);
    }
}