package com.escuelita.www.service;

import java.util.List;
import java.util.Optional;
import com.escuelita.www.entity.RolModuloPermiso;

public interface IRolModuloPermisoService {
    List<RolModuloPermiso> buscarTodos();
    RolModuloPermiso guardar(RolModuloPermiso rmp);
    RolModuloPermiso modificar(RolModuloPermiso rmp);
    Optional<RolModuloPermiso> buscarId(Long id);
    void eliminar(Long id);
}