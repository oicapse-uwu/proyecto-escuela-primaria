package com.escuelita.www.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.escuelita.www.entity.Horarios;

public interface HorariosRepository extends JpaRepository<Horarios, Long> {
    @Query("SELECT h FROM Horarios h WHERE h.idAula.idSede.idSede = :idSede")
    List<Horarios> findBySedeId(@Param("idSede") Long idSede);
}