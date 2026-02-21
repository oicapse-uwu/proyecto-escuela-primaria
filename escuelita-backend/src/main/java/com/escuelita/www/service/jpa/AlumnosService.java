package com.escuelita.www.service.jpa;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.escuelita.www.entity.Alumnos;
import com.escuelita.www.repository.AlumnosRepository;
import com.escuelita.www.service.IAlumnosService;

@Service
public class AlumnosService implements IAlumnosService{
    @Autowired
    private AlumnosRepository repoAlumnos;
    
    public List<Alumnos> buscarTodos(){
        return repoAlumnos.findAll();
    }
    public void guardar(Alumnos alumno){
        repoAlumnos.save(alumno);
    }
    public void modificar(Alumnos alumno){
        repoAlumnos.save(alumno);
    }
    public Optional<Alumnos> buscarId(Long id){
        return repoAlumnos.findById(id);
    }
    public void eliminar(Long id){
        repoAlumnos.deleteById(id);
    }
}