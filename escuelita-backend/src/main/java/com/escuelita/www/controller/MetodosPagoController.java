package com.escuelita.www.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.escuelita.www.entity.MetodosPagoDTO;
import com.escuelita.www.service.IMetodosPagoService;

@RestController
@RequestMapping("/restful")
public class MetodosPagoController {
    
    @Autowired
    private IMetodosPagoService serviceMetodos;

    @GetMapping("/metodos-pago")
    public List<MetodosPagoDTO> buscarTodos() {
        return serviceMetodos.buscarTodos(); 
    }
    
    @PostMapping("/metodos-pago")
    public MetodosPagoDTO guardar(@RequestBody MetodosPagoDTO dto) {
        return serviceMetodos.guardar(dto);
    }
    
    @PutMapping("/metodos-pago")
    public MetodosPagoDTO modificar(@RequestBody MetodosPagoDTO dto) {
        return serviceMetodos.modificar(dto);
    }
    
    @GetMapping("/metodos-pago/{id}")
    public MetodosPagoDTO buscarId(@PathVariable("id") Long id) {
        return serviceMetodos.buscarId(id);
    }
    
    @DeleteMapping("/metodos-pago/{id}")
    public String eliminar(@PathVariable Long id) {
        serviceMetodos.eliminar(id);
        return "Método de pago eliminado correctamente";
    }   
}