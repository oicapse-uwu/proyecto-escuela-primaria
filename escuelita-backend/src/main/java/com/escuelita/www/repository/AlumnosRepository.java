package com.escuelita.www.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.escuelita.www.entity.Alumnos;

public interface AlumnosRepository extends JpaRepository<Alumnos, Long> {

}