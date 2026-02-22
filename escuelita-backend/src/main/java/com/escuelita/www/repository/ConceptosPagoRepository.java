package com.escuelita.www.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.escuelita.www.entity.ConceptosPago;

public interface ConceptosPagoRepository extends JpaRepository<ConceptosPago, Long> {
}