package com.escuelita.www.service.jpa;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.escuelita.www.entity.AnioEscolar;
import com.escuelita.www.repository.AnioEscolarRepository;
import com.escuelita.www.service.IAnioEscolarService;
import com.escuelita.www.util.SedeAccessHelper;
import com.escuelita.www.util.TenantContext;

@Service
public class AnioEscolarService implements IAnioEscolarService{
    @Autowired
    private AnioEscolarRepository repoAnioEscolar;
    
    public List<AnioEscolar> buscarTodos(){
        return SedeAccessHelper.findAllWithSedeFilter(
            repoAnioEscolar, 
            () -> repoAnioEscolar.findByIdSedeIdSede(TenantContext.getSedeId())
        );
    }
    
    @Override
    public AnioEscolar guardar(AnioEscolar anioEscolar){
        SedeAccessHelper.validateSedeAccess(
            () -> anioEscolar.getIdSede() != null ? anioEscolar.getIdSede().getIdSede() : null
        );
        return repoAnioEscolar.save(anioEscolar);
    }
    
    @Override
    public AnioEscolar modificar(AnioEscolar anioEscolar){
        SedeAccessHelper.validateSedeAccess(
            () -> anioEscolar.getIdSede() != null ? anioEscolar.getIdSede().getIdSede() : null
        );
        return repoAnioEscolar.save(anioEscolar);
    }
    
    public Optional<AnioEscolar> buscarId(Long id){
        Optional<AnioEscolar> anio = repoAnioEscolar.findById(id);
        return SedeAccessHelper.filterBySede(
            anio,
            () -> anio.isPresent() && anio.get().getIdSede() != null 
                ? anio.get().getIdSede().getIdSede() 
                : null
        );
    }
    
    public void eliminar(Long id){
        Optional<AnioEscolar> anio = repoAnioEscolar.findById(id);
        if (anio.isPresent()) {
            SedeAccessHelper.validateSedeAccess(
                () -> anio.get().getIdSede() != null ? anio.get().getIdSede().getIdSede() : null
            );
        }
        repoAnioEscolar.deleteById(id);
    }
}