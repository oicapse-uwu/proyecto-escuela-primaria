package com.escuelita.www.service;

import java.util.List;
import com.escuelita.www.entity.PeriodosDTO;

public interface IPeriodosService {
    List<PeriodosDTO> buscarTodos();
    PeriodosDTO guardar(PeriodosDTO periodoDTO);
    PeriodosDTO modificar(PeriodosDTO periodoDTO);
    PeriodosDTO buscarId(Long id);
    void eliminar(Long id);
}