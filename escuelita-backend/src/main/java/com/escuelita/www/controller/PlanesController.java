// Revisado
package com.escuelita.www.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.escuelita.www.entity.Planes;
import com.escuelita.www.service.IPlanesService;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/restful")
public class PlanesController {
    @Autowired
    private IPlanesService servicePlanes;

    @GetMapping("/planes")
    public List<Planes> buscarTodos() {
        return servicePlanes.buscarTodos();
    }
    @PostMapping("/planes")
    public Planes guardar(@RequestBody Planes planes) {
        servicePlanes.guardar(planes);
        return planes;
    }
    @PutMapping("/planes")
    public Planes modificar(@RequestBody Planes planes) {
        servicePlanes.modificar(planes);
        return planes;
    }
    @GetMapping("/planes/{id}")
    public Optional<Planes> buscarId(@PathVariable("id") Long id) {
        return servicePlanes.buscarId(id);
    }
    @DeleteMapping("/planes/{id}")
    public String eliminar(@PathVariable Long id) {
        servicePlanes.eliminar(id);
        return "Plan eliminado correctamente";
    }
}