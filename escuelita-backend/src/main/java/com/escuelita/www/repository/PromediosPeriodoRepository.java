package com.escuelita.www.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.escuelita.www.entity.PromediosPeriodo;

public interface PromediosPeriodoRepository extends JpaRepository<PromediosPeriodo, Long> {
    @Query("SELECT p FROM PromediosPeriodo p JOIN p.idAsignacion a JOIN a.idDocente d WHERE d.idUsuario.idUsuario = :idUsuario")
    List<PromediosPeriodo> findByDocenteUsuarioId(@Param("idUsuario") Long idUsuario);

    @Query("SELECT p FROM PromediosPeriodo p JOIN p.idAsignacion a JOIN a.idSeccion s WHERE s.idSede.idSede = :idSede")
    List<PromediosPeriodo> findBySedeId(@Param("idSede") Long idSede);
}