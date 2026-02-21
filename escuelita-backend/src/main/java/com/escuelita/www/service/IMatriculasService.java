package com.escuelita.www.service;

import java.util.List;
import java.util.Optional;

import com.escuelita.www.entity.Matriculas;

public interface IMatriculasService {
    List<Matriculas> buscarTodos();
    void guardar(Matriculas matricula);
    void modificar(Matriculas matricula);
    Optional<Matriculas> buscarId(Long id);
    void eliminar(Long id); 
}