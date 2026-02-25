package com.escuelita.www.service.jpa;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.escuelita.www.entity.Aulas;
import com.escuelita.www.repository.AulasRepository;
import com.escuelita.www.service.IAulasService;

@Service
public class AulasService implements IAulasService{
    @Autowired
    private AulasRepository repoAulas;
    
    public List<Aulas> buscarTodos(){
        return repoAulas.findAll();
    }
    @Override
    public Aulas guardar(Aulas aulas){
        return repoAulas.save(aulas);
    }
    @Override
    public Aulas modificar(Aulas aulas){
        return repoAulas.save(aulas);
    }
    public Optional<Aulas> buscarId(Long id){
        return repoAulas.findById(id);
    }
    public void eliminar(Long id){
        repoAulas.deleteById(id);
    }
}