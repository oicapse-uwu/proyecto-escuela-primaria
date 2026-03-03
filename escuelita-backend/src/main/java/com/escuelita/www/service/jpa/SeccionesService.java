package com.escuelita.www.service.jpa;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.escuelita.www.entity.Secciones;
import com.escuelita.www.repository.SeccionesRepository;
import com.escuelita.www.service.ISeccionesService;
import com.escuelita.www.util.SedeAccessHelper;
import com.escuelita.www.util.TenantContext;

@Service
public class SeccionesService implements ISeccionesService{
    @Autowired
    private SeccionesRepository repoSecciones;
    
    public List<Secciones> buscarTodos(){
        return SedeAccessHelper.findAllWithSedeFilter(
            repoSecciones, 
            () -> repoSecciones.findByIdSedeIdSede(TenantContext.getSedeId())
        );
    }
    
    @Override
    public Secciones guardar(Secciones secciones){
        SedeAccessHelper.validateSedeAccess(
            () -> secciones.getIdSede() != null ? secciones.getIdSede().getIdSede() : null
        );
        return repoSecciones.save(secciones);
    }
    
    @Override
    public Secciones modificar(Secciones secciones){
        SedeAccessHelper.validateSedeAccess(
            () -> secciones.getIdSede() != null ? secciones.getIdSede().getIdSede() : null
        );
        return repoSecciones.save(secciones);
    }
    
    public Optional<Secciones> buscarId(Long id){
        Optional<Secciones> seccion = repoSecciones.findById(id);
        return SedeAccessHelper.filterBySede(
            seccion,
            () -> seccion.isPresent() && seccion.get().getIdSede() != null 
                ? seccion.get().getIdSede().getIdSede() 
                : null
        );
    }
    
    public void eliminar(Long id){
        Optional<Secciones> seccion = repoSecciones.findById(id);
        if (seccion.isPresent()) {
            SedeAccessHelper.validateSedeAccess(
                () -> seccion.get().getIdSede() != null ? seccion.get().getIdSede().getIdSede() : null
            );
        }
        repoSecciones.deleteById(id);
    }
}