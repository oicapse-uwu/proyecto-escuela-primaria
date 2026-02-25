package com.escuelita.www.service.jpa;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.escuelita.www.entity.Grados;
import com.escuelita.www.repository.GradosRepository;
import com.escuelita.www.service.IGradosService;

@Service
public class GradosService implements IGradosService{
    @Autowired
    private GradosRepository repoGrados;
    
    public List<Grados> buscarTodos(){
        return repoGrados.findAll();
    }
    @Override
    public Grados guardar(Grados grados){
        return repoGrados.save(grados);
    }
    @Override
    public Grados modificar(Grados grados){
        return repoGrados.save(grados);
    }
    public Optional<Grados> buscarId(Long id){
        return repoGrados.findById(id);
    }
    public void eliminar(Long id){
        repoGrados.deleteById(id);
    }
}