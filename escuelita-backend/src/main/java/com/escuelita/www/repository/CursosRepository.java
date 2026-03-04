package com.escuelita.www.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.escuelita.www.entity.Cursos;

public interface CursosRepository extends JpaRepository<Cursos, Long> {
    @Query("SELECT c FROM Cursos c WHERE c.idArea.idSede.idSede = :idSede")
    List<Cursos> findBySedeId(@Param("idSede") Long idSede);
}