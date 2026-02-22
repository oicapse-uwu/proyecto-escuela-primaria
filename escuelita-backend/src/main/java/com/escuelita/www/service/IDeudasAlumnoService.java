package com.escuelita.www.service;

import java.util.List;
import java.util.Optional;
import com.escuelita.www.entity.DeudasAlumno;

public interface IDeudasAlumnoService {
    List<DeudasAlumno> buscarTodos();
    void guardar(DeudasAlumno deudaAlumno);
    void modificar(DeudasAlumno deudaAlumno);
    Optional<DeudasAlumno> buscarId(Long id);
    void eliminar(Long id);
}