package com.escuelita.www.service;

import java.util.List;
import java.util.Optional;
import com.escuelita.www.entity.Calificaciones;

public interface ICalificacionesService {

    List<Calificaciones> buscarTodos();

    void guardar(Calificaciones calificacion);

    void modificar(Calificaciones calificacion);

    Optional<Calificaciones> buscarId(Long id);

    void eliminar(Long id);
}