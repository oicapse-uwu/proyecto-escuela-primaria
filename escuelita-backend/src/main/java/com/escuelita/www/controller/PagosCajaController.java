package com.escuelita.www.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.escuelita.www.entity.PagosCajaDTO;
import com.escuelita.www.service.IPagosCajaService;

@RestController
@RequestMapping("/restful")
public class PagosCajaController {
    
    @Autowired
    private IPagosCajaService servicePagosCaja;

    @GetMapping("/pagos-caja")
    public List<PagosCajaDTO> buscarTodos() {
        return servicePagosCaja.buscarTodos(); 
    }
    
    @PostMapping("/pagos-caja")
    public PagosCajaDTO guardar(@RequestBody PagosCajaDTO dto) {
        return servicePagosCaja.guardar(dto);
    }
    
    @PutMapping("/pagos-caja")
    public PagosCajaDTO modificar(@RequestBody PagosCajaDTO dto) {
        return servicePagosCaja.modificar(dto);
    }
    
    @GetMapping("/pagos-caja/{id}")
    public PagosCajaDTO buscarId(@PathVariable("id") Long id) {
        return servicePagosCaja.buscarId(id);
    }
    
    @DeleteMapping("/pagos-caja/{id}")
    public String eliminar(@PathVariable Long id) {
        servicePagosCaja.eliminar(id);
        return "Pago eliminado correctamente";
    }   
}