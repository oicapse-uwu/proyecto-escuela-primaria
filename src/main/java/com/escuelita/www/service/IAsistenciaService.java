package com.escuelita.www.service;

import java.util.List;
import java.util.Optional;
import com.escuelita.www.entity.Asistencia;

public interface IAsistenciaService {

    List<Asistencia> buscarTodos();

    void guardar(Asistencia asistencia);

    void modificar(Asistencia asistencia);

    Optional<Asistencia> buscarId(Long id);

    void eliminar(Long id);
}