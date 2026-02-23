package com.escuelita.www.service;

import java.util.List;
import java.util.Optional;

import com.escuelita.www.entity.Aulas;

public interface IAulasService {
    List<Aulas> buscarTodos();
    Aulas guardar(Aulas aula);
    Aulas modificar(Aulas aula);
    Optional<Aulas> buscarId(Long id);
    void eliminar(Long id);
}