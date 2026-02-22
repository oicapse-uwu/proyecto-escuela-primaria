package com.escuelita.www.service;

import java.util.List;
import com.escuelita.www.entity.AnioEscolarDTO; 

public interface IAnioEscolarService {
    List<AnioEscolarDTO> buscarTodos();
    AnioEscolarDTO guardar(AnioEscolarDTO anioEscolarDTO);
    AnioEscolarDTO modificar(AnioEscolarDTO anioEscolarDTO);
    AnioEscolarDTO buscarId(Long id);
    void eliminar(Long id);
}