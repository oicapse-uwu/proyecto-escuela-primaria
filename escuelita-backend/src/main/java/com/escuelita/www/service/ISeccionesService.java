package com.escuelita.www.service;

import java.util.List;
import com.escuelita.www.entity.SeccionesDTO;

public interface ISeccionesService {
    List<SeccionesDTO> buscarTodos();
    SeccionesDTO guardar(SeccionesDTO seccionDTO);
    SeccionesDTO modificar(SeccionesDTO seccionDTO);
    SeccionesDTO buscarId(Long id);
    void eliminar(Long id);
}