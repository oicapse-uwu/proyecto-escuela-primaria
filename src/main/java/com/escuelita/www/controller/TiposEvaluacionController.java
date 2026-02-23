package com.escuelita.www.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.escuelita.www.entity.TiposEvaluacion;
import com.escuelita.www.service.ITiposEvaluacionService;

@RestController
@RequestMapping("/primaria_bd_real")
public class TiposEvaluacionController {

    @Autowired
    private ITiposEvaluacionService serviceTiposEvaluacion;

    @GetMapping("/tiposevaluacion")
    public List<TiposEvaluacion> buscarTodos() {
        return serviceTiposEvaluacion.buscarTodos();
    }

    @PostMapping("/tiposevaluacion")
    public TiposEvaluacion guardar(@RequestBody TiposEvaluacion tipo) {
        serviceTiposEvaluacion.guardar(tipo);
        return tipo;
    }

    @PutMapping("/tiposevaluacion")
    public TiposEvaluacion modificar(@RequestBody TiposEvaluacion tipo) {
        serviceTiposEvaluacion.modificar(tipo);
        return tipo;
    }

    @GetMapping("/tiposevaluacion/{id}")
    public Optional<TiposEvaluacion> buscarId(@PathVariable("id") Long id) {
        return serviceTiposEvaluacion.buscarId(id);
    }

    @DeleteMapping("/tiposevaluacion/{id}")
    public String eliminar(@PathVariable Long id) {
        serviceTiposEvaluacion.eliminar(id);
        return "Tipo de evaluación eliminado correctamente";
    }
}