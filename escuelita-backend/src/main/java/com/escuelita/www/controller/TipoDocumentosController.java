package com.escuelita.www.controller;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.escuelita.www.entity.TipoDocumentos;
import com.escuelita.www.service.ITipoDocumentosService;

@RestController
@RequestMapping("/primaria_bd_real")
public class TipoDocumentosController {

    @Autowired
    private ITipoDocumentosService serviceTipoDocs;

    @GetMapping("/tipodocumentos")
    public List<TipoDocumentos> buscartodos() {
        return serviceTipoDocs.buscarTodos();
    }

    @PostMapping("/tipodocumentos")
    public TipoDocumentos guardar(@RequestBody TipoDocumentos tipoDocumento) {
        serviceTipoDocs.guardar(tipoDocumento);
        return tipoDocumento;
    }

    @PutMapping("/tipodocumentos")
    public TipoDocumentos modificar(@RequestBody TipoDocumentos tipoDocumento) {
        serviceTipoDocs.modificar(tipoDocumento);
        return tipoDocumento;
    }

    @GetMapping("/tipodocumentos/{id}")
    public Optional<TipoDocumentos> buscarId(@PathVariable("id") Long id) {
        return serviceTipoDocs.buscarId(id);
    }

    @DeleteMapping("/tipodocumentos/{id}")
    public String eliminar(@PathVariable Long id) {
        serviceTipoDocs.eliminar(id);
        return "Tipo de documento eliminado correctamente";
    }
}