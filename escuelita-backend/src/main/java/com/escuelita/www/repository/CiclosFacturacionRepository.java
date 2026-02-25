package com.escuelita.www.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.escuelita.www.entity.CiclosFacturacion;

public interface CiclosFacturacionRepository extends JpaRepository<CiclosFacturacion, Long> {
}