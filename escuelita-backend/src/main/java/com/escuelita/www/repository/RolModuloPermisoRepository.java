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
	
	// 🔴 IMPORTANTE: Busca registros sin filtrar por estado
	// Necesita encontrar TODOS los registros (activos e inactivos) para el UPSERT
	@Query("SELECT rmp FROM RolModuloPermiso rmp WHERE rmp.idRol.idRol = :idRol AND rmp.idModulo.idModulo = :idModulo AND rmp.idPermiso.idPermiso = :idPermiso")
	List<RolModuloPermiso> findByIdRol_IdRolAndIdModulo_IdModuloAndIdPermiso_IdPermiso(
		@Param("idRol") Long idRol, @Param("idModulo") Long idModulo, @Param("idPermiso") Long idPermiso);
}