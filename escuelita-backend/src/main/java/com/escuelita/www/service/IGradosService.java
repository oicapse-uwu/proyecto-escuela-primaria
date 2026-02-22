package com.escuelita.www.service;

import java.util.List;
import com.escuelita.www.entity.GradosDTO;

public interface IGradosService {
    List<GradosDTO> buscarTodos();
    GradosDTO guardar(GradosDTO gradoDTO);
    GradosDTO modificar(GradosDTO gradoDTO);
    GradosDTO buscarId(Long id);
    void eliminar(Long id);
}