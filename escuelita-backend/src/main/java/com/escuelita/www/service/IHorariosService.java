package com.escuelita.www.service;

import java.util.List;
import java.util.Optional;
import com.escuelita.www.entity.Horarios;

public interface IHorariosService {
    List<Horarios> buscarTodos();

    void guardar(Horarios horario);

    void modificar(Horarios horario);

    Optional<Horarios> buscarId(Long id);

    void eliminar(Long id);
}