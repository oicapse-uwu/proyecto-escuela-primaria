package com.escuelita.www.controller;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.escuelita.www.entity.PagoDetalle;
import com.escuelita.www.service.IPagoDetalleService;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@RequestMapping("/restful")
public class PagoDetalleController {
    
    @Autowired
    private IPagoDetalleService servicePagoDetalle;

    @GetMapping("/pago-detalle")
    public List<PagoDetalle> buscartodos() {
        return servicePagoDetalle.buscarTodos(); 
    }
    
    @PostMapping("/pago-detalle")
    public PagoDetalle guardar(@RequestBody PagoDetalle pagoDetalle) {
        servicePagoDetalle.guardar(pagoDetalle);
        return pagoDetalle;
    }
    
    @PutMapping("/pago-detalle")
    public PagoDetalle modificar(@RequestBody PagoDetalle pagoDetalle) {
        servicePagoDetalle.modificar(pagoDetalle);
        return pagoDetalle;
    }
    
    @GetMapping("/pago-detalle/{id}")
    public Optional<PagoDetalle> buscarId(@PathVariable("id") Long id) {
        return servicePagoDetalle.buscarId(id);
    }
    
    @DeleteMapping("/pago-detalle/{id}")
    public String eliminar(@PathVariable Long id) {
        servicePagoDetalle.eliminar(id);
        return "Detalle de pago eliminado";
    }   
}