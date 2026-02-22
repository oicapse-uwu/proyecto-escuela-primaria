package com.escuelita.www.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.escuelita.www.entity.SedesDTO;
import com.escuelita.www.service.ISedesService;

@RestController
@RequestMapping("/restful")
public class SedesController {
    
    @Autowired private ISedesService serviceSedes;

    @GetMapping("/sedes")
    public List<SedesDTO> buscartodos() { return serviceSedes.buscarTodos(); }
    
    @PostMapping("/sedes")
    public SedesDTO guardar(@RequestBody SedesDTO sedeDTO) { return serviceSedes.guardar(sedeDTO); }
    
    @PutMapping("/sedes")
    public SedesDTO modificar(@RequestBody SedesDTO sedeDTO) { return serviceSedes.modificar(sedeDTO); }
    
    @GetMapping("/sedes/{id}")
    public SedesDTO buscarId(@PathVariable("id") Long id){ return serviceSedes.buscarId(id); }
    
    @DeleteMapping("/sedes/{id}")
    public String eliminar(@PathVariable Long id){
        serviceSedes.eliminar(id);
        return "Sede eliminada";
    }   
}