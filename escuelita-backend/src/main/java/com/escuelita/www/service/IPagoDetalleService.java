package com.escuelita.www.service;

import java.util.List;
import java.util.Optional;
import com.escuelita.www.entity.PagoDetalle;

public interface IPagoDetalleService {
    List<PagoDetalle> buscarTodos();
    void guardar(PagoDetalle pagoDetalle);
    void modificar(PagoDetalle pagoDetalle);
    Optional<PagoDetalle> buscarId(Long id);
    void eliminar(Long id);
}