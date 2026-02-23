package com.escuelita.www.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.escuelita.www.entity.PerfilDocente;

@Repository
public interface PerfilDocenteRepository extends JpaRepository<PerfilDocente, Long> {

}