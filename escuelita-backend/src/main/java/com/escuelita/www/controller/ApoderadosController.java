package com.escuelita.www.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.escuelita.www.entity.Apoderados;
import com.escuelita.www.service.IApoderadosService;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;



@RestController
@RequestMapping("/restful")
public class ApoderadosController {
    @Autowired
    private IApoderadosService serviceApoderados;

    @GetMapping("/apoderados")
    public List<Apoderados> buscartodos() {
        return serviceApoderados.buscarTodos(); 
    }
    @PostMapping("/apoderados")
    public Apoderados guardar(@RequestBody Apoderados apoderado) {
        serviceApoderados.guardar(apoderado);
        return apoderado;
    }
    @PutMapping("/apoderados")
    public Apoderados modificar(@RequestBody Apoderados apoderado) {
        serviceApoderados.modificar(apoderado);
        return apoderado;
    }
    @GetMapping("/apoderados/{id}")
    public Optional<Apoderados> buscarId(@PathVariable("id") Long id){
        return serviceApoderados.buscarId(id);
    }
    @DeleteMapping("/apoderados/{id}")
    public String eliminar(@PathVariable Long id){
        serviceApoderados.eliminar(id);
        return "Apoderado eliminado";
    }   
}