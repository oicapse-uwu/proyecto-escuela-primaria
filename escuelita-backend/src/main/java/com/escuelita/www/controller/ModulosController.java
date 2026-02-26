// Revisado
package com.escuelita.www.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.escuelita.www.entity.Modulos;
import com.escuelita.www.service.IModulosService;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/restful")
public class ModulosController {
    @Autowired
    private IModulosService serviceModulos;

    @GetMapping("/modulos")
    public List<Modulos> buscarTodos() {
        return serviceModulos.buscarTodos(); 
    }
    @PostMapping("/modulos")
    public Modulos guardar(@RequestBody Modulos modulos) {
        serviceModulos.guardar(modulos);
        return modulos;
    }
    @PutMapping("/modulos")
    public Modulos modificar(@RequestBody Modulos modulos) {
        serviceModulos.modificar(modulos);
        return modulos;
    }
    @GetMapping("/modulos/{id}")
    public Optional<Modulos> buscarId(@PathVariable("id") Long id){
        return serviceModulos.buscarId(id);
    }
    @DeleteMapping("/modulos/{id}")
    public String eliminar(@PathVariable Long id){
        serviceModulos.eliminar(id);
        return "Módulo eliminado correctamente";
    }
}