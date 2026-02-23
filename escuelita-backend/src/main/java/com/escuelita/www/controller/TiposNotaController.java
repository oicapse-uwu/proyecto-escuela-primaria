package com.escuelita.www.controller;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.escuelita.www.entity.TiposNota;
import com.escuelita.www.service.ITiposNotaService;

@RestController
@RequestMapping("/restful")
public class TiposNotaController {
    @Autowired
    private ITiposNotaService serviceTiposNota;

    @GetMapping("/tiposnota")
    public List<TiposNota> buscartodos() { return serviceTiposNota.buscarTodos(); }

    @PostMapping("/tiposnota")
    public TiposNota guardar(@RequestBody TiposNota tiposNota) {
        return serviceTiposNota.guardar(tiposNota);
    }

    @PutMapping("/tiposnota")
    public TiposNota modificar(@RequestBody TiposNota tiposNota) {
        return serviceTiposNota.modificar(tiposNota);
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