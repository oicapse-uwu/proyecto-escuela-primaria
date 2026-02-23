package com.escuelita.www.controller;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.escuelita.www.entity.Cursos;
import com.escuelita.www.service.ICursosService;

@RestController
@RequestMapping("/restful")
public class CursosController {

    @Autowired
    private ICursosService serviceCursos;

    @GetMapping("/cursos")
    public List<Cursos> buscartodos() {
        return serviceCursos.buscarTodos();
    }

    @PostMapping("/cursos")
    public Cursos guardar(@RequestBody Cursos curso) {
        return serviceCursos.guardar(curso);
    }

    @PutMapping("/cursos")
    public Cursos modificar(@RequestBody Cursos curso) {
        return serviceCursos.modificar(curso);
    }

    @GetMapping("/cursos/{id}")
    public Optional<Cursos> buscarId(@PathVariable("id") Long id) {
        return serviceCursos.buscarId(id);
    }

    @DeleteMapping("/cursos/{id}")
    public String eliminar(@PathVariable Long id) {
        serviceCursos.eliminar(id);
        return "Curso eliminado correctamente";
    }
}