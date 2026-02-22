package com.escuelita.www.service;

import java.util.List;
import java.util.Optional;
import com.escuelita.www.entity.Permisos;

public interface IPermisosService {
    List<Permisos> buscarTodos();
    void guardar(Permisos permiso);
    void modificar(Permisos permiso);
    Optional<Permisos> buscarId(Long id);
    void eliminar(Long id);
}