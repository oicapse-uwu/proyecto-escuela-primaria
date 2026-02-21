package com.escuelita.www.service.jpa;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.escuelita.www.entity.Apoderados;
import com.escuelita.www.repository.ApoderadosRepository;
import com.escuelita.www.service.IApoderadosService;

@Service
public class ApoderadosService implements IApoderadosService{
    @Autowired
    private ApoderadosRepository repoApoderados;
    
    public List<Apoderados> buscarTodos(){
        return repoApoderados.findAll();
    }
    public void guardar(Apoderados apoderado){
        repoApoderados.save(apoderado);
    }
    public void modificar(Apoderados apoderado){
        repoApoderados.save(apoderado);
    }
    public Optional<Apoderados> buscarId(Long id){
        return repoApoderados.findById(id);
    }
    public void eliminar(Long id){
        repoApoderados.deleteById(id);
    }
}