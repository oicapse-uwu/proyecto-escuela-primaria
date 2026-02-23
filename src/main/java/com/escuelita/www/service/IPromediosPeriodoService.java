package com.escuelita.www.service;

import java.util.List;
import java.util.Optional;
import com.escuelita.www.entity.PromediosPeriodo;

public interface IPromediosPeriodoService {

    List<PromediosPeriodo> buscarTodos();

    void guardar(PromediosPeriodo promedio);

    void modificar(PromediosPeriodo promedio);

    Optional<PromediosPeriodo> buscarId(Long id);

    void eliminar(Long id);
}