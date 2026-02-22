package com.escuelita.www.controller;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.escuelita.www.entity.ConceptosPago;
import com.escuelita.www.service.IConceptosPagoService;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@RequestMapping("/restful")
public class ConceptosPagoController {
    
    @Autowired
    private IConceptosPagoService serviceConceptos;

    @GetMapping("/conceptos-pago")
    public List<ConceptosPago> buscartodos() {
        return serviceConceptos.buscarTodos(); 
    }
    
    @PostMapping("/conceptos-pago")
    public ConceptosPago guardar(@RequestBody ConceptosPago conceptoPago) {
        serviceConceptos.guardar(conceptoPago);
        return conceptoPago;
    }
    
    @PutMapping("/conceptos-pago")
    public ConceptosPago modificar(@RequestBody ConceptosPago conceptoPago) {
        serviceConceptos.modificar(conceptoPago);
        return conceptoPago;
    }
    
    @GetMapping("/conceptos-pago/{id}")
    public Optional<ConceptosPago> buscarId(@PathVariable("id") Long id) {
        return serviceConceptos.buscarId(id);
    }
    
    @DeleteMapping("/conceptos-pago/{id}")
    public String eliminar(@PathVariable Long id) {
        serviceConceptos.eliminar(id);
        return "Concepto de pago eliminado";
    }   
}