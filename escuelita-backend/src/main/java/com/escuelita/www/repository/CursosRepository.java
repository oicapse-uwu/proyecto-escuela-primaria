package com.escuelita.www.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.escuelita.www.entity.Cursos;

public interface CursosRepository extends JpaRepository<Cursos, Long> {
}