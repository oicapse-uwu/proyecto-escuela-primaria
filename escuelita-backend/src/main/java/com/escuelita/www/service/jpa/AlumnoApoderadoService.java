package com.escuelita.www.service.jpa;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.escuelita.www.entity.AlumnoApoderado;
import com.escuelita.www.repository.AlumnoApoderadoRepository;
import com.escuelita.www.service.IAlumnoApoderadoService;

@Service
public class AlumnoApoderadoService implements IAlumnoApoderadoService{
    @Autowired
    private AlumnoApoderadoRepository repoAlumnoApoderado;
    
    public List<AlumnoApoderado> buscarTodos(){
        return repoAlumnoApoderado.findAll();
    }
    @Override
    public AlumnoApoderado guardar(AlumnoApoderado alumnoApoderado){
        return repoAlumnoApoderado.save(alumnoApoderado);
    }
    @Override
    public AlumnoApoderado modificar(AlumnoApoderado alumnoApoderado){
        return repoAlumnoApoderado.save(alumnoApoderado);
    }
    public Optional<AlumnoApoderado> buscarId(Long id){
        return repoAlumnoApoderado.findById(id);
    }
    public void eliminar(Long id){
        repoAlumnoApoderado.deleteById(id);
    }
}