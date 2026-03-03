package com.escuelita.www.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.escuelita.www.entity.Secciones;

public interface SeccionesRepository extends JpaRepository<Secciones, Long> {
    
    // Buscar todas las secciones de una sede
    List<Secciones> findByIdSedeIdSede(Long idSede);
}