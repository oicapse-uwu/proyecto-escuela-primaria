package com.escuelita.www.service;
import java.util.List;
import java.util.Optional;
import com.escuelita.www.entity.Asistencias;

public interface IAsistenciasService {
    List<Asistencias> buscarTodos();
    Asistencias guardar(Asistencias asistencias);
    Asistencias modificar(Asistencias asistencias);
    Optional<Asistencias> buscarId(Long id);
    void eliminar(Long id);
}