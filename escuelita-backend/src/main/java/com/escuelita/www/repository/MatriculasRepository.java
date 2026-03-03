package com.escuelita.www.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.escuelita.www.entity.Matriculas;

public interface MatriculasRepository extends JpaRepository<Matriculas, Long> {
    @Query("SELECT m FROM Matriculas m WHERE m.idSeccion.idSede.idSede = :idSede")
    List<Matriculas> findBySedeId(@Param("idSede") Long idSede);
}