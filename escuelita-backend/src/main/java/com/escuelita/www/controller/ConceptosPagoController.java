// Revisado
package com.escuelita.www.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.escuelita.www.entity.ConceptosPagoDTO;
import com.escuelita.www.service.IConceptosPagoService;

@RestController
@RequestMapping("/restful")
public class ConceptosPagoController {
    
    @Autowired
    private IConceptosPagoService serviceConceptos;

    @GetMapping("/conceptos-pago")
    public List<ConceptosPagoDTO> buscarTodos() {
        return serviceConceptos.buscarTodos(); 
    }
    @PostMapping("/conceptos-pago")
    public ConceptosPagoDTO guardar(@RequestBody ConceptosPagoDTO dto) {
        return serviceConceptos.guardar(dto);
    }
    @PutMapping("/conceptos-pago")
    public ConceptosPagoDTO modificar(@RequestBody ConceptosPagoDTO dto) {
        return serviceConceptos.modificar(dto);
    }
    @GetMapping("/conceptos-pago/{id}")
    public ConceptosPagoDTO buscarId(@PathVariable("id") Long id) {
        return serviceConceptos.buscarId(id);
    }
    @DeleteMapping("/conceptos-pago/{id}")
    public String eliminar(@PathVariable Long id) {
        serviceConceptos.eliminar(id);
        return "Concepto de pago eliminado correctamente";
    }   
}