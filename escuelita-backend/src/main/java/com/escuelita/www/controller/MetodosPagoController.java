package com.escuelita.www.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.escuelita.www.entity.MetodosPagoDTO;
import com.escuelita.www.service.IMetodosPagoService;

@RestController
@RequestMapping("/restful/metodos-pago")
public class MetodosPagoController {
    
    @Autowired
    private IMetodosPagoService serviceMetodos;

    @GetMapping
    public List<MetodosPagoDTO> buscartodos() {
        return serviceMetodos.buscarTodos(); 
    }
    
    @PostMapping
    public MetodosPagoDTO guardar(@RequestBody MetodosPagoDTO dto) {
        return serviceMetodos.guardar(dto);
    }
    
    @PutMapping
    public MetodosPagoDTO modificar(@RequestBody MetodosPagoDTO dto) {
        return serviceMetodos.modificar(dto);
    }
    
    @GetMapping("/{id}")
    public MetodosPagoDTO buscarId(@PathVariable("id") Long id) {
        return serviceMetodos.buscarId(id);
    }
    
    @DeleteMapping("/{id}")
    public String eliminar(@PathVariable Long id) {
        serviceMetodos.eliminar(id);
        return "Método de pago eliminado correctamente";
    }   
}