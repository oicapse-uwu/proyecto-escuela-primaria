package com.escuelita.www.service.jpa;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.escuelita.www.entity.Sedes;
import com.escuelita.www.repository.SedesRepository;
import com.escuelita.www.service.ISedesService;

@Service
public class SedesService implements ISedesService {
    
    @Autowired 
    private SedesRepository repoSedes;
    
    public List<Sedes> buscarTodos(){
        return repoSedes.findAll();
    }
    @Override
    public Sedes guardar(Sedes sede){
        return repoSedes.save(sede);
    }
    @Override
    public Sedes modificar(Sedes sede){
        return repoSedes.save(sede);
    }
    public Optional<Sedes> buscarId(Long id){
        return repoSedes.findById(id);
    }
    public void eliminar(Long id){
        repoSedes.deleteById(id);
    }
}