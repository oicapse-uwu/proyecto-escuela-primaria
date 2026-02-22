package com.escuelita.www.service;

import java.util.List;
import java.util.Optional;
import com.escuelita.www.entity.Modulos;

public interface IModulosService {
    List<Modulos> buscarTodos();
    void guardar(Modulos modulo);
    void modificar(Modulos modulo);
    Optional<Modulos> buscarId(Long id);
    void eliminar(Long id);
}