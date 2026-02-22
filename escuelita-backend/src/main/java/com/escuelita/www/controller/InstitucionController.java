package com.escuelita.www.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;

import com.escuelita.www.entity.Institucion;
import com.escuelita.www.service.IInstitucionService;

@RestController
@RequestMapping("/restful")
public class InstitucionController {
    
    @Autowired
    private IInstitucionService serviceInstitucion;

    @GetMapping("/instituciones")
    public List<Institucion> buscartodos() {
        return serviceInstitucion.buscarTodos(); 
    }
    
    @PostMapping("/instituciones")
    public Institucion guardar(@RequestBody Institucion institucion) {
        serviceInstitucion.guardar(institucion);
        return institucion;
    }
    
    @PutMapping("/instituciones")
    public Institucion modificar(@RequestBody Institucion institucion) {
        serviceInstitucion.modificar(institucion);
        return institucion;
    }
    
    @GetMapping("/instituciones/{id}")
    public Optional<Institucion> buscarId(@PathVariable("id") Long id){
        return serviceInstitucion.buscarId(id);
    }
    
    @DeleteMapping("/instituciones/{id}")
    public String eliminar(@PathVariable Long id){
        serviceInstitucion.eliminar(id);
        return "Institucion eliminada";
    }   
}