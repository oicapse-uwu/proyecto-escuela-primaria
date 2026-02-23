package com.escuelita.www.service;
import java.util.List;
import java.util.Optional;
import com.escuelita.www.entity.PromediosPeriodo;

public interface IPromediosPeriodoService {
    List<PromediosPeriodo> buscarTodos();
    PromediosPeriodo guardar(PromediosPeriodo promediosPeriodo);
    PromediosPeriodo modificar(PromediosPeriodo promediosPeriodo);
    Optional<PromediosPeriodo> buscarId(Long id);
    void eliminar(Long id);
}