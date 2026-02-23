package com.escuelita.www.service;

import java.util.List;
import java.util.Optional;
import com.escuelita.www.entity.AsignacionDocente;

public interface IAsignacionDocenteService {
    List<AsignacionDocente> buscarTodos();

    void guardar(AsignacionDocente asignacion);

    void modificar(AsignacionDocente asignacion);

    Optional<AsignacionDocente> buscarId(Long id);

    void eliminar(Long id);
}