package com.escuelita.www.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.escuelita.www.entity.EstadosSuscripcion;

@Repository
public interface EstadosSuscripcionRepository extends JpaRepository<EstadosSuscripcion, Long> {
}