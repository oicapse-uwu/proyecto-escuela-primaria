package com.escuelita.www.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.escuelita.www.entity.Evaluacion;
import com.escuelita.www.service.IEvaluacionService;

@RestController
@RequestMapping("/primaria_bd_real")
public class EvaluacionController {

    @Autowired
    private IEvaluacionService serviceEvaluacion;

    @GetMapping("/evaluacion")
    public List<Evaluacion> buscarTodos() {
        return serviceEvaluacion.buscarTodos();
    }

    @PostMapping("/evaluacion")
    public Evaluacion guardar(@RequestBody Evaluacion evaluacion) {
        serviceEvaluacion.guardar(evaluacion);
        return evaluacion;
    }

    @PutMapping("/evaluacion")
    public Evaluacion modificar(@RequestBody Evaluacion evaluacion) {
        serviceEvaluacion.modificar(evaluacion);
        return evaluacion;
    }

    @GetMapping("/evaluacion/{id}")
    public Optional<Evaluacion> buscarId(@PathVariable("id") Long id) {
        return serviceEvaluacion.buscarId(id);
    }

    @DeleteMapping("/evaluacion/{id}")
    public String eliminar(@PathVariable Long id) {
        serviceEvaluacion.eliminar(id);
        return "Evaluación eliminada correctamente";
    }
}