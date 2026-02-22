package com.escuelita.www.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.escuelita.www.entity.ConceptosPagoDTO;
import com.escuelita.www.service.IConceptosPagoService;

@RestController
@RequestMapping("/restful/conceptos-pago")
public class ConceptosPagoController {
    
    @Autowired
    private IConceptosPagoService serviceConceptos;

    @GetMapping
    public List<ConceptosPagoDTO> buscartodos() {
        return serviceConceptos.buscarTodos(); 
    }
    
    @PostMapping
    public ConceptosPagoDTO guardar(@RequestBody ConceptosPagoDTO dto) {
        return serviceConceptos.guardar(dto);
    }
    
    @PutMapping
    public ConceptosPagoDTO modificar(@RequestBody ConceptosPagoDTO dto) {
        return serviceConceptos.modificar(dto);
    }
    
    @GetMapping("/{id}")
    public ConceptosPagoDTO buscarId(@PathVariable("id") Long id) {
        return serviceConceptos.buscarId(id);
    }
    
    @DeleteMapping("/{id}")
    public String eliminar(@PathVariable Long id) {
        serviceConceptos.eliminar(id);
        return "Concepto de pago eliminado correctamente";
    }   
}