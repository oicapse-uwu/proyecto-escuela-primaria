package com.escuelita.www.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.escuelita.www.entity.Evaluaciones;

public interface EvaluacionesRepository extends JpaRepository<Evaluaciones, Long> {
}