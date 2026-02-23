package com.escuelita.www.service;

import java.util.List;
import java.util.Optional;

import com.escuelita.www.entity.Sedes;

public interface ISedesService {
    List<Sedes> buscarTodos();
    Sedes guardar(Sedes sede);
    Sedes modificar(Sedes sede);
    Optional<Sedes> buscarId(Long id);
    void eliminar(Long id);
}