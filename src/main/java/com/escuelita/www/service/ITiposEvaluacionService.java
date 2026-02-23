package com.escuelita.www.service;

import java.util.List;
import java.util.Optional;
import com.escuelita.www.entity.TiposEvaluacion;

public interface ITiposEvaluacionService {

    List<TiposEvaluacion> buscarTodos();

    void guardar(TiposEvaluacion tipo);

    void modificar(TiposEvaluacion tipo);

    Optional<TiposEvaluacion> buscarId(Long id);

    void eliminar(Long id);
}