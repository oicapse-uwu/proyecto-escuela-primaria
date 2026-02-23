package com.escuelita.www.service.jpa;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.escuelita.www.entity.AnioEscolar;
import com.escuelita.www.repository.AnioEscolarRepository;
import com.escuelita.www.service.IAnioEscolarService;

@Service
public class AnioEscolarService implements IAnioEscolarService{
    @Autowired
    private AnioEscolarRepository repoAnioEscolar;
    
    public List<AnioEscolar> buscarTodos(){
        return repoAnioEscolar.findAll();
    }
    public AnioEscolar guardar(AnioEscolar anioescolar){
        return repoAnioEscolar.save(anioescolar);
    }
    public AnioEscolar modificar(AnioEscolar anioescolar){
        return repoAnioEscolar.save(anioescolar);
    }
    public Optional<AnioEscolar> buscarId(Long id){
        return repoAnioEscolar.findById(id);
    }
    public void eliminar(Long id){
        repoAnioEscolar.deleteById(id);
    }
}