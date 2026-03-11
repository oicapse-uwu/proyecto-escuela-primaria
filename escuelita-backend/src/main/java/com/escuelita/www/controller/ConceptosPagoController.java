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
import com.escuelita.www.entity.ConceptosPagoDTO;
import com.escuelita.www.entity.Grados;
import com.escuelita.www.entity.Institucion;
import com.escuelita.www.entity.Sedes;
import com.escuelita.www.repository.GradosRepository;
import com.escuelita.www.repository.InstitucionRepository;
import com.escuelita.www.repository.SedesRepository;
import com.escuelita.www.security.RequireModulo;
import com.escuelita.www.service.IConceptosPagoService;
import com.escuelita.www.util.TenantContext;

@RestController
@RequestMapping("/restful")
public class ConceptosPagoController {

    @Autowired
    private IConceptosPagoService serviceConceptos;
    @Autowired
    private InstitucionRepository repoInstitucion;
    @Autowired
    private GradosRepository repoGrados;
    @Autowired
    private SedesRepository repoSedes;

    @GetMapping("/conceptospago")
    @RequireModulo(8)  // 8 = Módulo PAGOS Y PENSIONES
    public List<ConceptosPago> buscarTodos() {
        return serviceConceptos.buscarTodos(); 
    }
    @PostMapping("/conceptospago")
    @RequireModulo(8)  // 8 = Módulo PAGOS Y PENSIONES
    public ResponseEntity<?> guardar(@RequestBody ConceptosPagoDTO dto) {
        
        ConceptosPago conceptosPago = new ConceptosPago();
        conceptosPago.setNombreConcepto(dto.getNombreConcepto());
        conceptosPago.setMonto(dto.getMonto());
        conceptosPago.setEstadoConcepto(dto.getEstadoConcepto());

        // Auto-asignar institución desde el contexto del usuario (si no es SuperAdmin)
        Institucion institucion = null;
        Long sedeId = TenantContext.getSedeId();
        if (sedeId != null && !TenantContext.isSuperAdmin()) {
            Sedes sede = repoSedes.findById(sedeId).orElse(null);
            if (sede != null) institucion = sede.getIdInstitucion();
        } else if (dto.getIdInstitucion() != null && dto.getIdInstitucion() > 0) {
            institucion = repoInstitucion.findById(dto.getIdInstitucion()).orElse(null);
        }

        // Grado es opcional (0 = sin grado específico, aplica a todos)
        Grados grados = null;
        if (dto.getIdGrado() != null && dto.getIdGrado() > 0) {
            grados = repoGrados.findById(dto.getIdGrado()).orElse(null);
        }
        
        conceptosPago.setIdInstitucion(institucion);
        conceptosPago.setIdGrado(grados);

        return ResponseEntity.ok(serviceConceptos.guardar(conceptosPago));
    }
    @PutMapping("/conceptospago")
    @RequireModulo(8)  // 8 = Módulo PAGOS Y PENSIONES
    public ResponseEntity<?> modificar(@RequestBody ConceptosPagoDTO dto) {
        if(dto.getIdConcepto() == null){
            return ResponseEntity.badRequest()
                    .body("ID de concepto de pago es requerido");
        }
        ConceptosPago conceptosPago = new ConceptosPago();
        conceptosPago.setIdConcepto(dto.getIdConcepto());
        conceptosPago.setNombreConcepto(dto.getNombreConcepto());
        conceptosPago.setMonto(dto.getMonto());
        conceptosPago.setEstadoConcepto(dto.getEstadoConcepto());

        // Auto-asignar institución desde el contexto del usuario (si no es SuperAdmin)
        Institucion institucion = null;
        Long sedeIdCtx = TenantContext.getSedeId();
        if (sedeIdCtx != null && !TenantContext.isSuperAdmin()) {
            Sedes sede = repoSedes.findById(sedeIdCtx).orElse(null);
            if (sede != null) institucion = sede.getIdInstitucion();
        } else if (dto.getIdInstitucion() != null && dto.getIdInstitucion() > 0) {
            institucion = repoInstitucion.findById(dto.getIdInstitucion()).orElse(null);
        }

        // Grado es opcional
        Grados grados = null;
        if (dto.getIdGrado() != null && dto.getIdGrado() > 0) {
            grados = repoGrados.findById(dto.getIdGrado()).orElse(null);
        }
        
        conceptosPago.setIdInstitucion(institucion);
        conceptosPago.setIdGrado(grados);

        return ResponseEntity.ok(serviceConceptos.modificar(conceptosPago));
    }
    @GetMapping("/conceptospago/{id}")
    @RequireModulo(8)  // 8 = Módulo PAGOS Y PENSIONES
    public Optional<ConceptosPago> buscarId(@PathVariable("id") Long id){
    return serviceConceptos.buscarId(id);
    }
    @DeleteMapping("/conceptospago/{id}")
    @RequireModulo(8)  // 8 = Módulo PAGOS Y PENSIONES
    public String eliminar(@PathVariable Long id){
        serviceConceptos.eliminar(id);
        return "Concepto de pago eliminado";
    }  
}