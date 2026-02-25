package com.escuelita.www.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.escuelita.www.entity.TipoDocumentos;

public interface TipoDocumentosRepository extends JpaRepository<TipoDocumentos, Long> {
}