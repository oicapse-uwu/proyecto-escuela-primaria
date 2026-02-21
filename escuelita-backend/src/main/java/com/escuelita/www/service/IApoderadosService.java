package com.escuelita.www.service;

import java.util.List;
import java.util.Optional;

import com.escuelita.www.entity.Apoderados;

public interface IApoderadosService {
    List<Apoderados> buscarTodos();
    void guardar(Apoderados apoderado);
    void modificar(Apoderados apoderado);
    Optional<Apoderados> buscarId(Long id);
    void eliminar(Long id); 
}