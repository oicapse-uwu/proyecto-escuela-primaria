package com.escuelita.www.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.escuelita.www.entity.Matriculas;
import com.escuelita.www.service.IMatriculasService;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@RequestMapping("/restful")
public class MatriculasController {
    @Autowired
    private IMatriculasService serviceMatriculas;

    @GetMapping("/matriculas")
    public List<Matriculas> buscartodos() {
        return serviceMatriculas.buscarTodos(); 
    }
    @PostMapping("/matriculas")
    public Matriculas guardar(@RequestBody Matriculas matricula) {
        serviceMatriculas.guardar(matricula);
        return matricula;
    }
    @PutMapping("/matriculas")
    public Matriculas modificar(@RequestBody Matriculas matricula) {
        serviceMatriculas.modificar(matricula);
        return matricula;
    }
    @GetMapping("/matriculas/{id}")
    public Optional<Matriculas> buscarId(@PathVariable("id") Long id){
        return serviceMatriculas.buscarId(id);
    }
    @DeleteMapping("/matriculas/{id}")
    public String eliminar(@PathVariable Long id){
        serviceMatriculas.eliminar(id);
        return "Matricula eliminada";
    }   
}