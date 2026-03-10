package com.escuelita.www.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.escuelita.www.entity.AsignacionDocente;

public interface AsignacionDocenteRepository extends JpaRepository<AsignacionDocente, Long> {
    @Query("SELECT a FROM AsignacionDocente a JOIN a.idSeccion s WHERE s.idSede.idSede = :idSede")
    List<AsignacionDocente> findBySedeId(@Param("idSede") Long idSede);
}