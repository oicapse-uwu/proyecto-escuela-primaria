package com.escuelita.www.service.jpa;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.escuelita.www.entity.Apoderados;
import com.escuelita.www.repository.ApoderadosRepository;
import com.escuelita.www.service.IApoderadosService;
import com.escuelita.www.util.SedeAccessHelper;
import com.escuelita.www.util.TenantContext;

@Service
public class ApoderadosService implements IApoderadosService{
    @Autowired
    private ApoderadosRepository repoApoderados;
    
    public List<Apoderados> buscarTodos(){
        // Filtra automáticamente por sede del usuario
        return SedeAccessHelper.findAllWithSedeFilter(
            repoApoderados, 
            () -> repoApoderados.findByIdSedeIdSede(TenantContext.getSedeId())
        );
    }
    
    @Override
    public Apoderados guardar(Apoderados apoderados){
        // Valida que no guarde en otra sede
        SedeAccessHelper.validateSedeAccess(
            () -> apoderados.getIdSede() != null ? apoderados.getIdSede().getIdSede() : null
        );
        return repoApoderados.save(apoderados);
    }
    
    @Override
    public Apoderados modificar(Apoderados apoderados){
        // Valida que no modifique de otra sede
        SedeAccessHelper.validateSedeAccess(
            () -> apoderados.getIdSede() != null ? apoderados.getIdSede().getIdSede() : null
        );
        return repoApoderados.save(apoderados);
    }
    
    public Optional<Apoderados> buscarId(Long id){
        Optional<Apoderados> apoderado = repoApoderados.findById(id);
        // Filtra si no pertenece a la sede del usuario
        return SedeAccessHelper.filterBySede(
            apoderado,
            () -> apoderado.isPresent() && apoderado.get().getIdSede() != null 
                ? apoderado.get().getIdSede().getIdSede() 
                : null
        );
    }
    
    public void eliminar(Long id){
        Optional<Apoderados> apoderado = repoApoderados.findById(id);
        if (apoderado.isPresent()) {
            // Valida que no elimine de otra sede
            SedeAccessHelper.validateSedeAccess(
                () -> apoderado.get().getIdSede() != null ? apoderado.get().getIdSede().getIdSede() : null
            );
        }
        repoApoderados.deleteById(id);
    }
}