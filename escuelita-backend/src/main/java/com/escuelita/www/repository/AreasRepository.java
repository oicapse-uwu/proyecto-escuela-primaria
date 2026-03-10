package com.escuelita.www.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.escuelita.www.entity.Areas;

public interface AreasRepository extends JpaRepository<Areas, Long> {
    // Las áreas ahora son globales, no tienen sede
    // No se requieren métodos de filtrado adicionales
}