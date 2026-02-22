package com.escuelita.www.service;

import java.util.List;
import java.util.Optional;
import com.escuelita.www.entity.EstadosSuscripcion;

public interface IEstadosSuscripcionService {
    List<EstadosSuscripcion> buscarTodos();
    void guardar(EstadosSuscripcion estadoSuscripcion);
    void modificar(EstadosSuscripcion estadoSuscripcion);
    Optional<EstadosSuscripcion> buscarId(Long id);
    void eliminar(Long id);
}