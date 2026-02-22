package com.escuelita.www.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.escuelita.www.entity.AnioEscolarDTO;
import com.escuelita.www.service.IAnioEscolarService;

@RestController
@RequestMapping("/restful")
public class AnioEscolarController {
    
    @Autowired private IAnioEscolarService serviceAnioEscolar;

    @GetMapping("/anio-escolar")
    public List<AnioEscolarDTO> buscartodos() { return serviceAnioEscolar.buscarTodos(); }
    
    @PostMapping("/anio-escolar")
    public AnioEscolarDTO guardar(@RequestBody AnioEscolarDTO anioEscolarDTO) { return serviceAnioEscolar.guardar(anioEscolarDTO); }
    
    @PutMapping("/anio-escolar")
    public AnioEscolarDTO modificar(@RequestBody AnioEscolarDTO anioEscolarDTO) { return serviceAnioEscolar.modificar(anioEscolarDTO); }
    
    @GetMapping("/anio-escolar/{id}")
    public AnioEscolarDTO buscarId(@PathVariable("id") Long id){ return serviceAnioEscolar.buscarId(id); }
    
    @DeleteMapping("/anio-escolar/{id}")
    public String eliminar(@PathVariable Long id){
        serviceAnioEscolar.eliminar(id);
        return "Año escolar eliminado";
    }   
}