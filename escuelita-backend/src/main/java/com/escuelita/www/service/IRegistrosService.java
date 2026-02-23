package com.escuelita.www.service;

import java.util.List;
import java.util.Optional;

import com.escuelita.www.entity.Registros;

public interface IRegistrosService {
    List<Registros> buscarTodos();  // Devuelve todos los datos
    void guardar(Registros registro); // Registra un dato
    void modificar(Registros registro); // Modifica un registro
    Optional<Registros> buscarId(Integer id); // Devuele un registro
    void eliminar(Integer id); // Elimina un registro
}
