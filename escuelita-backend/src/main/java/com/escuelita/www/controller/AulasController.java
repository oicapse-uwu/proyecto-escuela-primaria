package com.escuelita.www.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.escuelita.www.entity.AulasDTO;
import com.escuelita.www.service.IAulasService;

@RestController
@RequestMapping("/restful")
public class AulasController {
    
    @Autowired 
    private IAulasService serviceAulas;

    @GetMapping("/aulas")
    public List<AulasDTO> buscartodos() {
        return serviceAulas.buscarTodos(); 
    }
    
    @PostMapping("/aulas")
    public AulasDTO guardar(@RequestBody AulasDTO aulaDTO) {
        return serviceAulas.guardar(aulaDTO);
    }
    
    @PutMapping("/aulas")
    public AulasDTO modificar(@RequestBody AulasDTO aulaDTO) {
        return serviceAulas.modificar(aulaDTO);
    }
    
    @GetMapping("/aulas/{id}")
    public AulasDTO buscarId(@PathVariable("id") Long id) {
        return serviceAulas.buscarId(id);
    }
    
    @DeleteMapping("/aulas/{id}")
    public String eliminar(@PathVariable Long id) {
        serviceAulas.eliminar(id);
        return "Aula eliminada";
    }   
}