package com.escuelita.www.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.escuelita.www.entity.SeccionesDTO;
import com.escuelita.www.service.ISeccionesService;

@RestController
@RequestMapping("/restful")
public class SeccionesController {
    
    @Autowired 
    private ISeccionesService serviceSecciones;

    @GetMapping("/secciones")
    public List<SeccionesDTO> buscartodos() {
        return serviceSecciones.buscarTodos(); 
    }
    
    @PostMapping("/secciones")
    public SeccionesDTO guardar(@RequestBody SeccionesDTO seccionDTO) {
        return serviceSecciones.guardar(seccionDTO);
    }
    
    @PutMapping("/secciones")
    public SeccionesDTO modificar(@RequestBody SeccionesDTO seccionDTO) {
        return serviceSecciones.modificar(seccionDTO);
    }
    
    @GetMapping("/secciones/{id}")
    public SeccionesDTO buscarId(@PathVariable("id") Long id) {
        return serviceSecciones.buscarId(id);
    }
    
    @DeleteMapping("/secciones/{id}")
    public String eliminar(@PathVariable Long id) {
        serviceSecciones.eliminar(id);
        return "Seccion eliminada";
    }   
}