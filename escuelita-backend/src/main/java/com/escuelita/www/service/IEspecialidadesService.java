package com.escuelita.www.service;

import java.util.List;
import java.util.Optional;
import com.escuelita.www.entity.Especialidades;

public interface IEspecialidadesService {
    List<Especialidades> buscarTodos();

    void guardar(Especialidades especialidad);

    void modificar(Especialidades especialidad);

    Optional<Especialidades> buscarId(Long id);

    void eliminar(Long id);
}