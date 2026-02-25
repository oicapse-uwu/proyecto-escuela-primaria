package com.escuelita.www.service;

import java.util.List;
import java.util.Optional;

import com.escuelita.www.entity.Evaluaciones;

public interface IEvaluacionesService {
    List<Evaluaciones> buscarTodos();
    Evaluaciones guardar(Evaluaciones evaluacion);
    Evaluaciones modificar(Evaluaciones evaluacion);
    Optional<Evaluaciones> buscarId(Long id);
    void eliminar(Long id);
}
