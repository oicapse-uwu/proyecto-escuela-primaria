package com.escuelita.www.service;

import java.util.List;
import com.escuelita.www.entity.PagoDetalleDTO;

public interface IPagoDetalleService {
    List<PagoDetalleDTO> buscarTodos();
    PagoDetalleDTO guardar(PagoDetalleDTO dto);
    PagoDetalleDTO modificar(PagoDetalleDTO dto);
    PagoDetalleDTO buscarId(Long id);
    void eliminar(Long id);
}