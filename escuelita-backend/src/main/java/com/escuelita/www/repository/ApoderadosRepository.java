package com.escuelita.www.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.escuelita.www.entity.Apoderados;

public interface ApoderadosRepository extends JpaRepository<Apoderados, Long> {
    
    // Buscar todos los apoderados de una sede
    List<Apoderados> findByIdSedeIdSede(Long idSede);
}