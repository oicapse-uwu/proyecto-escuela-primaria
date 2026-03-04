package com.escuelita.www.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.escuelita.www.entity.UsuarioModuloPermiso;

public interface UsuarioModuloPermisoRepository extends JpaRepository<UsuarioModuloPermiso, Long> {
    // Obtener permisos activos de un usuario
    @Query("SELECT ump FROM UsuarioModuloPermiso ump WHERE ump.idUsuario.idUsuario = :idUsuario AND ump.estado = 1 ORDER BY ump.idModulo.orden ASC")
    List<UsuarioModuloPermiso> findByIdUsuarioActivos(@Param("idUsuario") Long idUsuario);
    
    // Obtener todos los permisos de un usuario (incluyendo borrados)
    @Query("SELECT ump FROM UsuarioModuloPermiso ump WHERE ump.idUsuario.idUsuario = :idUsuario ORDER BY ump.idModulo.orden ASC")
    List<UsuarioModuloPermiso> findByIdUsuarioOrdenado(@Param("idUsuario") Long idUsuario);
    
    // Obtener por usuario-módulo-permiso
    List<UsuarioModuloPermiso> findByIdUsuario_IdUsuarioAndIdModulo_IdModuloAndIdPermiso_IdPermiso(
        Long idUsuario, Long idModulo, Long idPermiso);
}
