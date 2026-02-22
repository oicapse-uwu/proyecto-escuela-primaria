package com.escuelita.www.service;

import java.util.List;
import com.escuelita.www.entity.DeudasAlumnoDTO;

public interface IDeudasAlumnoService {
    List<DeudasAlumnoDTO> buscarTodos();
    DeudasAlumnoDTO guardar(DeudasAlumnoDTO dto);
    DeudasAlumnoDTO modificar(DeudasAlumnoDTO dto);
    DeudasAlumnoDTO buscarId(Long id);
    void eliminar(Long id);
}