package com.escuelita.www.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.escuelita.www.entity.Roles;

public interface RolesRepository extends JpaRepository<Roles, Long> {
}