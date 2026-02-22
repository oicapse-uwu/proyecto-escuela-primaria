package com.escuelita.www.service;

import java.util.List;
import java.util.Optional;
import com.escuelita.www.entity.Roles;

public interface IRolesService {
    List<Roles> buscarTodos();
    void guardar(Roles rol);
    void modificar(Roles rol);
    Optional<Roles> buscarId(Long id);
    void eliminar(Long id);
}
