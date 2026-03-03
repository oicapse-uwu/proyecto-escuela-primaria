package com.escuelita.www.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.escuelita.www.entity.Alumnos;

public interface AlumnosRepository extends JpaRepository<Alumnos, Long> {
    
    // Buscar todos los alumnos de una sede
    List<Alumnos> findByIdSedeIdSede(Long idSede);
}