/*
    MODIFICADO - Validación al crear suscripción, 
    mensaje de error si no se encuentra la institución o el plan.
*/
package com.escuelita.www.controller;

import java.util.List;
import java.util.Map;
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

import com.escuelita.www.entity.CiclosFacturacion;
import com.escuelita.www.entity.EstadosSuscripcion;
import com.escuelita.www.entity.Institucion;
import com.escuelita.www.entity.Planes;
import com.escuelita.www.entity.Suscripciones;
import com.escuelita.www.entity.SuscripcionesDTO;
import com.escuelita.www.repository.CiclosFacturacionRepository;
import com.escuelita.www.repository.EstadosSuscripcionRepository;
import com.escuelita.www.repository.InstitucionRepository;
import com.escuelita.www.repository.PlanesRepository;
import com.escuelita.www.service.IPagoSuscripcionService;
import com.escuelita.www.service.ISuscripcionesService;

@RestController
@RequestMapping("/restful")
public class SuscripcionesController {

    @Autowired 
    private ISuscripcionesService serviceSuscripciones;
    @Autowired 
    private IPagoSuscripcionService servicePagos;
    @Autowired 
    private InstitucionRepository repoInstitucion;
    @Autowired 
    private PlanesRepository repoPlanes;
    @Autowired 
    private CiclosFacturacionRepository repoCiclos;
    @Autowired 
    private EstadosSuscripcionRepository repoEstados;

    @GetMapping("/suscripciones")
    public List<Suscripciones> buscarTodos() {
        return serviceSuscripciones.buscarTodos();
    }
    @PostMapping("/suscripciones")
    public ResponseEntity<?> guardar(@RequestBody SuscripcionesDTO dto) {
        try {
            Suscripciones suscripciones = new Suscripciones();
            suscripciones.setLimiteAlumnosContratado(dto.getLimiteAlumnosContratado());
            suscripciones.setLimiteSedesContratadas(dto.getLimiteSedesContratadas());
            suscripciones.setPrecioAcordado(dto.getPrecioAcordado());
            suscripciones.setFechaInicio(dto.getFechaInicio());
            suscripciones.setFechaVencimiento(dto.getFechaVencimiento());
            
            Institucion institucion = repoInstitucion
                .findById(dto.getIdInstitucion())
                .orElse(null);
            Planes planes = repoPlanes
                .findById(dto.getIdPlan())
                .orElse(null);
            CiclosFacturacion ciclosFacturacion = repoCiclos
                .findById(dto.getIdCiclo())
                .orElse(null);
            EstadosSuscripcion estadosSuscripcion = repoEstados
                .findById(dto.getIdEstado())
                .orElse(null);

            suscripciones.setIdInstitucion(institucion);
            suscripciones.setIdPlan(planes);
            suscripciones.setIdCiclo(ciclosFacturacion);
            suscripciones.setIdEstado(estadosSuscripcion);

            Suscripciones suscripcionGuardada = serviceSuscripciones.guardar(suscripciones);
            
            // Generar pagos programados automáticamente
            try {
                int pagosGenerados = servicePagos.generarPagosProgramados(suscripcionGuardada.getIdSuscripcion());
                System.out.println("✅ Se generaron " + pagosGenerados + " pagos programados para la suscripción " + suscripcionGuardada.getIdSuscripcion());
            } catch (Exception e) {
                System.err.println("⚠️ Error al generar pagos programados: " + e.getMessage());
                // No interrumpimos el flujo, la suscripción ya fue creada
            }
            
            return ResponseEntity.ok(suscripcionGuardada);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body("Error al crear suscripción: " + e.getMessage());
        }
    }
    @PutMapping("/suscripciones")
    public ResponseEntity<?> modificar(@RequestBody SuscripcionesDTO dto) {
        try {
            if(dto.getIdSuscripcion() == null) {
                return ResponseEntity.badRequest()
                        .body("ID requerido");
            }
            Suscripciones suscripciones = new Suscripciones();
            suscripciones.setIdSuscripcion(dto.getIdSuscripcion());
            suscripciones.setLimiteAlumnosContratado(dto.getLimiteAlumnosContratado());
            suscripciones.setLimiteSedesContratadas(dto.getLimiteSedesContratadas());
            suscripciones.setPrecioAcordado(dto.getPrecioAcordado());
            suscripciones.setFechaInicio(dto.getFechaInicio());
            suscripciones.setFechaVencimiento(dto.getFechaVencimiento());
            
            Institucion institucion = repoInstitucion
                .findById(dto.getIdInstitucion())
                .orElse(null);
            Planes planes = repoPlanes
                .findById(dto.getIdPlan())
                .orElse(null);
            CiclosFacturacion ciclosFacturacion = repoCiclos
                .findById(dto.getIdCiclo())
                .orElse(null);
            EstadosSuscripcion estadosSuscripcion = repoEstados
                .findById(dto.getIdEstado())
                .orElse(null);

            suscripciones.setIdInstitucion(institucion);
            suscripciones.setIdPlan(planes);
            suscripciones.setIdCiclo(ciclosFacturacion);
            suscripciones.setIdEstado(estadosSuscripcion);

            Suscripciones suscripcionActualizada = serviceSuscripciones.modificar(suscripciones);
            
            // Regenerar pagos programados si cambiaron fechas o ciclo
            try {
                int pagosGenerados = servicePagos.generarPagosProgramados(suscripcionActualizada.getIdSuscripcion());
                System.out.println("✅ Se regeneraron " + pagosGenerados + " pagos programados para la suscripción " + suscripcionActualizada.getIdSuscripcion());
            } catch (Exception e) {
                System.err.println("⚠️ Error al regenerar pagos programados: " + e.getMessage());
            }
            
            return ResponseEntity.ok(suscripcionActualizada);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body("Error al actualizar suscripción: " + e.getMessage());
        }
    }
    @GetMapping("/suscripciones/{id}")
    public Optional<Suscripciones> buscarId(@PathVariable("id") Long id){
        return serviceSuscripciones.buscarId(id);
    }
    @DeleteMapping("/suscripciones/{id}")
    public String eliminar(@PathVariable("id") Long id){
        serviceSuscripciones.eliminar(id);
        return "Suscripción eliminada correctamente";
    }
    
