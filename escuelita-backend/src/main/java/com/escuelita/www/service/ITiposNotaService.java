package com.escuelita.www.service;

import java.util.List;
import java.util.Optional;
import com.escuelita.www.entity.TiposNota;

public interface ITiposNotaService {
    List<TiposNota> buscarTodos();
    TiposNota guardar(TiposNota tiposNota);
    TiposNota modificar(TiposNota tiposNota);
    Optional<TiposNota> buscarId(Long id);
    void eliminar(Long id);
}