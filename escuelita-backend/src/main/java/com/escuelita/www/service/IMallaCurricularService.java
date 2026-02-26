package com.escuelita.www.service;

import java.util.List;
import java.util.Optional;
import com.escuelita.www.entity.MallaCurricular;

public interface IMallaCurricularService {
    List<MallaCurricular> buscarTodos();

    MallaCurricular guardar(MallaCurricular malla);

    MallaCurricular modificar(MallaCurricular malla);

    Optional<MallaCurricular> buscarId(Long id);

    void eliminar(Long id);
}