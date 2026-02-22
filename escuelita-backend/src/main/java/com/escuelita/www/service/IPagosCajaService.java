package com.escuelita.www.service;

import java.util.List;
import java.util.Optional;
import com.escuelita.www.entity.PagosCaja;

public interface IPagosCajaService {
    List<PagosCaja> buscarTodos();
    void guardar(PagosCaja pagoCaja);
    void modificar(PagosCaja pagoCaja);
    Optional<PagosCaja> buscarId(Long id);
    void eliminar(Long id);
}