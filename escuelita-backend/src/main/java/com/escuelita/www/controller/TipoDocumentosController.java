// Revisado
package com.escuelita.www.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.escuelita.www.entity.TipoDocumentos;
import com.escuelita.www.service.ITipoDocumentosService;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/restful")
public class TipoDocumentosController {
    @Autowired
    private ITipoDocumentosService serviceTipoDocumentos;

    @GetMapping("/tipodocumentos")
    public List<TipoDocumentos> buscarTodos() {
        return serviceTipoDocumentos.buscarTodos(); 
    }
    @PostMapping("/tipodocumentos")
    public TipoDocumentos guardar(@RequestBody TipoDocumentos tipoDocumentos) {
        serviceTipoDocumentos.guardar(tipoDocumentos);
        return tipoDocumentos;
    }
    @PutMapping("/tipodocumentos")
    public TipoDocumentos modificar(@RequestBody TipoDocumentos tipoDocumentos) {
        serviceTipoDocumentos.modificar(tipoDocumentos);
        return tipoDocumentos;
    }
    @GetMapping("/tipodocumentos/{id}")
    public Optional<TipoDocumentos> buscarId(@PathVariable("id") Long id){
        return serviceTipoDocumentos.buscarId(id);
    }
    @DeleteMapping("/tipodocumentos/{id}")
    public String eliminar(@PathVariable Long id){
        serviceTipoDocumentos.eliminar(id);
        return "Tipo de documento eliminado correctamente";
    }
}
