package com.escuelita.www.service;

import java.util.List;
import java.util.Optional;
import com.escuelita.www.entity.CiclosFacturacion;

public interface ICiclosFacturacionService {
    List<CiclosFacturacion> buscarTodos();
    void guardar(CiclosFacturacion ciclo);
    void modificar(CiclosFacturacion ciclo);
    Optional<CiclosFacturacion> buscarId(Long id);
    void eliminar(Long id);
}