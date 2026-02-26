// Revisado
package com.escuelita.www.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import java.util.Optional;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


import com.escuelita.www.entity.ConceptosPago;
import com.escuelita.www.entity.ConceptosPagoDTO;
import com.escuelita.www.entity.Institucion;
import com.escuelita.www.entity.Grados;

import com.escuelita.www.repository.GradosRepository;
import com.escuelita.www.repository.InstitucionRepository;

import com.escuelita.www.service.IConceptosPagoService;

@RestController
@RequestMapping("/restful")
public class ConceptosPagoController {
    
    @Autowired
    private IConceptosPagoService serviceConceptos;

    @Autowired
    private InstitucionRepository repoInstitucion;
    
    @Autowired
    private GradosRepository repoGrados;

    @GetMapping("/conceptospago")
    public List<ConceptosPago> buscarTodos() {
        return serviceConceptos.buscarTodos(); 
    }
    
    @PostMapping("/conceptospago")
    public ResponseEntity<?> guardar(@RequestBody ConceptosPagoDTO dto) {
        
        ConceptosPago conceptospago = new ConceptosPago();
        conceptospago.setNombreConcepto(dto.getNombreConcepto());
        conceptospago.setMonto(dto.getMonto());
        conceptospago.setEstadoConcepto(dto.getEstadoConcepto());
       
        Institucion institucion = repoInstitucion
            .findById(dto.getIdInstitucion())
            .orElse(null);
        Grados grados= repoGrados
            .findById(dto.getIdGrado())
            .orElse(null);
        
        conceptospago.setIdInstitucion(institucion);
        conceptospago.setIdGrado(grados);

        return ResponseEntity.ok(serviceConceptos.guardar(conceptospago));
    }
    
    @PutMapping("/conceptospago")
   public ResponseEntity<?> modificar(@RequestBody ConceptosPagoDTO dto) {
        if(dto.getIdConcepto() == null){
            return ResponseEntity.badRequest()
                    .body("ID de concepto de pago es requerido");
        }
        ConceptosPago conceptospago = new ConceptosPago();
        conceptospago.setIdConcepto(dto.getIdConcepto());
        conceptospago.setNombreConcepto(dto.getNombreConcepto());
        conceptospago.setMonto(dto.getMonto());
        conceptospago.setEstadoConcepto(dto.getEstadoConcepto());

        conceptospago.setIdInstitucion(new Institucion(dto.getIdInstitucion()));
        conceptospago.setIdGrado(new Grados(dto.getIdGrado()));

        return ResponseEntity.ok(serviceConceptos.modificar(conceptospago));
    }
    
    @GetMapping("/conceptospago/{id}")
    public Optional<ConceptosPago> buscarId(@PathVariable("id") Long id){
    return serviceConceptos.buscarId(id);

    }
    
    @DeleteMapping("/conceptospago/{id}")
    public String eliminar(@PathVariable Long id){
        serviceConceptos.eliminar(id);
        return "Concepto de pago eliminado";
    }  
}