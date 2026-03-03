package com.escuelita.www.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.escuelita.www.entity.Areas;

public interface AreasRepository extends JpaRepository<Areas, Long> {
    
    // Buscar todas las áreas de una sede
    List<Areas> findByIdSedeIdSede(Long idSede);
}