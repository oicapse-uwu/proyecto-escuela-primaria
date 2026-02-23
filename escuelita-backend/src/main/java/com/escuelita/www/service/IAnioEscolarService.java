package com.escuelita.www.service;

import java.util.List;
import java.util.Optional;

import com.escuelita.www.entity.AnioEscolar;

public interface IAnioEscolarService {
    List<AnioEscolar> buscarTodos();
    AnioEscolar guardar(AnioEscolar anioescolar);
    AnioEscolar modificar(AnioEscolar anioescolar);
    Optional<AnioEscolar> buscarId(Long id);
    void eliminar(Long id); 
}