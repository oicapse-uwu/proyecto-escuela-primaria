package com.escuelita.www.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.escuelita.www.entity.TiposNota;
import com.escuelita.www.service.ITiposNotaService;

@RestController
@RequestMapping("/primaria_bd_real")
public class TiposNotaController {

    @Autowired
    private ITiposNotaService serviceTiposNota;

    @GetMapping("/tiposnota")
    public List<TiposNota> buscarTodos() {
        return serviceTiposNota.buscarTodos();
    }

    @PostMapping("/tiposnota")
    public TiposNota guardar(@RequestBody TiposNota tipo) {
        serviceTiposNota.guardar(tipo);
        return tipo;
    }

    @PutMapping("/tiposnota")
    public TiposNota modificar(@RequestBody TiposNota tipo) {
        serviceTiposNota.modificar(tipo);
        return tipo;
    }

    @GetMapping("/tiposnota/{id}")
    public Optional<TiposNota> buscarId(@PathVariable("id") Long id) {
        return serviceTiposNota.buscarId(id);
    }

    @DeleteMapping("/tiposnota/{id}")
    public String eliminar(@PathVariable Long id) {
        serviceTiposNota.eliminar(id);
        return "Tipo de nota eliminado correctamente";
    }
}