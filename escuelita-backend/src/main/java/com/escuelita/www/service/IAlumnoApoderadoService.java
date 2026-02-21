package com.escuelita.www.service;

import java.util.List;
import java.util.Optional;

import com.escuelita.www.entity.AlumnoApoderado;

public interface IAlumnoApoderadoService {
    List<AlumnoApoderado> buscarTodos();
    void guardar(AlumnoApoderado alumnoapoderado);
    void modificar(AlumnoApoderado alumnoapoderado);
    Optional<AlumnoApoderado> buscarId(Long id);
    void eliminar(Long id);
}