package com.escuelita.www.service;

import java.util.List;
import java.util.Optional;
import com.escuelita.www.entity.Cursos;

public interface ICursosService {
    List<Cursos> buscarTodos();

    Cursos guardar(Cursos curso);

    Cursos modificar(Cursos curso);

    Optional<Cursos> buscarId(Long id);

    void eliminar(Long id);
}