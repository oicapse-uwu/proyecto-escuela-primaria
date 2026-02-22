package com.escuelita.www.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.escuelita.www.entity.Aulas;

public interface AulasRepository extends JpaRepository<Aulas, Long> {

}