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
	
	// Obtener TODAS las asignaciones (activas e inactivas) ordenadas por módulo
	// IMPORTANTE: No filtramos por estado=1 porque necesitamos desactivar los inactivos también
	@Query("SELECT rmp FROM RolModuloPermiso rmp WHERE rmp.idRol.idRol = :idRol ORDER BY rmp.idModulo.orden ASC")
	List<RolModuloPermiso> findByIdRolActivos(@Param("idRol") Long idRol);
	
	// Búsqueda para detectar combinaciones duplicadas (rol-módulo-permiso)
	List<RolModuloPermiso> findByIdRol_IdRolAndIdModulo_IdModuloAndIdPermiso_IdPermiso(
		Long idRol, Long idModulo, Long idPermiso);
}