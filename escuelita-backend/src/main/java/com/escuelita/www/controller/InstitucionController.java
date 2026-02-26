// Revisado
package com.escuelita.www.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.escuelita.www.entity.Institucion;
import com.escuelita.www.service.IInstitucionService;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/restful")
public class InstitucionController {
    @Autowired
    private IInstitucionService serviceInstitucion;

    @GetMapping("/institucion")
    public List<Institucion> buscarTodos() {
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
        return "Institución eliminada correctamente";
    }   
}