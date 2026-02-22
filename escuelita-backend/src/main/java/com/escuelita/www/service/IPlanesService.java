package com.escuelita.www.service;

import java.util.List;
import java.util.Optional;
import com.escuelita.www.entity.Planes;

public interface IPlanesService {
    List<Planes> buscarTodos();
    void guardar(Planes plan);
    void modificar(Planes plan);
    Optional<Planes> buscarId(Long id);
    void eliminar(Long id);
}