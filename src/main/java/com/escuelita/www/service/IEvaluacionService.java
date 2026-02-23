package com.escuelita.www.service;

import java.util.List;
import java.util.Optional;
import com.escuelita.www.entity.Evaluacion;

public interface IEvaluacionService {

    List<Evaluacion> buscarTodos();

    void guardar(Evaluacion evaluacion);

    void modificar(Evaluacion evaluacion);

    Optional<Evaluacion> buscarId(Long id);

    void eliminar(Long id);
}