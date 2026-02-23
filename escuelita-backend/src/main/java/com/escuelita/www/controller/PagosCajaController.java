package com.escuelita.www.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.escuelita.www.entity.PagosCajaDTO;
import com.escuelita.www.service.IPagosCajaService;

@RestController
@RequestMapping("/restful/pagos-caja")
public class PagosCajaController {
    
    @Autowired
    private IPagosCajaService servicePagosCaja;

    @GetMapping
    public List<PagosCajaDTO> buscartodos() {
        return servicePagosCaja.buscarTodos(); 
    }
    
    @PostMapping
    public PagosCajaDTO guardar(@RequestBody PagosCajaDTO dto) {
        return servicePagosCaja.guardar(dto);
    }
    
    @PutMapping
    public PagosCajaDTO modificar(@RequestBody PagosCajaDTO dto) {
        return servicePagosCaja.modificar(dto);
    }
    
    @GetMapping("/{id}")
    public PagosCajaDTO buscarId(@PathVariable("id") Long id) {
        return servicePagosCaja.buscarId(id);
    }
    
    @DeleteMapping("/{id}")
    public String eliminar(@PathVariable Long id) {
        servicePagosCaja.eliminar(id);
        return "Pago eliminado correctamente";
    }   
}