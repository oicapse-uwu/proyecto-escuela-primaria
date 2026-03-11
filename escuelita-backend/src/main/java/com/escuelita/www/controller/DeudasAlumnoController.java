// Sin tocar
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

import com.escuelita.www.entity.ConceptosPago;
import com.escuelita.www.entity.DeudasAlumno;
import com.escuelita.www.entity.DeudasAlumnoDTO;
import com.escuelita.www.entity.Matriculas;
import com.escuelita.www.repository.ConceptosPagoRepository;
import com.escuelita.www.repository.MatriculasRepository;
import com.escuelita.www.security.RequireModulo;
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

    @GetMapping("/deudasalumno")
    @RequireModulo(8)  // 8 = Módulo PAGOS Y PENSIONES
    public List<DeudasAlumno> buscarTodos() {
        return serviceDeudas.buscarTodos(); 
    }
    @PostMapping("/deudasalumno")
    @RequireModulo(8)  // 8 = Módulo PAGOS Y PENSIONES
    public ResponseEntity<?> guardar(@RequestBody DeudasAlumnoDTO dto) {
        DeudasAlumno deudasAlumno = new DeudasAlumno();
        deudasAlumno.setDescripcionCuota(dto.getDescripcionCuota());
        deudasAlumno.setMontoTotal(dto.getMontoTotal());
        deudasAlumno.setFechaEmision(dto.getFechaEmision());
        deudasAlumno.setFechaVencimiento(dto.getFechaVencimiento());
        deudasAlumno.setEstadoDeuda(dto.getEstadoDeuda());
        deudasAlumno.setFechaPagoTotal(dto.getFechaPagoTotal());

        Matriculas matriculas = repoMatriculas
            .findById(dto.getIdMatricula())
            .orElse(null);
        ConceptosPago conceptosPago = repoConceptos
            .findById(dto.getIdConcepto())
            .orElse(null);

        deudasAlumno.setIdMatricula(matriculas);
        deudasAlumno.setIdConcepto(conceptosPago);

        return ResponseEntity.ok(serviceDeudas.guardar(deudasAlumno));
    }
    
    @PutMapping("/deudasalumno")
    @RequireModulo(8)  // 8 = Módulo PAGOS Y PENSIONES
    public ResponseEntity<?> modificar(@RequestBody DeudasAlumnoDTO dto) {
        if(dto.getIdDeuda() == null){
            return ResponseEntity.badRequest()
                    .body("ID de deuda es requerido");
        }
        DeudasAlumno deudasAlumno = new DeudasAlumno();
        deudasAlumno.setIdDeuda(dto.getIdDeuda());
        deudasAlumno.setDescripcionCuota(dto.getDescripcionCuota());
        deudasAlumno.setMontoTotal(dto.getMontoTotal());
        deudasAlumno.setFechaEmision(dto.getFechaEmision());
        deudasAlumno.setFechaVencimiento(dto.getFechaVencimiento());
        deudasAlumno.setEstadoDeuda(dto.getEstadoDeuda());
        deudasAlumno.setFechaPagoTotal(dto.getFechaPagoTotal());

        Matriculas matriculas = repoMatriculas
            .findById(dto.getIdMatricula())
            .orElse(null);
        ConceptosPago conceptosPago = repoConceptos
            .findById(dto.getIdConcepto())
            .orElse(null);

        deudasAlumno.setIdMatricula(matriculas);
        deudasAlumno.setIdConcepto(conceptosPago);

        return ResponseEntity.ok(serviceDeudas.modificar(deudasAlumno));
    }
    @GetMapping("/deudasalumno/{id}")
    @RequireModulo(8)  // 8 = Módulo PAGOS Y PENSIONES
    public Optional<DeudasAlumno> buscarId(@PathVariable("id") Long id){
    return serviceDeudas.buscarId(id);
    }
    @GetMapping("/deudasalumno/matricula/{idMatricula}")
    @RequireModulo(8)  // 8 = Módulo PAGOS Y PENSIONES
    public List<DeudasAlumno> buscarPorMatricula(@PathVariable Long idMatricula) {
        return serviceDeudas.buscarPorMatricula(idMatricula);
    }
    @DeleteMapping("/deudasalumno/{id}")
    @RequireModulo(8)  // 8 = Módulo PAGOS Y PENSIONES
    public String eliminar(@PathVariable Long id) {
        serviceDeudas.eliminar(id);
        return "Deuda de alumno eliminada correctamente";
    }   
}