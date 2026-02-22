package com.escuelita.www.service;

import java.util.List;
import com.escuelita.www.entity.SedesDTO;

public interface ISedesService {
    List<SedesDTO> buscarTodos();
    SedesDTO guardar(SedesDTO sedeDTO);
    SedesDTO modificar(SedesDTO sedeDTO);
    SedesDTO buscarId(Long id);
    void eliminar(Long id);
}