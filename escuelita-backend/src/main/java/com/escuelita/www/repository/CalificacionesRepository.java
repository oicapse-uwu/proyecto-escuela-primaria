package com.escuelita.www.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.escuelita.www.entity.Calificaciones;

public interface CalificacionesRepository extends JpaRepository<Calificaciones, Long> {
    @Query("SELECT c FROM Calificaciones c WHERE c.idMatricula.idSeccion.idSede.idSede = :idSede")
    List<Calificaciones> findBySedeId(@Param("idSede") Long idSede);

    @Query("SELECT c FROM Calificaciones c JOIN c.idEvaluacion e JOIN e.idAsignacion a JOIN a.idDocente d WHERE d.idUsuario.idUsuario = :idUsuario")
    List<Calificaciones> findByDocenteUsuarioId(@Param("idUsuario") Long idUsuario);

    // Para portal de padres: calificaciones de un alumno por su idAlumno
    @Query("SELECT c FROM Calificaciones c WHERE c.idMatricula.idAlumno.idAlumno = :idAlumno")
    List<Calificaciones> findByAlumnoId(@Param("idAlumno") Long idAlumno);
}