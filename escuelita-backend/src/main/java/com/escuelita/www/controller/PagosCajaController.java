package com.escuelita.www.controller;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.escuelita.www.entity.PagosCaja;
import com.escuelita.www.service.IPagosCajaService;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@RequestMapping("/restful")
public class PagosCajaController {
    
    @Autowired
    private IPagosCajaService servicePagosCaja;

    @GetMapping("/pagos-caja")
    public List<PagosCaja> buscartodos() {
        return servicePagosCaja.buscarTodos(); 
    }
    
    @PostMapping("/pagos-caja")
    public PagosCaja guardar(@RequestBody PagosCaja pagoCaja) {
        servicePagosCaja.guardar(pagoCaja);
        return pagoCaja;
    }
    
    @PutMapping("/pagos-caja")
    public PagosCaja modificar(@RequestBody PagosCaja pagoCaja) {
        servicePagosCaja.modificar(pagoCaja);
        return pagoCaja;
    }
    
    @GetMapping("/pagos-caja/{id}")
    public Optional<PagosCaja> buscarId(@PathVariable("id") Long id) {
        return servicePagosCaja.buscarId(id);
    }
    
    @DeleteMapping("/pagos-caja/{id}")
    public String eliminar(@PathVariable Long id) {
        servicePagosCaja.eliminar(id);
        return "Pago de caja eliminado";
    }   
}