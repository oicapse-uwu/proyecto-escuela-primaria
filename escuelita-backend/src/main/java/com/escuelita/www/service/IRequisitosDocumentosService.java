package com.escuelita.www.service;

import java.util.List;
import java.util.Optional;

import com.escuelita.www.entity.RequisitosDocumentos;

public interface IRequisitosDocumentosService {
    List<RequisitosDocumentos> buscarTodos();
    void guardar(RequisitosDocumentos requisitosdocumentos);
    void modificar(RequisitosDocumentos requisitosdocumentos);
    Optional<RequisitosDocumentos> buscarId(Long id);
    void eliminar(Long id); 
}