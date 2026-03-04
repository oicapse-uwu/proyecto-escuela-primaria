package com.escuelita.www.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import com.escuelita.www.entity.RolModuloPermiso;
import com.escuelita.www.entity.Roles;

public interface RolModuloPermisoRepository extends JpaRepository<RolModuloPermiso, Long> {
	List<RolModuloPermiso> findByIdRol_IdRolIn(List<Long> roleIds);
	
	List<RolModuloPermiso> findByIdRol_IdRol(Long idRol);
	
	List<RolModuloPermiso> findByIdRol_IdRolAndIdModulo_IdModulo(Long idRol, Long idModulo);
	
	@Query("SELECT rmp FROM RolModuloPermiso rmp WHERE rmp.idRol.idRol = :idRol ORDER BY rmp.idModulo.orden ASC")
	List<RolModuloPermiso> findByIdRolOrdenado(@Param("idRol") Long idRol);
	
	// Obtener solo asignaciones ACTIVAS (estado=1)
	@Query("SELECT rmp FROM RolModuloPermiso rmp WHERE rmp.idRol.idRol = :idRol AND rmp.estado = 1 ORDER BY rmp.idModulo.orden ASC")
	List<RolModuloPermiso> findByIdRolActivos(@Param("idRol") Long idRol);
	
	// 🔴 SQL NATIVO: Busca registros sin filtro de estado (ignora @Where automático)
	// Necesita encontrar TODOS los registros (activos e inactivos) para el UPSERT
	@Query(value = "SELECT * FROM rol_modulo_permiso WHERE id_rol = :idRol AND id_modulo = :idModulo AND id_permiso = :idPermiso", nativeQuery = true)
	List<RolModuloPermiso> findByIdRol_IdRolAndIdModulo_IdModuloAndIdPermiso_IdPermiso(
		@Param("idRol") Long idRol, @Param("idModulo") Long idModulo, @Param("idPermiso") Long idPermiso);

	// ✅ VALIDACIÓN DE PERMISOS EN BACKEND
	// Usado por @RequierePermiso annotation
	// Verifica si un rol tiene un permiso específico en un módulo
	@Query(value = "SELECT COUNT(*) > 0 FROM rol_modulo_permiso rmp " +
		"INNER JOIN modulos m ON rmp.id_modulo = m.id_modulo " +
		"INNER JOIN permisos p ON rmp.id_permiso = p.id_permiso " +
		"WHERE rmp.id_rol = :idRol AND m.id_modulo = :idModulo AND p.codigo = :codigo AND rmp.estado = :estado",
		nativeQuery = true)
	boolean existsByIdRol_IdRolAndIdModulo_IdModuloAndIdPermiso_CodigoAndEstado(
		@Param("idRol") Integer idRol, 
		@Param("idModulo") Integer idModulo, 
		@Param("codigo") String codigo,
		@Param("estado") Integer estado);
}