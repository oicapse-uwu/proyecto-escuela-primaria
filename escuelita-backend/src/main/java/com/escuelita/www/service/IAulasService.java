package com.escuelita.www.service;

import java.util.List;
import com.escuelita.www.entity.AulasDTO;

public interface IAulasService {
    List<AulasDTO> buscarTodos();
    AulasDTO guardar(AulasDTO aulaDTO);
    AulasDTO modificar(AulasDTO aulaDTO);
    AulasDTO buscarId(Long id);
    void eliminar(Long id);
}