package com.escuelita.www.service.jpa;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.escuelita.www.entity.Areas;
import com.escuelita.www.repository.AreasRepository;
import com.escuelita.www.service.IAreasService;
import com.escuelita.www.util.SedeAccessHelper;
import com.escuelita.www.util.TenantContext;

@Service
public class AreasService implements IAreasService {
    @Autowired
    private AreasRepository repoAreas;

    public List<Areas> buscarTodos() {
        return SedeAccessHelper.findAllWithSedeFilter(
            repoAreas, 
            () -> repoAreas.findByIdSedeIdSede(TenantContext.getSedeId())
        );
    }
    
    @Override
    public Areas guardar(Areas areas) {
        SedeAccessHelper.validateSedeAccess(
            () -> areas.getIdSede() != null ? areas.getIdSede().getIdSede() : null
        );
        return repoAreas.save(areas);
    }
    
    @Override
    public Areas modificar(Areas areas) {
        SedeAccessHelper.validateSedeAccess(
            () -> areas.getIdSede() != null ? areas.getIdSede().getIdSede() : null
        );
        return repoAreas.save(areas);
    }
    
    public Optional<Areas> buscarId(Long id) {
        Optional<Areas> area = repoAreas.findById(id);
        return SedeAccessHelper.filterBySede(
            area,
            () -> area.isPresent() && area.get().getIdSede() != null 
                ? area.get().getIdSede().getIdSede() 
                : null
        );
    }
    
    public void eliminar(Long id) {
        Optional<Areas> area = repoAreas.findById(id);
        if (area.isPresent()) {
            SedeAccessHelper.validateSedeAccess(
                () -> area.get().getIdSede() != null ? area.get().getIdSede().getIdSede() : null
            );
        }
        repoAreas.deleteById(id);
    }
}