package com.escuelita.www.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.escuelita.www.entity.PromediosPeriodo;

public interface PromediosPeriodoRepository extends JpaRepository<PromediosPeriodo, Long> {
}