package com.escuelita.www.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.escuelita.www.entity.Modulos;

@Repository
public interface ModulosRepository extends JpaRepository<Modulos, Long> {
}