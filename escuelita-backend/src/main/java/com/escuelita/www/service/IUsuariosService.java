package com.escuelita.www.service;

import java.util.List;
import java.util.Optional;
import com.escuelita.www.entity.Usuarios;

public interface IUsuariosService {
    List<Usuarios> buscarTodos();
    Usuarios guardar(Usuarios usuario);
    Usuarios modificar(Usuarios usuario);
    Optional<Usuarios> buscarId(Long id);
    void eliminar(Long id);
}