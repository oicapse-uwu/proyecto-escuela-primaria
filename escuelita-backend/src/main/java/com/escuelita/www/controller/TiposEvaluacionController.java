// Revisado
package com.escuelita.www.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.escuelita.www.entity.TiposEvaluacion;
import com.escuelita.www.service.ITiposEvaluacionService;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/restful")
public class TiposEvaluacionController {
    @Autowired
    private ITiposEvaluacionService serviceTiposEvaluacion;
    
    @GetMapping("/tiposevaluacion")
    public List<TiposEvaluacion> buscarTodos() {
        return serviceTiposEvaluacion.buscarTodos(); 
    }
    @PostMapping("/tiposevaluacion")
    public TiposEvaluacion guardar(@RequestBody TiposEvaluacion tiposEvaluacion) {
        serviceTiposEvaluacion.guardar(tiposEvaluacion);
        return tiposEvaluacion;
    }
    @PutMapping("/tiposevaluacion")
    public TiposEvaluacion modificar(@RequestBody TiposEvaluacion tiposEvaluacion) {
        serviceTiposEvaluacion.modificar(tiposEvaluacion);
        return tiposEvaluacion;
    }
    @GetMapping("/tiposevaluacion/{id}")
    public Optional<TiposEvaluacion> buscarId(@PathVariable("id") Long id){
        return serviceTiposEvaluacion.buscarId(id);
    }
    @DeleteMapping("/tiposevaluacion/{id}")
    public String eliminar(@PathVariable Long id){
        serviceTiposEvaluacion.eliminar(id);
        return "Tipo de evaluación eliminado correctamente";
    }
}