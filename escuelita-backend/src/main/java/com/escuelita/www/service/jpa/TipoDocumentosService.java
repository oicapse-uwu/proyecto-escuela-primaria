package com.escuelita.www.service.jpa;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.escuelita.www.entity.TipoDocumentos;
import com.escuelita.www.repository.TipoDocumentosRepository;
import com.escuelita.www.service.ITipoDocumentosService;

@Service
public class TipoDocumentosService implements ITipoDocumentosService {
    @Autowired
    private TipoDocumentosRepository repoTipoDocs;

    public List<TipoDocumentos> buscarTodos() {
        return repoTipoDocs.findAll();
    }
    @Override
    public void guardar(TipoDocumentos tipoDocumentos) {
        repoTipoDocs.save(tipoDocumentos);
    }
    @Override
    public void modificar(TipoDocumentos tipoDocumentos) {
        repoTipoDocs.save(tipoDocumentos);
    }
    public Optional<TipoDocumentos> buscarId(Long id) {
        return repoTipoDocs.findById(id);
    }
    public void eliminar(Long id) {
        repoTipoDocs.deleteById(id);
    }
}