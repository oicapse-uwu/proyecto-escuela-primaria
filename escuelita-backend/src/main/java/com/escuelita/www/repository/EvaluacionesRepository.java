package com.escuelita.www.repository;

import com.escuelita.www.entity.Evaluaciones;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EvaluacionesRepository extends JpaRepository<Evaluaciones, Long> {
}