package com.escuelita.www.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.escuelita.www.entity.Usuarios;

public interface UsuariosRepository extends JpaRepository<Usuarios, Long> {
    Optional<Usuarios> findByUsuario(String usuario);
    List<Usuarios> findByIdSedeIdSede(Long idSede);
}