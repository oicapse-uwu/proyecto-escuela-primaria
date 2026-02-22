package com.escuelita.www.service;

import java.util.List;
import java.util.Optional;
import com.escuelita.www.entity.RegistrosApi;

public interface IRegistrosApiService {
    List<RegistrosApi> buscarTodos();
    RegistrosApi guardar(RegistrosApi registro);
    RegistrosApi modificar(RegistrosApi registro);
    Optional<RegistrosApi> buscarId(Long id);
    void eliminar(Long id);
}