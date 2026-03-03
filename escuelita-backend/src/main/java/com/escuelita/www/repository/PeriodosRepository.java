package com.escuelita.www.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.escuelita.www.entity.Periodos;

public interface PeriodosRepository extends JpaRepository<Periodos, Long> {
    @Query("SELECT p FROM Periodos p WHERE p.idAnio.idSede.idSede = :idSede")
    List<Periodos> findBySedeId(@Param("idSede") Long idSede);
}