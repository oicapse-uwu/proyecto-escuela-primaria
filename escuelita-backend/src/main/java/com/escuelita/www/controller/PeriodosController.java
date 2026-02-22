package com.escuelita.www.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.escuelita.www.entity.PeriodosDTO;
import com.escuelita.www.service.IPeriodosService;

@RestController
@RequestMapping("/restful")
public class PeriodosController {
    
    @Autowired 
    private IPeriodosService servicePeriodos;

    @GetMapping("/periodos")
    public List<PeriodosDTO> buscartodos() {
        return servicePeriodos.buscarTodos(); 
    }
    
    @PostMapping("/periodos")
    public PeriodosDTO guardar(@RequestBody PeriodosDTO periodoDTO) {
        return servicePeriodos.guardar(periodoDTO);
    }
    
    @PutMapping("/periodos")
    public PeriodosDTO modificar(@RequestBody PeriodosDTO periodoDTO) {
        return servicePeriodos.modificar(periodoDTO);
    }
    
    @GetMapping("/periodos/{id}")
    public PeriodosDTO buscarId(@PathVariable("id") Long id) {
        return servicePeriodos.buscarId(id);
    }
    
    @DeleteMapping("/periodos/{id}")
    public String eliminar(@PathVariable Long id) {
        servicePeriodos.eliminar(id);
        return "Periodo eliminado";
    }   
}