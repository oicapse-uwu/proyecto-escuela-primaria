package com.escuelita.www.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.escuelita.www.entity.PagoDetalleDTO;
import com.escuelita.www.service.IPagoDetalleService;

@RestController
@RequestMapping("/restful")
public class PagoDetalleController {
    
    @Autowired
    private IPagoDetalleService servicePagoDetalle;

    @GetMapping("/pago-detalle")
    public List<PagoDetalleDTO> buscartodos() {
        return servicePagoDetalle.buscarTodos(); 
    }
    
    @PostMapping("/pago-detalle")
    public PagoDetalleDTO guardar(@RequestBody PagoDetalleDTO dto) {
        return servicePagoDetalle.guardar(dto);
    }
    
    @PutMapping("/pago-detalle")
    public PagoDetalleDTO modificar(@RequestBody PagoDetalleDTO dto) {
        return servicePagoDetalle.modificar(dto);
    }
    
    @GetMapping("/pago-detalle/{id}")
    public PagoDetalleDTO buscarId(@PathVariable("id") Long id) {
        return servicePagoDetalle.buscarId(id);
    }
    
    @DeleteMapping("/pago-detalle/{id}")
    public String eliminar(@PathVariable Long id) {
        servicePagoDetalle.eliminar(id);
        return "Detalle de pago eliminado correctamente";
    }   
}