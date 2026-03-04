package com.escuelita.www.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.escuelita.www.entity.Aulas;

public interface AulasRepository extends JpaRepository<Aulas, Long> {
    
    // Buscar todas las aulas de una sede
    List<Aulas> findByIdSedeIdSede(Long idSede);
}