package com.escuelita.www.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.escuelita.www.entity.Usuarios;

public interface UsuariosRepository extends JpaRepository<Usuarios, Long> {
    Optional<Usuarios> findByUsuario(String usuario);
    java.util.List<Usuarios> findByIdSede_IdSede(Long idSede);
}