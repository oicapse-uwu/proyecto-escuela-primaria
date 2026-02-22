package com.escuelita.www.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.escuelita.www.entity.Matriculas;

public interface MatriculasRepository extends JpaRepository<Matriculas, Long> {

}