package com.escuelita.www.service.jpa;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.escuelita.www.entity.Horarios;
import com.escuelita.www.repository.HorariosRepository;
import com.escuelita.www.service.IHorariosService;
import com.escuelita.www.util.TenantContext;

@Service
public class HorariosService implements IHorariosService {
    @Autowired
    private HorariosRepository repoHorarios;
    
    public List<Horarios> buscarTodos() {
        if (TenantContext.isSuperAdmin()) {
            return repoHorarios.findAll();
        }
        return repoHorarios.findBySedeId(TenantContext.getSedeId());
    }
    
    @Override
    public Horarios guardar(Horarios horarios) {
        if (!TenantContext.isSuperAdmin()) {
            Long sedeId = horarios.getIdAula() != null && 
                         horarios.getIdAula().getIdSede() != null
                         ? horarios.getIdAula().getIdSede().getIdSede() 
                         : null;
            
            if (sedeId == null || !sedeId.equals(TenantContext.getSedeId())) {
                throw new RuntimeException("No tienes permiso para crear horarios en esta sede");
            }
        }
        return repoHorarios.save(horarios);
    }
    
    @Override
    public Horarios modificar(Horarios horarios) {
        if (!TenantContext.isSuperAdmin()) {
            Long sedeId = horarios.getIdAula() != null && 
                         horarios.getIdAula().getIdSede() != null
                         ? horarios.getIdAula().getIdSede().getIdSede() 
                         : null;
            
            if (sedeId == null || !sedeId.equals(TenantContext.getSedeId())) {
                throw new RuntimeException("No tienes permiso para modificar horarios de esta sede");
            }
        }
        return repoHorarios.save(horarios);
    }
    
    public Optional<Horarios> buscarId(Long id) {
        Optional<Horarios> horario = repoHorarios.findById(id);
        
        if (TenantContext.isSuperAdmin()) {
            return horario;
        }
        
        if (horario.isPresent()) {
            Long sedeId = horario.get().getIdAula() != null && 
                         horario.get().getIdAula().getIdSede() != null
                         ? horario.get().getIdAula().getIdSede().getIdSede() 
                         : null;
            
            if (sedeId != null && sedeId.equals(TenantContext.getSedeId())) {
                return horario;
            }
        }
        return Optional.empty();
    }
    
    public void eliminar(Long id) {
        Optional<Horarios> horario = repoHorarios.findById(id);
        if (horario.isPresent() && !TenantContext.isSuperAdmin()) {
            Long sedeId = horario.get().getIdAula() != null && 
                         horario.get().getIdAula().getIdSede() != null
                         ? horario.get().getIdAula().getIdSede().getIdSede() 
                         : null;
            
            if (sedeId == null || !sedeId.equals(TenantContext.getSedeId())) {
                throw new RuntimeException("No tienes permiso para eliminar horarios de esta sede");
            }
        }
        repoHorarios.deleteById(id);
    }
}