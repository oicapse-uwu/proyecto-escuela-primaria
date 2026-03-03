package com.escuelita.www.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.escuelita.www.entity.Calificaciones;

public interface CalificacionesRepository extends JpaRepository<Calificaciones, Long> {
    @Query("SELECT c FROM Calificaciones c WHERE c.idMatricula.idSeccion.idSede.idSede = :idSede")
    List<Calificaciones> findBySedeId(@Param("idSede") Long idSede);
}