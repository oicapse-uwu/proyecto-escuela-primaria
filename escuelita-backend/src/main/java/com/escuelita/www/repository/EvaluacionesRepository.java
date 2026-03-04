package com.escuelita.www.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.escuelita.www.entity.Evaluaciones;

public interface EvaluacionesRepository extends JpaRepository<Evaluaciones, Long> {
    @Query("SELECT e FROM Evaluaciones e WHERE e.idAsignacion.idSeccion.idSede.idSede = :idSede")
    List<Evaluaciones> findBySedeId(@Param("idSede") Long idSede);
}