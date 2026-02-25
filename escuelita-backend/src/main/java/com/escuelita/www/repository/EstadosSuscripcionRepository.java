package com.escuelita.www.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.escuelita.www.entity.EstadosSuscripcion;

public interface EstadosSuscripcionRepository extends JpaRepository<EstadosSuscripcion, Long> {
}