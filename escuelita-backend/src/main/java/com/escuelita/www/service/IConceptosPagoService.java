package com.escuelita.www.service;

import java.util.List;
import java.util.Optional;
import com.escuelita.www.entity.ConceptosPago;

public interface IConceptosPagoService {
    List<ConceptosPago> buscarTodos();
    void guardar(ConceptosPago conceptoPago);
    void modificar(ConceptosPago conceptoPago);
    Optional<ConceptosPago> buscarId(Long id);
    void eliminar(Long id);
}