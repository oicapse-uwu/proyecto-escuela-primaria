package com.escuelita.www.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.escuelita.www.entity.Asistencias;

public interface AsistenciasRepository extends JpaRepository<Asistencias, Long> {
    @Query("SELECT a FROM Asistencias a WHERE a.idMatricula.idSeccion.idSede.idSede = :idSede")
    List<Asistencias> findBySedeId(@Param("idSede") Long idSede);
}