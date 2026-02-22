package com.escuelita.www.service;

import java.util.List;
import com.escuelita.www.entity.MetodosPagoDTO;

public interface IMetodosPagoService {
    List<MetodosPagoDTO> buscarTodos();
    MetodosPagoDTO guardar(MetodosPagoDTO dto);
    MetodosPagoDTO modificar(MetodosPagoDTO dto);
    MetodosPagoDTO buscarId(Long id);
    void eliminar(Long id);
}