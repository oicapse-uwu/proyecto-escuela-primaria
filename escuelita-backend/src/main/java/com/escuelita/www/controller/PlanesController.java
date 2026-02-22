package com.escuelita.www.controller;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.escuelita.www.entity.Planes;
import com.escuelita.www.service.IPlanesService;

@RestController
@RequestMapping("/primaria_bd_real")
public class PlanesController {

    @Autowired
    private IPlanesService servicePlanes;

    @GetMapping("/planes")
    public List<Planes> buscartodos() {
        return servicePlanes.buscarTodos();
    }

    @PostMapping("/planes")
    public Planes guardar(@RequestBody Planes plan) {
        servicePlanes.guardar(plan);
        return plan;
    }

    @PutMapping("/planes")
    public Planes modificar(@RequestBody Planes plan) {
        servicePlanes.modificar(plan);
        return plan;
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