package com.escuelita.www.service;

import java.util.List;
import java.util.Optional;
import com.escuelita.www.entity.AsignacionDocente;

public interface IAsignacionDocenteService {
    List<AsignacionDocente> buscarTodos();

    AsignacionDocente guardar(AsignacionDocente asignacion);

    AsignacionDocente modificar(AsignacionDocente asignacion);

    Optional<AsignacionDocente> buscarId(Long id);

    void eliminar(Long id);
}