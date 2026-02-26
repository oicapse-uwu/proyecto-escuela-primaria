package com.escuelita.www.service;

import java.util.List;
import java.util.Optional;
import com.escuelita.www.entity.MetodosPago;

public interface IMetodosPagoService {
    List<MetodosPago> buscarTodos();
    void guardar(MetodosPago metodospago);
    void modificar(MetodosPago metodospago);
    Optional<MetodosPago> buscarId(Long id);
    void eliminar(Long id);
}