package com.escuelita.www.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.escuelita.www.entity.Sedes;

public interface SedesRepository extends JpaRepository<Sedes, Long> {
}