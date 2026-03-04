package com.escuelita.www.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.escuelita.www.entity.Alumnos;

public interface AlumnosRepository extends JpaRepository<Alumnos, Long> {
    
    // Buscar todos los alumnos de una sede
    List<Alumnos> findByIdSedeIdSede(Long idSede);
    
    // Contar alumnos activos de una sede (estado_alumno = 'ACTIVO')
    @Query("SELECT COUNT(a) FROM Alumnos a WHERE a.idSede.idSede = :idSede AND UPPER(a.estadoAlumno) = 'ACTIVO'")
    long countAlumnosActivosBySede(@Param("idSede") Long idSede);
}