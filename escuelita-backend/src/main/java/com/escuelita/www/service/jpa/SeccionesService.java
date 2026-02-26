package com.escuelita.www.service.jpa;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.escuelita.www.entity.Secciones;
import com.escuelita.www.repository.SeccionesRepository;
import com.escuelita.www.service.ISeccionesService;

@Service
public class SeccionesService implements ISeccionesService{
    @Autowired
    private SeccionesRepository repoSecciones;
    
    public List<Secciones> buscarTodos(){
        return repoSecciones.findAll();
    }
    @Override
    public Secciones guardar(Secciones secciones){
        return repoSecciones.save(secciones);
    }
    @Override
    public Secciones modificar(Secciones secciones){
        return repoSecciones.save(secciones);
    }
    public Optional<Secciones> buscarId(Long id){
        return repoSecciones.findById(id);
    }
    public void eliminar(Long id){
        repoSecciones.deleteById(id);
    }
}