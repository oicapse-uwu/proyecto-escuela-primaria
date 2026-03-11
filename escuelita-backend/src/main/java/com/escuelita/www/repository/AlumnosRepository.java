package com.escuelita.www.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.escuelita.www.entity.Alumnos;

public interface AlumnosRepository extends JpaRepository<Alumnos, Long> {
    
    // Buscar todos los alumnos de una sede
    List<Alumnos> findByIdSedeIdSede(Long idSede);

    // Buscar alumno por DNI y sede (para portal de padres)
    @Query("SELECT a FROM Alumnos a WHERE a.numeroDocumento = :dni AND a.idSede.idSede = :idSede AND a.estado = 1")
    java.util.Optional<Alumnos> findByDniAndSede(@Param("dni") String dni, @Param("idSede") Long idSede);
    
    // Contar alumnos activos de una sede (Los alumnos con estado=1 se consideran activos)
    @Query("SELECT COUNT(a) FROM Alumnos a WHERE a.idSede.idSede = :idSede AND a.estado = 1")
    long countAlumnosActivosBySede(@Param("idSede") Long idSede);
}