package com.escuelita.www.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.escuelita.www.entity.Calificaciones;
import com.escuelita.www.service.ICalificacionesService;

@RestController
@RequestMapping("/primaria_bd_real")
public class CalificacionesController {

    @Autowired
    private ICalificacionesService serviceCalificaciones;

    @GetMapping("/calificaciones")
    public List<Calificaciones> buscarTodos() {
        return serviceCalificaciones.buscarTodos();
    }

    @PostMapping("/calificaciones")
    public Calificaciones guardar(@RequestBody Calificaciones calificacion) {
        serviceCalificaciones.guardar(calificacion);
        return calificacion;
    }

    @PutMapping("/calificaciones")
    public Calificaciones modificar(@RequestBody Calificaciones calificacion) {
        serviceCalificaciones.modificar(calificacion);
        return calificacion;
    }

    @GetMapping("/calificaciones/{id}")
    public Optional<Calificaciones> buscarId(@PathVariable("id") Long id) {
        return serviceCalificaciones.buscarId(id);
    }

    @DeleteMapping("/calificaciones/{id}")
    public String eliminar(@PathVariable Long id) {
        serviceCalificaciones.eliminar(id);
        return "Calificación eliminada correctamente";
    }
}