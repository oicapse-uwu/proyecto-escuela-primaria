package com.escuelita.www.service.jpa;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.escuelita.www.entity.Institucion;
import com.escuelita.www.repository.InstitucionRepository;
import com.escuelita.www.service.IInstitucionService;

@Service
public class InstitucionService implements IInstitucionService {
    
    @Autowired
    private InstitucionRepository repoInstitucion;
    
    public List<Institucion> buscarTodos(){
        return repoInstitucion.findAll();
    }
    public void guardar(Institucion institucion){
        repoInstitucion.save(institucion);
    }
    public void modificar(Institucion institucion){
        repoInstitucion.save(institucion);
    }
    public Optional<Institucion> buscarId(Long id){
        return repoInstitucion.findById(id);
    }
    public void eliminar(Long id){
        repoInstitucion.deleteById(id);
    }
}