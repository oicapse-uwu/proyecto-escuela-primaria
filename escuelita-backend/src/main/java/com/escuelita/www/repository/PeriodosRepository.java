package com.escuelita.www.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.escuelita.www.entity.Periodos;

public interface PeriodosRepository extends JpaRepository<Periodos, Long> {

}