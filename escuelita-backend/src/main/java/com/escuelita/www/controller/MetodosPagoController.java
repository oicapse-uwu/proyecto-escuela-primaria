package com.escuelita.www.controller;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.escuelita.www.entity.MetodosPago;
import com.escuelita.www.service.IMetodosPagoService;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@RequestMapping("/restful")
public class MetodosPagoController {
    
    @Autowired
    private IMetodosPagoService serviceMetodos;

    @GetMapping("/metodos-pago")
    public List<MetodosPago> buscartodos() {
        return serviceMetodos.buscarTodos(); 
    }
    
    @PostMapping("/metodos-pago")
    public MetodosPago guardar(@RequestBody MetodosPago metodoPago) {
        serviceMetodos.guardar(metodoPago);
        return metodoPago;
    }
    
    @PutMapping("/metodos-pago")
    public MetodosPago modificar(@RequestBody MetodosPago metodoPago) {
        serviceMetodos.modificar(metodoPago);
        return metodoPago;
    }
    
    @GetMapping("/metodos-pago/{id}")
    public Optional<MetodosPago> buscarId(@PathVariable("id") Long id) {
        return serviceMetodos.buscarId(id);
    }
    
    @DeleteMapping("/metodos-pago/{id}")
    public String eliminar(@PathVariable Long id) {
        serviceMetodos.eliminar(id);
        return "Método de pago eliminado";
    }   
}