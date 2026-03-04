package com.escuelita.www.service;

import java.util.List;

import com.escuelita.www.entity.UsuarioModuloPermiso;

public interface IUsuarioModuloPermisoService {
    List<UsuarioModuloPermiso> buscarTodos();
    List<UsuarioModuloPermiso> buscarPorUsuarioId(Long idUsuario);
    List<UsuarioModuloPermiso> buscarPorUsuarioIdOrdenado(Long idUsuario);
    UsuarioModuloPermiso guardar(UsuarioModuloPermiso usuarioModuloPermiso);
    UsuarioModuloPermiso modificar(UsuarioModuloPermiso usuarioModuloPermiso);
    UsuarioModuloPermiso buscarPorId(Long idUmp);
    void eliminar(Long idUmp);
}
