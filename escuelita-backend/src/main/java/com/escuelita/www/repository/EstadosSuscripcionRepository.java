package com.escuelita.www.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.escuelita.www.entity.EstadosSuscripcion;

public interface EstadosSuscripcionRepository extends JpaRepository<EstadosSuscripcion, Long> {
    
    // Buscar estado por nombre
    Optional<EstadosSuscripcion> findByNombre(String nombre);
}