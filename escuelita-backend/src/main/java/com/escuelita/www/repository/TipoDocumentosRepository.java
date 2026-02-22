package com.escuelita.www.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.escuelita.www.entity.TipoDocumentos;

@Repository
public interface TipoDocumentosRepository extends JpaRepository<TipoDocumentos, Long> {
}