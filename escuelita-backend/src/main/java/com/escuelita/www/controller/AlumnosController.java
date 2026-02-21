package com.escuelita.www.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.escuelita.www.entity.Alumnos;
import com.escuelita.www.service.IAlumnosService;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@RequestMapping("/restful")
public class AlumnosController {
    @Autowired
    private IAlumnosService serviceAlumnos;

    @GetMapping("/alumnos")
    public List<Alumnos> buscartodos() {
        return serviceAlumnos.buscarTodos(); 
    }
    @PostMapping("/alumnos")
    public Alumnos guardar(@RequestBody Alumnos alumno) {
        serviceAlumnos.guardar(alumno);
        return alumno;
    }
    @PutMapping("/alumnos")
    public Alumnos modificar(@RequestBody Alumnos alumno) {
        serviceAlumnos.modificar(alumno);
        return alumno;
    }
    @GetMapping("/alumnos/{id}")
    public Optional<Alumnos> buscarId(@PathVariable("id") Long id){
        return serviceAlumnos.buscarId(id);
    }
    @DeleteMapping("/alumnos/{id}")
    public String eliminar(@PathVariable Long id){
        serviceAlumnos.eliminar(id);
        return "Alumno eliminado";
    }   
}