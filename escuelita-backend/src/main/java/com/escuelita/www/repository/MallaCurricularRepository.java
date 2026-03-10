package com.escuelita.www.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.escuelita.www.entity.MallaCurricular;

public interface MallaCurricularRepository extends JpaRepository<MallaCurricular, Long> {
    @Query("SELECT mc FROM MallaCurricular mc WHERE mc.idSede.idSede = :idSede")
    List<MallaCurricular> findBySedeId(@Param("idSede") Long idSede);
}