package com.escuelita.www.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.escuelita.www.entity.LimitesSedesSuscripcion;
import com.escuelita.www.entity.Sedes;
import com.escuelita.www.entity.Suscripciones;

public interface LimitesSedesSuscripcionRepository extends JpaRepository<LimitesSedesSuscripcion, Long> {
    
    // Buscar todos los límites de una suscripción
    List<LimitesSedesSuscripcion> findByIdSuscripcion(Suscripciones suscripcion);
    
    // Buscar todos los límites de una suscripción por ID
    @Query("SELECT l FROM LimitesSedesSuscripcion l WHERE l.idSuscripcion.idSuscripcion = :idSuscripcion")
    List<LimitesSedesSuscripcion> findByIdSuscripcionId(@Param("idSuscripcion") Long idSuscripcion);
    
    // Buscar límite específico de una sede en una suscripción
    Optional<LimitesSedesSuscripcion> findByIdSuscripcionAndIdSede(Suscripciones suscripcion, Sedes sede);
    
    // Buscar por suscripción y sede usando IDs
    @Query("SELECT l FROM LimitesSedesSuscripcion l WHERE l.idSuscripcion.idSuscripcion = :idSuscripcion AND l.idSede.idSede = :idSede")
    Optional<LimitesSedesSuscripcion> findByIdSuscripcionIdAndIdSedeId(@Param("idSuscripcion") Long idSuscripcion, @Param("idSede") Long idSede);
    
    // Eliminar todos los límites de una suscripción
    void deleteByIdSuscripcion(Suscripciones suscripcion);
    
    // Contar cuántas sedes tienen límites asignados en una suscripción
    @Query("SELECT COUNT(l) FROM LimitesSedesSuscripcion l WHERE l.idSuscripcion.idSuscripcion = :idSuscripcion")
    Long countByIdSuscripcionId(@Param("idSuscripcion") Long idSuscripcion);
}
