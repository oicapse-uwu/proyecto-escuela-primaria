package com.escuelita.www.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.escuelita.www.entity.TiposEvaluacion;

@Repository
public interface TiposEvaluacionRepository extends JpaRepository<TiposEvaluacion, Long> {
}