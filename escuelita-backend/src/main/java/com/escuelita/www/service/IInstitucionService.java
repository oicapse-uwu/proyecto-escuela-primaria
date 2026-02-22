package com.escuelita.www.service;

import java.util.List;
import java.util.Optional;
import com.escuelita.www.entity.Institucion;

public interface IInstitucionService {
    List<Institucion> buscarTodos();
    void guardar(Institucion institucion);
    void modificar(Institucion institucion);
    Optional<Institucion> buscarId(Long id);
    void eliminar(Long id);
}