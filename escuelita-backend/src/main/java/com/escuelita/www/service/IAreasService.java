package com.escuelita.www.service;

import java.util.List;
import java.util.Optional;
import com.escuelita.www.entity.Areas;

public interface IAreasService {
    List<Areas> buscarTodos();

    void guardar(Areas area);

    void modificar(Areas area);

    Optional<Areas> buscarId(Long id);

    void eliminar(Long id);
}