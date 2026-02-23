package com.escuelita.www.service;

import java.util.List;
import com.escuelita.www.entity.PagosCajaDTO;

public interface IPagosCajaService {
    List<PagosCajaDTO> buscarTodos();
    PagosCajaDTO guardar(PagosCajaDTO dto);
    PagosCajaDTO modificar(PagosCajaDTO dto);
    PagosCajaDTO buscarId(Long id);
    void eliminar(Long id);
}