package com.escuelita.www.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.escuelita.www.entity.AnioEscolar;

public interface AnioEscolarRepository extends JpaRepository<AnioEscolar, Long> {
}