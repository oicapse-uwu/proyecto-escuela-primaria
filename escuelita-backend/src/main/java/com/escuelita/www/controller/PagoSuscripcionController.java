package com.escuelita.www.controller;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.escuelita.www.entity.EstadoVerificacion;
import com.escuelita.www.entity.PagoSuscripcion;
import com.escuelita.www.entity.PagoSuscripcionDTO;
import com.escuelita.www.service.FileStorageService;
import com.escuelita.www.service.IPagoSuscripcionService;
import com.fasterxml.jackson.databind.ObjectMapper;


@RestController
@RequestMapping("/restful/pagos-suscripcion")
public class PagoSuscripcionController {
    
    @Autowired
    private IPagoSuscripcionService pagoService;
    
    @Autowired
    private FileStorageService fileStorageService;
    
    @GetMapping
    public ResponseEntity<List<PagoSuscripcionDTO>> obtenerTodos() {
        List<PagoSuscripcion> pagos = pagoService.buscarTodos();
        return ResponseEntity.ok(pagoService.convertirListaADTO(pagos));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerPorId(@PathVariable Long id) {
        return pagoService.buscarId(id)
            .map(pago -> ResponseEntity.ok(pagoService.convertirADTO(pago)))
            .orElse(ResponseEntity.notFound().build());
    }
    

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        try {
            pagoService.eliminar(id);
            return ResponseEntity.ok(Map.of("mensaje", "Pago eliminado correctamente"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @PostMapping(value = "/registrar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> registrarPago(
            @RequestPart("datos") String datosJson,
            @RequestPart(value = "comprobante", required = true) MultipartFile comprobante,
            @RequestParam Long idSuperAdmin) {
        try {
            // Parsear JSON a DTO
            ObjectMapper mapper = new ObjectMapper();
            mapper.findAndRegisterModules(); // Para soportar LocalDate
            PagoSuscripcionDTO dto = mapper.readValue(datosJson, PagoSuscripcionDTO.class);
            
            // Registrar pago
            PagoSuscripcion pago = pagoService.registrarPago(dto, comprobante, idSuperAdmin);
            
            return ResponseEntity.ok(Map.of(
                "mensaje", "Pago registrado correctamente",
                "pago", pagoService.convertirADTO(pago)
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @PutMapping(value = "/{id}/actualizar-comprobante", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> actualizarPagoProgramado(
            @PathVariable Long id,
            @RequestPart("datos") String datosJson,
            @RequestPart(value = "comprobante", required = true) MultipartFile comprobante) {
        try {
            // Parsear JSON a DTO
            ObjectMapper mapper = new ObjectMapper();
            mapper.findAndRegisterModules(); // Para soportar LocalDate
            PagoSuscripcionDTO dto = mapper.readValue(datosJson, PagoSuscripcionDTO.class);
            
            // Actualizar pago
            PagoSuscripcion pago = pagoService.actualizarPagoProgramado(id, dto, comprobante);
            
            return ResponseEntity.ok(Map.of(
                "mensaje", "Pago actualizado correctamente. Comprobante registrado.",
                "pago", pagoService.convertirADTO(pago)
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @PutMapping("/{id}/verificar")
    public ResponseEntity<?> verificarPago(
            @PathVariable Long id,
            @RequestParam Long idSuperAdmin) {
        try {
            PagoSuscripcion pago = pagoService.verificarPago(id, idSuperAdmin);
            return ResponseEntity.ok(Map.of(
                "mensaje", "Pago verificado correctamente. Suscripción activada.",
                "pago", pagoService.convertirADTO(pago)
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @PutMapping("/{id}/rechazar")
    public ResponseEntity<?> rechazarPago(
            @PathVariable Long id,
            @RequestParam String motivo,
            @RequestParam Long idSuperAdmin) {
        try {
            PagoSuscripcion pago = pagoService.rechazarPago(id, motivo, idSuperAdmin);
            return ResponseEntity.ok(Map.of(
                "mensaje", "Pago rechazado",
                "pago", pagoService.convertirADTO(pago)
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/suscripcion/{idSuscripcion}")
    public ResponseEntity<List<PagoSuscripcionDTO>> obtenerPorSuscripcion(@PathVariable Long idSuscripcion) {
        List<PagoSuscripcion> pagos = pagoService.obtenerPagosPorSuscripcion(idSuscripcion);
        return ResponseEntity.ok(pagoService.convertirListaADTO(pagos));
    }
    
    @GetMapping("/pendientes")
    public ResponseEntity<List<PagoSuscripcionDTO>> obtenerPendientes() {
        List<PagoSuscripcion> pagos = pagoService.obtenerPagosPendientes();
        return ResponseEntity.ok(pagoService.convertirListaADTO(pagos));
    }
    
    /**
     * Obtener pagos por estado de verificación
     * GET /restful/pagos-suscripcion/estado/{estado}
     * 
     * @param estado PENDIENTE, VERIFICADO o RECHAZADO
     */
    @GetMapping("/estado/{estado}")
    public ResponseEntity<?> obtenerPorEstado(@PathVariable String estado) {
        try {
            EstadoVerificacion estadoEnum = EstadoVerificacion.valueOf(estado.toUpperCase());
            List<PagoSuscripcion> pagos = pagoService.obtenerPagosPorEstado(estadoEnum);
            return ResponseEntity.ok(pagoService.convertirListaADTO(pagos));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Estado inválido. Use: PENDIENTE, VERIFICADO o RECHAZADO"
            ));
        }
    }
    
    @GetMapping("/rango")
    public ResponseEntity<List<PagoSuscripcionDTO>> obtenerPorRangoFechas(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaInicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaFin) {
        List<PagoSuscripcion> pagos = pagoService.obtenerPagosPorRangoFechas(fechaInicio, fechaFin);
        return ResponseEntity.ok(pagoService.convertirListaADTO(pagos));
    }
    
    @GetMapping("/comprobante/{filename}")
    public ResponseEntity<Resource> verComprobante(@PathVariable String filename) {
        try {
            Resource file = fileStorageService.cargarArchivo(filename, "comprobantes/suscripciones");
            
            // Determinar tipo de contenido
            String contentType = "application/octet-stream";
            if (filename.toLowerCase().endsWith(".pdf")) {
                contentType = "application/pdf";
            } else if (filename.toLowerCase().matches(".*\\.(jpg|jpeg|png|gif|webp)$")) {
                contentType = "image/" + filename.substring(filename.lastIndexOf('.') + 1);
            }
            
            return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filename + "\"")
                .body(file);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/comprobante/{filename}/descargar")
    public ResponseEntity<Resource> descargarComprobante(@PathVariable String filename) {
        try {
            Resource file = fileStorageService.cargarArchivo(filename, "comprobantes/suscripciones");
            
            return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .body(file);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/estadisticas")
    public ResponseEntity<Map<String, Object>> obtenerEstadisticas() {
        List<PagoSuscripcion> todos = pagoService.buscarTodos();
        List<PagoSuscripcion> pendientes = pagoService.obtenerPagosPendientes();
        List<PagoSuscripcion> verificados = pagoService.obtenerPagosPorEstado(EstadoVerificacion.VERIFICADO);
        List<PagoSuscripcion> rechazados = pagoService.obtenerPagosPorEstado(EstadoVerificacion.RECHAZADO);
        
        // Calcular total recaudado (solo verificados)
        double totalRecaudado = verificados.stream()
            .mapToDouble(p -> p.getMontoPagado() != null ? p.getMontoPagado().doubleValue() : 0)
            .sum();
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalPagos", todos.size());
        stats.put("pendientes", pendientes.size());
        stats.put("verificados", verificados.size());
        stats.put("rechazados", rechazados.size());
        stats.put("totalRecaudado", totalRecaudado);
        
        return ResponseEntity.ok(stats);
    }
}
