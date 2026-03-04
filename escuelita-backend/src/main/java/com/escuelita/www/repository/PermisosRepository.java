package com.escuelita.www.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

import com.escuelita.www.entity.Permisos;

public interface PermisosRepository extends JpaRepository<Permisos, Long> {
    List<Permisos> findByIdModulo_IdModulo(Long idModulo);
}