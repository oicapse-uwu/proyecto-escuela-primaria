package com.escuelita.www.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.escuelita.www.entity.CiclosFacturacion;

@Repository
public interface CiclosFacturacionRepository extends JpaRepository<CiclosFacturacion, Long> {
}