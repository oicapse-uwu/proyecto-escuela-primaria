package com.escuelita.www.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.escuelita.www.entity.PagoDetalle;

public interface PagoDetalleRepository extends JpaRepository<PagoDetalle, Long> {
}