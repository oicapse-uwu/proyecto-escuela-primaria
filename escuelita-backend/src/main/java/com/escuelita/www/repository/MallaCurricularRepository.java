package com.escuelita.www.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.escuelita.www.entity.MallaCurricular;

public interface MallaCurricularRepository extends JpaRepository<MallaCurricular, Long> {
}