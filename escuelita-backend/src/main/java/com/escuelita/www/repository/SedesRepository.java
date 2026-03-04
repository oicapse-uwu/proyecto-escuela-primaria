package com.escuelita.www.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.escuelita.www.entity.Institucion;
import com.escuelita.www.entity.Sedes;

public interface SedesRepository extends JpaRepository<Sedes, Long> {
    
    // Buscar todas las sedes de una institución
    List<Sedes> findByIdInstitucion(Institucion institucion);
    
    // Buscar sedes activas de una institución
    @Query("SELECT s FROM Sedes s WHERE s.idInstitucion.idInstitucion = :idInstitucion AND s.estado = 1")
    List<Sedes> findSedesActivasByInstitucionId(@Param("idInstitucion") Long idInstitucion);
    
    // Contar sedes activas de una institución
    @Query("SELECT COUNT(s) FROM Sedes s WHERE s.idInstitucion.idInstitucion = :idInstitucion AND s.estado = 1")
    Long countSedesActivasByInstitucionId(@Param("idInstitucion") Long idInstitucion);
}