package com.escuelita.www.service;

import java.util.List;
import java.util.Optional;

import com.escuelita.www.entity.Alumnos;

public interface IAlumnosService {
    List<Alumnos> buscarTodos();
    void guardar(Alumnos alumno);
    void modificar(Alumnos alumno);
    Optional<Alumnos> buscarId(Long id);
    void eliminar(Long id); 
}