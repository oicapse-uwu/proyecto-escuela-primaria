package com.escuelita.www.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.escuelita.www.entity.Calificaciones;

public interface CalificacionesRepository extends JpaRepository<Calificaciones, Long> {
}