package com.escuelita.www.service;

import java.util.List;
import java.util.Optional;
import com.escuelita.www.entity.PerfilDocente;

public interface IPerfilDocenteService {
    List<PerfilDocente> buscarTodos();

    PerfilDocente guardar(PerfilDocente docente);

    PerfilDocente modificar(PerfilDocente docente);

    Optional<PerfilDocente> buscarId(Long id);

    void eliminar(Long id);
}