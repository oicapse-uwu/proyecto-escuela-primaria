package com.escuelita.www.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.escuelita.www.entity.PromediosPeriodo;

@Repository
public interface PromediosPeriodoRepository extends JpaRepository<PromediosPeriodo, Long> {
}