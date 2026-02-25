package com.escuelita.www.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.escuelita.www.entity.TiposNota;

public interface TiposNotaRepository extends JpaRepository<TiposNota, Long> {
}