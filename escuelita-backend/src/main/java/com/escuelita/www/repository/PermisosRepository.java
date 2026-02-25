package com.escuelita.www.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.escuelita.www.entity.Permisos;

public interface PermisosRepository extends JpaRepository<Permisos, Long> {
}