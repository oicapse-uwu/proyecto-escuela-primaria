package com.escuelita.www.service;

import java.util.List;
import java.util.Optional;
import com.escuelita.www.entity.Suscripciones;

public interface ISuscripcionesService {
    List<Suscripciones> buscarTodos();
    Suscripciones guardar(Suscripciones suscripcion);
    Suscripciones modificar(Suscripciones suscripcion);
    Optional<Suscripciones> buscarId(Long id);
    void eliminar(Long id);
}