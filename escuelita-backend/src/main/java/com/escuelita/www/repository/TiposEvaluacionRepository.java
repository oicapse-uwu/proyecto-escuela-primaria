package com.escuelita.www.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.escuelita.www.entity.TiposEvaluacion;

public interface TiposEvaluacionRepository extends JpaRepository<TiposEvaluacion, Long> {
}