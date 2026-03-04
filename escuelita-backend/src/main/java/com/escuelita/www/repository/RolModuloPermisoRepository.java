package com.escuelita.www.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.escuelita.www.entity.RolModuloPermiso;

public interface RolModuloPermisoRepository extends JpaRepository<RolModuloPermiso, Long> {
	List<RolModuloPermiso> findByIdRol_IdRolIn(List<Long> roleIds);
}