package com.escuelita.www.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.escuelita.www.entity.RolModuloPermiso;

public interface RolModuloPermisoRepository extends JpaRepository<RolModuloPermiso, Long> {
	List<RolModuloPermiso> findByIdRol_IdRolIn(List<Long> roleIds);
	
	List<RolModuloPermiso> findByIdRol_IdRol(Long idRol);
	
	List<RolModuloPermiso> findByIdRol_IdRolAndIdModulo_IdModulo(Long idRol, Long idModulo);
	
	@Query("SELECT rmp FROM RolModuloPermiso rmp WHERE rmp.idRol.idRol = :idRol ORDER BY rmp.idModulo.orden ASC")
	List<RolModuloPermiso> findByIdRolOrdenado(@Param("idRol") Long idRol);
}