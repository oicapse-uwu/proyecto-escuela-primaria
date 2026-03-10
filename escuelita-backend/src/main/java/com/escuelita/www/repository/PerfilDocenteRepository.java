package com.escuelita.www.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.escuelita.www.entity.PerfilDocente;

public interface PerfilDocenteRepository extends JpaRepository<PerfilDocente, Long> {
    Optional<PerfilDocente> findByIdUsuario_IdUsuario(Long idUsuario);
}