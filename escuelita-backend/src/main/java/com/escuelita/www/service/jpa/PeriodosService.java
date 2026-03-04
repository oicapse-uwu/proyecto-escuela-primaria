package com.escuelita.www.service.jpa;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.escuelita.www.entity.Periodos;
import com.escuelita.www.repository.PeriodosRepository;
import com.escuelita.www.service.IPeriodosService;
import com.escuelita.www.util.TenantContext;

@Service
public class PeriodosService implements IPeriodosService{
    @Autowired
    private PeriodosRepository repoPeriodos;
    
    public List<Periodos> buscarTodos(){
        if (TenantContext.isSuperAdmin()) {
            return repoPeriodos.findAll();
        }
        return repoPeriodos.findBySedeId(TenantContext.getSedeId());
    }
    
    @Override
    public Periodos guardar(Periodos periodos){
        if (!TenantContext.isSuperAdmin()) {
            Long sedeId = periodos.getIdAnio() != null && 
                         periodos.getIdAnio().getIdSede() != null
                         ? periodos.getIdAnio().getIdSede().getIdSede() 
                         : null;
            
            if (sedeId == null || !sedeId.equals(TenantContext.getSedeId())) {
                throw new RuntimeException("No tienes permiso para crear periodos en esta sede");
            }
        }
        return repoPeriodos.save(periodos);
    }
    
    @Override
    public Periodos modificar(Periodos periodos){
        if (!TenantContext.isSuperAdmin()) {
            Long sedeId = periodos.getIdAnio() != null && 
                         periodos.getIdAnio().getIdSede() != null
                         ? periodos.getIdAnio().getIdSede().getIdSede() 
                         : null;
            
            if (sedeId == null || !sedeId.equals(TenantContext.getSedeId())) {
                throw new RuntimeException("No tienes permiso para modificar periodos de esta sede");
            }
        }
        return repoPeriodos.save(periodos);
    }
    
    public Optional<Periodos> buscarId(Long id){
        Optional<Periodos> periodo = repoPeriodos.findById(id);
        
        if (TenantContext.isSuperAdmin()) {
            return periodo;
        }
        
        if (periodo.isPresent()) {
            Long sedeId = periodo.get().getIdAnio() != null && 
                         periodo.get().getIdAnio().getIdSede() != null
                         ? periodo.get().getIdAnio().getIdSede().getIdSede() 
                         : null;
            
            if (sedeId != null && sedeId.equals(TenantContext.getSedeId())) {
                return periodo;
            }
        }
        return Optional.empty();
    }
    
    public void eliminar(Long id){
        Optional<Periodos> periodo = repoPeriodos.findById(id);
        if (periodo.isPresent() && !TenantContext.isSuperAdmin()) {
            Long sedeId = periodo.get().getIdAnio() != null && 
                         periodo.get().getIdAnio().getIdSede() != null
                         ? periodo.get().getIdAnio().getIdSede().getIdSede() 
                         : null;
            
            if (sedeId == null || !sedeId.equals(TenantContext.getSedeId())) {
                throw new RuntimeException("No tienes permiso para eliminar periodos de esta sede");
            }
        }
        repoPeriodos.deleteById(id);
    }
}