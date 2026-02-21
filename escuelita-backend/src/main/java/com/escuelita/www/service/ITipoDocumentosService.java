package com.escuelita.www.service;

import java.util.List;
import java.util.Optional;
import com.escuelita.www.entity.TipoDocumentos;

public interface ITipoDocumentosService {
    List<TipoDocumentos> buscarTodos();
    void guardar(TipoDocumentos tipoDocumento);
    void modificar(TipoDocumentos tipoDocumento);
    Optional<TipoDocumentos> buscarId(Long id);
    void eliminar(Long id);
}