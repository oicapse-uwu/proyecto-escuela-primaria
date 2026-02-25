package com.escuelita.www.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.escuelita.www.entity.Especialidades;

public interface EspecialidadesRepository extends JpaRepository<Especialidades, Long> {
}