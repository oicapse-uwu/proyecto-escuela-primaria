package com.escuelita.www.service.jpa;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.escuelita.www.entity.Aulas;
import com.escuelita.www.repository.AulasRepository;
import com.escuelita.www.service.IAulasService;
import com.escuelita.www.util.SedeAccessHelper;
import com.escuelita.www.util.TenantContext;

@Service
public class AulasService implements IAulasService{
    @Autowired
    private AulasRepository repoAulas;
    
    public List<Aulas> buscarTodos(){
        return SedeAccessHelper.findAllWithSedeFilter(
            repoAulas, 
            () -> repoAulas.findByIdSedeIdSede(TenantContext.getSedeId())
        );
    }
    
    @Override
    public Aulas guardar(Aulas aulas){
        SedeAccessHelper.validateSedeAccess(
            () -> aulas.getIdSede() != null ? aulas.getIdSede().getIdSede() : null
        );
        return repoAulas.save(aulas);
    }
    
    @Override
    public Aulas modificar(Aulas aulas){
        SedeAccessHelper.validateSedeAccess(
            () -> aulas.getIdSede() != null ? aulas.getIdSede().getIdSede() : null
        );
        return repoAulas.save(aulas);
    }
    
    public Optional<Aulas> buscarId(Long id){
        Optional<Aulas> aula = repoAulas.findById(id);
        return SedeAccessHelper.filterBySede(
            aula,
            () -> aula.isPresent() && aula.get().getIdSede() != null 
                ? aula.get().getIdSede().getIdSede() 
                : null
        );
    }
    
    public void eliminar(Long id){
        Optional<Aulas> aula = repoAulas.findById(id);
        if (aula.isPresent()) {
            SedeAccessHelper.validateSedeAccess(
                () -> aula.get().getIdSede() != null ? aula.get().getIdSede().getIdSede() : null
            );
        }
        repoAulas.deleteById(id);
    }
}