package com.escuelita.www.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.escuelita.www.entity.AnioEscolar;

public interface AnioEscolarRepository extends JpaRepository<AnioEscolar, Long> {
    List<AnioEscolar> findByIdSedeIdSede(Long idSede);
}