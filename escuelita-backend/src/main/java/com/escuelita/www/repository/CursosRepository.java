package com.escuelita.www.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.escuelita.www.entity.Cursos;

@Repository
public interface CursosRepository extends JpaRepository<Cursos, Long> {

}