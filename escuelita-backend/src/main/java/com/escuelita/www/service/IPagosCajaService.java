package com.escuelita.www.service;

import java.util.List;
import java.util.Optional;
import com.escuelita.www.entity.PagosCaja;

public interface IPagosCajaService {

    List<PagosCaja> buscarTodos();
    PagosCaja guardar(PagosCaja pagoscaja);
    PagosCaja modificar(PagosCaja pagoscaja);
    Optional<PagosCaja> buscarId(Long id);
    void eliminar(Long id);
}