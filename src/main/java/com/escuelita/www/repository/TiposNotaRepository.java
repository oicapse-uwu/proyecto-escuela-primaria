package com.escuelita.www.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.escuelita.www.entity.TiposNota;

@Repository
public interface TiposNotaRepository extends JpaRepository<TiposNota, Long> {
}