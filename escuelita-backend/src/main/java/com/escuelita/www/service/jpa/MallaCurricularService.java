package com.escuelita.www.service.jpa;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.escuelita.www.entity.MallaCurricular;
import com.escuelita.www.repository.MallaCurricularRepository;
import com.escuelita.www.service.IMallaCurricularService;
import com.escuelita.www.util.TenantContext;

@Service
public class MallaCurricularService implements IMallaCurricularService {
    @Autowired
    private MallaCurricularRepository repoMallaCurricular;
    
    public List<MallaCurricular> buscarTodos() {
        if (TenantContext.isSuperAdmin()) {
            return repoMallaCurricular.findAll();
        }
        return repoMallaCurricular.findBySedeId(TenantContext.getSedeId());
    }
    
    @Override
    public MallaCurricular guardar(MallaCurricular mallaCurricular) {
        if (!TenantContext.isSuperAdmin()) {
            Long sedeId = mallaCurricular.getIdSede() != null
                         ? mallaCurricular.getIdSede().getIdSede() 
                         : null;
            
            if (sedeId == null || !sedeId.equals(TenantContext.getSedeId())) {
                throw new RuntimeException("No tienes permiso para crear malla curricular en esta sede");
            }
        }
        return repoMallaCurricular.save(mallaCurricular);
    }
    
    @Override
    public MallaCurricular modificar(MallaCurricular mallaCurricular) {
        if (!TenantContext.isSuperAdmin()) {
            Long sedeId = mallaCurricular.getIdSede() != null
                         ? mallaCurricular.getIdSede().getIdSede() 
                         : null;
            
            if (sedeId == null || !sedeId.equals(TenantContext.getSedeId())) {
                throw new RuntimeException("No tienes permiso para modificar malla curricular de esta sede");
            }
        }
        return repoMallaCurricular.save(mallaCurricular);
    }
    
    public Optional<MallaCurricular> buscarId(Long id) {
        Optional<MallaCurricular> malla = repoMallaCurricular.findById(id);
        
        if (TenantContext.isSuperAdmin()) {
            return malla;
        }
        
        if (malla.isPresent()) {
            Long sedeId = malla.get().getIdSede() != null
                         ? malla.get().getIdSede().getIdSede() 
                         : null;
            
            if (sedeId != null && sedeId.equals(TenantContext.getSedeId())) {
                return malla;
            }
        }
        return Optional.empty();
    }
    
    public void eliminar(Long id) {
        Optional<MallaCurricular> malla = repoMallaCurricular.findById(id);
        if (malla.isPresent() && !TenantContext.isSuperAdmin()) {
            Long sedeId = malla.get().getIdSede() != null
                         ? malla.get().getIdSede().getIdSede() 
                         : null;
            
            if (sedeId == null || !sedeId.equals(TenantContext.getSedeId())) {
                throw new RuntimeException("No tienes permiso para eliminar malla curricular de esta sede");
            }
        }
        repoMallaCurricular.deleteById(id);
    }
}