package com.escuelita.www.service;

import java.util.List;
import java.util.Optional;
import com.escuelita.www.entity.PagoDetalle;

public interface IPagoDetalleService {
    List<PagoDetalle> buscarTodos();
    PagoDetalle guardar(PagoDetalle matricula);
    PagoDetalle modificar(PagoDetalle matricula);
    Optional<PagoDetalle> buscarId(Long id);
    void eliminar(Long id); 
}