package com.escuelita.www.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.escuelita.www.entity.Asistencia;
import com.escuelita.www.service.IAsistenciaService;

@RestController
@RequestMapping("/primaria_bd_real")
public class AsistenciaController {

    @Autowired
    private IAsistenciaService serviceAsistencia;

    @GetMapping("/asistencia")
    public List<Asistencia> buscarTodos() {
        return serviceAsistencia.buscarTodos();
    }

    @PostMapping("/asistencia")
    public Asistencia guardar(@RequestBody Asistencia asistencia) {
        serviceAsistencia.guardar(asistencia);
        return asistencia;
    }

    @PutMapping("/asistencia")
    public Asistencia modificar(@RequestBody Asistencia asistencia) {
        serviceAsistencia.modificar(asistencia);
        return asistencia;
    }

    @GetMapping("/asistencia/{id}")
    public Optional<Asistencia> buscarId(@PathVariable("id") Long id) {
        return serviceAsistencia.buscarId(id);
    }

    @DeleteMapping("/asistencia/{id}")
    public String eliminar(@PathVariable Long id) {
        serviceAsistencia.eliminar(id);
        return "Asistencia eliminada correctamente";
    }
}