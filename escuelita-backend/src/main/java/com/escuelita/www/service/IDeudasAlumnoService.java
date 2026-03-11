package com.escuelita.www.service;

import java.util.List;
import java.util.Optional;

import com.escuelita.www.entity.DeudasAlumno;

public interface IDeudasAlumnoService {
    
    List<DeudasAlumno> buscarTodos();
    List<DeudasAlumno> buscarPorMatricula(Long idMatricula);
    DeudasAlumno guardar(DeudasAlumno dto);
    DeudasAlumno modificar(DeudasAlumno dto);
    Optional<DeudasAlumno> buscarId(Long id);
    void eliminar(Long id);
}