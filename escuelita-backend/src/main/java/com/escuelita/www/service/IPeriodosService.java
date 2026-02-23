package com.escuelita.www.service;

import java.util.List;
import java.util.Optional;

import com.escuelita.www.entity.Periodos;

public interface IPeriodosService {
    List<Periodos> buscarTodos();
    Periodos guardar(Periodos periodo);
    Periodos modificar(Periodos periodo);
    Optional<Periodos> buscarId(Long id);
    void eliminar(Long id);
}