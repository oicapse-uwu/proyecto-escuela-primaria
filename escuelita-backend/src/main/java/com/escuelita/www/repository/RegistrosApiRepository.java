package com.escuelita.www.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.escuelita.www.entity.RegistrosApi;

public interface RegistrosApiRepository extends JpaRepository<RegistrosApi, Long> {
}