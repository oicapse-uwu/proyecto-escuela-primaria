package com.escuelita.www.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.escuelita.www.entity.GradosDTO;
import com.escuelita.www.service.IGradosService;

@RestController
@RequestMapping("/restful")
public class GradosController {
    
    @Autowired 
    private IGradosService serviceGrados;

    @GetMapping("/grados")
    public List<GradosDTO> buscartodos() { 
        return serviceGrados.buscarTodos(); 
    }
    
    @PostMapping("/grados")
    public GradosDTO guardar(@RequestBody GradosDTO gradoDTO) { 
        return serviceGrados.guardar(gradoDTO); 
    }
    
    @PutMapping("/grados")
    public GradosDTO modificar(@RequestBody GradosDTO gradoDTO) { 
        return serviceGrados.modificar(gradoDTO); 
    }
    
    @GetMapping("/grados/{id}")
    public GradosDTO buscarId(@PathVariable("id") Long id) { 
        return serviceGrados.buscarId(id); 
    }
    
    @DeleteMapping("/grados/{id}")
    public String eliminar(@PathVariable Long id) {
        serviceGrados.eliminar(id);
        return "Grado eliminado";
    }   
}