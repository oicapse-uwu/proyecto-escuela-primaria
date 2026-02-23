package com.escuelita.www.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.escuelita.www.entity.Calificaciones;

@Repository
public interface CalificacionesRepository extends JpaRepository<Calificaciones, Long> {
}