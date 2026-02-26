package com.escuelita.www.service;

import java.util.List;
import java.util.Optional;
import com.escuelita.www.entity.ConceptosPago;

public interface IConceptosPagoService {
    List<ConceptosPago> buscarTodos();
    ConceptosPago guardar(ConceptosPago conceptospago);
    ConceptosPago modificar(ConceptosPago conceptospago);
    Optional<ConceptosPago> buscarId(Long id);
    void eliminar(Long id);
}