package com.escuelita.www.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.escuelita.www.entity.AlumnoApoderado;
import com.escuelita.www.service.IAlumnoApoderadoService;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@RequestMapping("/restful")
public class AlumnoApoderadoController {
    @Autowired
    private IAlumnoApoderadoService serviceAlumnoApoderado;

    @GetMapping("/alumnoapoderado")
    public List<AlumnoApoderado> buscartodos() {
        return serviceAlumnoApoderado.buscarTodos(); 
    }
    @PostMapping("/alumnoapoderado")
    public AlumnoApoderado guardar(@RequestBody AlumnoApoderado alumnoapoderado) {
        serviceAlumnoApoderado.guardar(alumnoapoderado);
        return alumnoapoderado;
    }
    @PutMapping("/alumnoapoderado")
    public AlumnoApoderado modificar(@RequestBody AlumnoApoderado alumnoapoderado) {
        serviceAlumnoApoderado.modificar(alumnoapoderado);
        return alumnoapoderado;
    }
    @GetMapping("/alumnoapoderado/{id}")
    public Optional<AlumnoApoderado> buscarId(@PathVariable("id") Long id){
        return serviceAlumnoApoderado.buscarId(id);
    }
    @DeleteMapping("/alumnoapoderado/{id}")
    public String eliminar(@PathVariable Long id){
        serviceAlumnoApoderado.eliminar(id);
        return "Relacion entre Alumno y Apoderado eliminado";
    }   
}