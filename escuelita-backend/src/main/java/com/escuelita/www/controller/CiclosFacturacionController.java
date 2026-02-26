// Revisado
package com.escuelita.www.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.escuelita.www.entity.CiclosFacturacion;
import com.escuelita.www.service.ICiclosFacturacionService;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/restful")
public class CiclosFacturacionController {
    @Autowired
    private ICiclosFacturacionService serviceCiclosFacturacion;

    @GetMapping("/ciclosfacturacion")
    public List<CiclosFacturacion> buscarTodos() {
        return serviceCiclosFacturacion.buscarTodos(); 
    }
    @PostMapping("/ciclosfacturacion")
    public CiclosFacturacion guardar(@RequestBody CiclosFacturacion ciclosFacturacion) {
        serviceCiclosFacturacion.guardar(ciclosFacturacion);
        return ciclosFacturacion;
    }
    @PutMapping("/ciclosfacturacion")
    public CiclosFacturacion modificar(@RequestBody CiclosFacturacion ciclosFacturacion) {
        serviceCiclosFacturacion.modificar(ciclosFacturacion);
        return ciclosFacturacion;
    }
    @GetMapping("/ciclosfacturacion/{id}")
    public Optional<CiclosFacturacion> buscarId(@PathVariable("id") Long id){
        return serviceCiclosFacturacion.buscarId(id);
    }
    @DeleteMapping("/ciclosfacturacion/{id}")
    public String eliminar(@PathVariable Long id){
        serviceCiclosFacturacion.eliminar(id);
        return "Ciclo de facturación eliminado correctamente";
    }
}