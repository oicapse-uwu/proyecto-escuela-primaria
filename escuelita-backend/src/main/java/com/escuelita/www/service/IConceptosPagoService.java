package com.escuelita.www.service;

import java.util.List;
import com.escuelita.www.entity.ConceptosPagoDTO;

public interface IConceptosPagoService {
    List<ConceptosPagoDTO> buscarTodos();
    ConceptosPagoDTO guardar(ConceptosPagoDTO dto);
    ConceptosPagoDTO modificar(ConceptosPagoDTO dto);
    ConceptosPagoDTO buscarId(Long id);
    void eliminar(Long id);
}