    @GetMapping("/suscripciones/por-institucion/{idInstitucion}")
    public ResponseEntity<?> obtenerSuscripcionActivaPorInstitucion(@PathVariable("idInstitucion") Long idInstitucion) {
        try {
            // Verificar que la institución existe
            if (!repoInstitucion.existsById(idInstitucion)) {
                return ResponseEntity.badRequest()
                    .body("Institución no encontrada");
            }
            
            Optional<Suscripciones> suscripcionOpt = serviceSuscripciones.buscarTodos().stream()
                .filter(s -> s.getIdInstitucion() != null 
                    && s.getIdInstitucion().getIdInstitucion().equals(idInstitucion)
                    && s.getIdEstado() != null 
                    && "Activa".equals(s.getIdEstado().getNombre()))
                .findFirst();
            
            if (suscripcionOpt.isEmpty()) {
                return ResponseEntity.ok()
                    .body(null); // Sin suscripción activa
            }
            
            return ResponseEntity.ok(suscripcionOpt.get());
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body("Error al obtener suscripción: " + e.getMessage());
        }
    }
    
    /**
     * Cancelar suscripción - Cambia el estado a CANCELADA
     * PUT /restful/suscripciones/{id}/cancelar
     */
    @PutMapping("/suscripciones/{id}/cancelar")
    public ResponseEntity<?> cancelarSuscripcion(@PathVariable("id") Long id) {
        try {
            // Buscar la suscripción
            Optional<Suscripciones> suscripcionOpt = serviceSuscripciones.buscarId(id);
            if (suscripcionOpt.isEmpty()) {
                return ResponseEntity.badRequest()
                    .body("Suscripción no encontrada");
            }
            
            Suscripciones suscripcion = suscripcionOpt.get();
            
            // Buscar el estado CANCELADA (ID = 4)
            Optional<EstadosSuscripcion> estadoCanceladaOpt = repoEstados.findById(4L);
            if (estadoCanceladaOpt.isEmpty()) {
                return ResponseEntity.badRequest()
                    .body("Estado CANCELADA no encontrado");
            }
            
            // Actualizar estado a CANCELADA
            suscripcion.setIdEstado(estadoCanceladaOpt.get());
            Suscripciones suscripcionCancelada = serviceSuscripciones.modificar(suscripcion);
            
            return ResponseEntity.ok()
                .body(Map.of(
                    "mensaje", "Suscripción cancelada correctamente",
                    "suscripcion", suscripcionCancelada
                ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body("Error al cancelar suscripción: " + e.getMessage());
        }
    }
    
    /**
     * MIGRACIÓN: Generar pagos programados para todas las suscripciones existentes
     * POST /restful/suscripciones/generar-pagos-todas
     * 
     * USAR SOLO UNA VEZ para migrar suscripciones existentes
     */
    @PostMapping("/suscripciones/generar-pagos-todas")
    public ResponseEntity<?> generarPagosTodas() {
        try {
            List<Suscripciones> todasSuscripciones = serviceSuscripciones.buscarTodos();
            int totalGenerados = 0;
            int errores = 0;
            StringBuilder reporte = new StringBuilder();
            
            for (Suscripciones suscripcion : todasSuscripciones) {
                try {
                    int pagosGenerados = servicePagos.generarPagosProgramados(suscripcion.getIdSuscripcion());
                    totalGenerados += pagosGenerados;
                    reporte.append(String.format("✅ Suscripción %d: %d pagos generados\n", 
                        suscripcion.getIdSuscripcion(), pagosGenerados));
                } catch (Exception e) {
                    errores++;
                    reporte.append(String.format("❌ Suscripción %d: ERROR - %s\n", 
                        suscripcion.getIdSuscripcion(), e.getMessage()));
                }
            }
            
            return ResponseEntity.ok()
                .body(Map.of(
                    "mensaje", "Proceso completado",
                    "totalSuscripciones", todasSuscripciones.size(),
                    "totalPagosGenerados", totalGenerados,
                    "errores", errores,
                    "reporte", reporte.toString()
                ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body("Error al generar pagos: " + e.getMessage());
        }
    }
    
    /**
     * Generar pagos para una suscripción específica
     * POST /restful/suscripciones/{id}/generar-pagos
     */
    @PostMapping("/suscripciones/{id}/generar-pagos")
    public ResponseEntity<?> generarPagosSuscripcion(@PathVariable("id") Long id) {
        try {
            int pagosGenerados = servicePagos.generarPagosProgramados(id);
            return ResponseEntity.ok()
                .body(Map.of(
                    "mensaje", "Pagos generados correctamente",
                    "pagosGenerados", pagosGenerados
                ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body("Error: " + e.getMessage());
        }
    }
}