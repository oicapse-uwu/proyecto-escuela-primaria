package com.escuelita.www.controller;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.escuelita.www.entity.AsignacionDocente;
import com.escuelita.www.service.IAsignacionDocenteService;

@RestController
@RequestMapping("/restful")
public class AsignacionDocenteController {

    @Autowired
    private IAsignacionDocenteService serviceAsignacionDocente;

    @GetMapping("/asignaciondocente")
    public List<AsignacionDocente> buscartodos() {
        return serviceAsignacionDocente.buscarTodos();
    }

    @PostMapping("/asignaciondocente")
    public AsignacionDocente guardar(@RequestBody AsignacionDocente asignacion) {
        serviceAsignacionDocente.guardar(asignacion);
        return asignacion;
    }

    @PutMapping("/asignaciondocente")
    public AsignacionDocente modificar(@RequestBody AsignacionDocente asignacion) {
        serviceAsignacionDocente.modificar(asignacion);
        return asignacion;
    }

    @GetMapping("/asignaciondocente/{id}")
    public Optional<AsignacionDocente> buscarId(@PathVariable("id") Long id) {
        return serviceAsignacionDocente.buscarId(id);
    }

    @DeleteMapping("/asignaciondocente/{id}")
    public String eliminar(@PathVariable Long id) {
        serviceAsignacionDocente.eliminar(id);
        return "Asignación de docente eliminada correctamente";
    }
}