package com.escuelita.www.service;

import java.util.List;
import java.util.Optional;
import com.escuelita.www.entity.MetodosPago;

public interface IMetodosPagoService {
    List<MetodosPago> buscarTodos();  // Devuelve todos los datos
    void guardar(MetodosPago metodoPago); // Registra un dato
    void modificar(MetodosPago metodoPago); // Modifica un metodo de pago
    Optional<MetodosPago> buscarId(Long id); // Devuelve un metodo de pago
    void eliminar(Long id); // Elimina un metodo de pago
}