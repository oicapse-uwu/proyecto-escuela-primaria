package com.escuelita.www.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.escuelita.www.entity.Institucion;
import com.escuelita.www.service.IInstitucionService;

@RestController
@RequestMapping("/restful")
public class InstitucionController {
    
    @Autowired
    private IInstitucionService serviceInstitucion;

    @GetMapping("/institucion")
    public List<Institucion> buscartodos() {
        return serviceInstitucion.buscarTodos(); 
    }
    
    @PostMapping("/institucion")
    public Institucion guardar(@RequestBody Institucion institucion) {
        serviceInstitucion.guardar(institucion);
        return institucion;
    }
    
    @PutMapping("/institucion")
    public Institucion modificar(@RequestBody Institucion institucion) {
        serviceInstitucion.modificar(institucion);
        return institucion;
    }
    
    @GetMapping("/institucion/{id}")
    public Optional<Institucion> buscarId(@PathVariable("id") Long id){
        return serviceInstitucion.buscarId(id);
    }
    
    @DeleteMapping("/institucion/{id}")
    public String eliminar(@PathVariable Long id){
        serviceInstitucion.eliminar(id);
        return "Institucion eliminada";
    }   
}