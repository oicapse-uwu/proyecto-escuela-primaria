package com.escuelita.www.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.escuelita.www.entity.DeudasAlumno;
import com.escuelita.www.entity.DeudasAlumnoDTO;
import com.escuelita.www.entity.ConceptosPago;
import com.escuelita.www.entity.Matriculas;
import com.escuelita.www.repository.ConceptosPagoRepository;
import com.escuelita.www.repository.MatriculasRepository;
import com.escuelita.www.service.IDeudasAlumnoService;

@RestController
@RequestMapping("/restful")
public class DeudasAlumnoController {
    
    @Autowired
    private IDeudasAlumnoService serviceDeudas;

    @Autowired
    private MatriculasRepository repoMatriculas;

    @Autowired
    private ConceptosPagoRepository repoConceptos;

    @GetMapping("/deudas-alumno")
    public List<DeudasAlumno> buscarTodos() {
        return serviceDeudas.buscarTodos(); 
    }
    
    @PostMapping("/deudas-alumno")
    public ResponseEntity<?> guardar(@RequestBody DeudasAlumnoDTO dto) {
        DeudasAlumno deuda = new DeudasAlumno();
        deuda.setDescripcionCuota(dto.getDescripcionCuota());
        deuda.setMontoTotal(dto.getMontoTotal());
        deuda.setFechaEmision(dto.getFechaEmision());
        deuda.setFechaVencimiento(dto.getFechaVencimiento());
        deuda.setEstadoDeuda(dto.getEstadoDeuda());
        deuda.setFechaPagoTotal(dto.getFechaPagoTotal());

        Matriculas matriculas = repoMatriculas
            .findById(dto.getIdMatricula())
            .orElse(null);

        ConceptosPago conceptospago = repoConceptos
            .findById(dto.getIdConcepto())
            .orElse(null);

        deuda.setIdMatricula(matriculas);
        deuda.setIdConcepto(conceptospago);

        return ResponseEntity.ok(serviceDeudas.guardar(deuda));

    }
    
    @PutMapping("/deudas-alumno")
    public ResponseEntity<?> modificar(@RequestBody DeudasAlumnoDTO dto) {
        if(dto.getIdDeuda() == null){
            return ResponseEntity.badRequest()
                    .body("ID de deuda es requerido");
        }
        DeudasAlumno deuda = new DeudasAlumno();
        deuda.setIdDeuda(dto.getIdDeuda());
        deuda.setDescripcionCuota(dto.getDescripcionCuota());
        deuda.setMontoTotal(dto.getMontoTotal());
        deuda.setFechaEmision(dto.getFechaEmision());
        deuda.setFechaVencimiento(dto.getFechaVencimiento());
        deuda.setEstadoDeuda(dto.getEstadoDeuda());
        deuda.setFechaPagoTotal(dto.getFechaPagoTotal());

        deuda.setIdMatricula(new Matriculas(dto.getIdMatricula()));
        deuda.setIdConcepto(new ConceptosPago(dto.getIdConcepto()));

        return ResponseEntity.ok(serviceDeudas.modificar(deuda));
    }

    @GetMapping("/deudas-alumno/{id}")
    public Optional<DeudasAlumno> buscarId(@PathVariable("id") Long id){
    return serviceDeudas.buscarId(id);
    
    }
    
    @DeleteMapping("/deudas-alumno/{id}")
    public String eliminar(@PathVariable Long id) {
        serviceDeudas.eliminar(id);
        return "Deuda de alumno eliminada correctamente";
    }   
}