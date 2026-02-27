package com.escuelita.www.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.escuelita.www.entity.SuperAdmins;

public interface SuperAdminsRepository extends JpaRepository<SuperAdmins, Long> {
    Optional<SuperAdmins> findByUsuario(String usuario);
}
