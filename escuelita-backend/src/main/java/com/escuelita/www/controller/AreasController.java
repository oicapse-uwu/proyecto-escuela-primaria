package com.escuelita.www.controller;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.escuelita.www.entity.Areas;
import com.escuelita.www.service.IAreasService;

@RestController
@RequestMapping("/restful")
public class AreasController {

    @Autowired
    private IAreasService serviceAreas;

    @GetMapping("/areas")
    public List<Areas> buscartodos() {
        return serviceAreas.buscarTodos();
    }

    @PostMapping("/areas")
    public Areas guardar(@RequestBody Areas area) {
        serviceAreas.guardar(area);
        return area;
    }

    @PutMapping("/areas")
    public Areas modificar(@RequestBody Areas area) {
        serviceAreas.modificar(area);
        return area;
    }

    @GetMapping("/areas/{id}")
    public Optional<Areas> buscarId(@PathVariable("id") Long id) {
        return serviceAreas.buscarId(id);
    }

    @DeleteMapping("/areas/{id}")
    public String eliminar(@PathVariable Long id) {
        serviceAreas.eliminar(id);
        return "Área eliminada correctamente";
    }
}