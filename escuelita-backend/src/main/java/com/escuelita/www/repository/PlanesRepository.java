package com.escuelita.www.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.escuelita.www.entity.Planes;

@Repository
public interface PlanesRepository extends JpaRepository<Planes, Long> {
}