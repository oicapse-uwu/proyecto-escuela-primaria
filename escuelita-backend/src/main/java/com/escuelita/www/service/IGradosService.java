package com.escuelita.www.service;

import java.util.List;
import java.util.Optional;

import com.escuelita.www.entity.Grados;

public interface IGradosService {
    List<Grados> buscarTodos();
    Grados guardar(Grados grado);
    Grados modificar(Grados grado);
    Optional<Grados> buscarId(Long id);
    void eliminar(Long id);
}