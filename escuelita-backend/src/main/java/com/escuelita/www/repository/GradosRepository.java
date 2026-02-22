package com.escuelita.www.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.escuelita.www.entity.Grados;

public interface GradosRepository extends JpaRepository<Grados, Long> {
}