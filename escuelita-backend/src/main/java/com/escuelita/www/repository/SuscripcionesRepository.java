package com.escuelita.www.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.escuelita.www.entity.Institucion;
import com.escuelita.www.entity.Suscripciones;

public interface SuscripcionesRepository extends JpaRepository<Suscripciones, Long> {
    
    // Buscar todas las suscripciones de una institución
    List<Suscripciones> findByIdInstitucion(Institucion institucion);
    
    // Buscar suscripción activa de una institución
    @Query("SELECT s FROM Suscripciones s WHERE s.idInstitucion = :institucion AND s.idEstado.nombre = 'Activa'")
    Optional<Suscripciones> findSuscripcionActivaByInstitucion(@Param("institucion") Institucion institucion);
    
    // Buscar suscripciones por estado
    @Query("SELECT s FROM Suscripciones s WHERE s.idEstado.nombre = :nombreEstado")
    List<Suscripciones> findByEstadoNombre(@Param("nombreEstado") String nombreEstado);
    
    // Buscar suscripción por ID de institución
    @Query("SELECT s FROM Suscripciones s WHERE s.idInstitucion.idInstitucion = :idInstitucion AND s.idEstado.nombre = 'Activa'")
    Optional<Suscripciones> findSuscripcionActivaByInstitucionId(@Param("idInstitucion") Long idInstitucion);
}