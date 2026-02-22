package com.escuelita.www.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.escuelita.www.entity.Usuarios;

public interface UsuariosRepository extends JpaRepository<Usuarios, Long> {
}