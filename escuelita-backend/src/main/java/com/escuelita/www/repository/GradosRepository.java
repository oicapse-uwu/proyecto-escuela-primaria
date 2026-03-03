package com.escuelita.www.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.escuelita.www.entity.Grados;

public interface GradosRepository extends JpaRepository<Grados, Long> {
    
    // Buscar todos los grados de una sede
    List<Grados> findByIdSedeIdSede(Long idSede);
}