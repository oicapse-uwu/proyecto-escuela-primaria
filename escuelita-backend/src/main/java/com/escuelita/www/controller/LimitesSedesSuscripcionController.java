package com.escuelita.www.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.escuelita.www.entity.LimitesSedesSuscripcion;
import com.escuelita.www.entity.LimitesSedesSuscripcionDTO;
import com.escuelita.www.entity.Sedes;
import com.escuelita.www.entity.Suscripciones;
import com.escuelita.www.repository.SedesRepository;
import com.escuelita.www.repository.SuscripcionesRepository;
import com.escuelita.www.service.ILimitesSedesSuscripcionService;

@RestController
@RequestMapping("/api/limites-sedes")
@CrossOrigin(origins = "http://localhost:5173")
public class LimitesSedesSuscripcionController {
    
    @Autowired
    private ILimitesSedesSuscripcionService servicioLimites;
    
    @Autowired
    private SuscripcionesRepository repoSuscripciones;
    
    @Autowired
    private SedesRepository repoSedes;
    
    /**
     * GET /api/limites-sedes
     * Listar todos los límites
     */
    @GetMapping
    public ResponseEntity<List<LimitesSedesSuscripcion>> listarTodos() {
        try {
            List<LimitesSedesSuscripcion> limites = servicioLimites.buscarTodos();
            return ResponseEntity.ok(limites);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
    
    /**
     * GET /api/limites-sedes/suscripcion/{idSuscripcion}
     * Obtener límites de una suscripción específica
     */
    @GetMapping("/suscripcion/{idSuscripcion}")
    public ResponseEntity<List<LimitesSedesSuscripcion>> obtenerPorSuscripcion(@PathVariable Long idSuscripcion) {
        try {
            List<LimitesSedesSuscripcion> limites = servicioLimites.buscarPorSuscripcion(idSuscripcion);
            return ResponseEntity.ok(limites);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
    
    /**
     * GET /api/limites-sedes/{id}
     * Obtener un límite por ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<LimitesSedesSuscripcion> obtenerPorId(@PathVariable Long id) {
        try {
            Optional<LimitesSedesSuscripcion> limite = servicioLimites.buscarPorId(id);
            return limite.map(ResponseEntity::ok)
                        .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
    
    /**
     * POST /api/limites-sedes
     * Crear un nuevo límite
     */
    @PostMapping
    public ResponseEntity<?> crear(@RequestBody LimitesSedesSuscripcionDTO dto) {
        try {
            // Validar que existan suscripción y sede
            Optional<Suscripciones> suscripcionOpt = repoSuscripciones.findById(dto.getIdSuscripcion());
            Optional<Sedes> sedeOpt = repoSedes.findById(dto.getIdSede());
            
            if (!suscripcionOpt.isPresent() || !sedeOpt.isPresent()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Suscripción o Sede no encontrada"));
            }
            
            // Crear entidad
            LimitesSedesSuscripcion limite = new LimitesSedesSuscripcion();
            limite.setIdSuscripcion(suscripcionOpt.get());
            limite.setIdSede(sedeOpt.get());
            limite.setLimiteAlumnosAsignado(dto.getLimiteAlumnosAsignado());
            limite.setEstado(dto.getEstado() != null ? dto.getEstado() : 1);
            
            LimitesSedesSuscripcion guardado = servicioLimites.guardar(limite);
            return ResponseEntity.status(HttpStatus.CREATED).body(guardado);
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", e.getMessage()));
        }
    }
    
    /**
     * PUT /api/limites-sedes/{id}
     * Actualizar un límite existente
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Long id, @RequestBody LimitesSedesSuscripcionDTO dto) {
        try {
            Optional<LimitesSedesSuscripcion> limiteOpt = servicioLimites.buscarPorId(id);
            
            if (!limiteOpt.isPresent()) {
                return ResponseEntity.notFound().build();
            }
            
            LimitesSedesSuscripcion limite = limiteOpt.get();
            
            // Actualizar solo el límite de alumnos y estado
            if (dto.getLimiteAlumnosAsignado() != null) {
                limite.setLimiteAlumnosAsignado(dto.getLimiteAlumnosAsignado());
            }
            if (dto.getEstado() != null) {
                limite.setEstado(dto.getEstado());
            }
            
            LimitesSedesSuscripcion actualizado = servicioLimites.guardar(limite);
            return ResponseEntity.ok(actualizado);
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", e.getMessage()));
        }
    }
    
    /**
     * DELETE /api/limites-sedes/{id}
     * Eliminar un límite
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        try {
            Optional<LimitesSedesSuscripcion> limiteOpt = servicioLimites.buscarPorId(id);
            
            if (!limiteOpt.isPresent()) {
                return ResponseEntity.notFound().build();
            }
            
            servicioLimites.eliminar(id);
            return ResponseEntity.ok(Map.of("mensaje", "Límite eliminado exitosamente"));
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", e.getMessage()));
        }
    }
    
    /**
     * POST /api/limites-sedes/equitativa/{idSuscripcion}
     * Generar distribución equitativa automática
     */
    @PostMapping("/equitativa/{idSuscripcion}")
    public ResponseEntity<?> generarDistribucionEquitativa(@PathVariable Long idSuscripcion) {
        try {
            List<LimitesSedesSuscripcion> limites = servicioLimites.generarDistribucionEquitativa(idSuscripcion);
            return ResponseEntity.ok(Map.of(
                "mensaje", "Distribución equitativa generada exitosamente",
                "limites", limites
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", e.getMessage()));
        }
    }
    
    /**
     * POST /api/limites-sedes/personalizada/{idSuscripcion}
     * Guardar distribución personalizada
     */
    @PostMapping("/personalizada/{idSuscripcion}")
    public ResponseEntity<?> guardarDistribucionPersonalizada(
            @PathVariable Long idSuscripcion,
            @RequestBody List<LimitesSedesSuscripcionDTO> dtos) {
        try {
            // Convertir DTOs a entidades
            List<LimitesSedesSuscripcion> limites = new ArrayList<>();
            
            for (LimitesSedesSuscripcionDTO dto : dtos) {
                Optional<Suscripciones> suscripcionOpt = repoSuscripciones.findById(idSuscripcion);
                Optional<Sedes> sedeOpt = repoSedes.findById(dto.getIdSede());
                
                if (!suscripcionOpt.isPresent() || !sedeOpt.isPresent()) {
                    return ResponseEntity.badRequest()
                        .body(Map.of("error", "Suscripción o Sede no encontrada"));
                }
                
                LimitesSedesSuscripcion limite = new LimitesSedesSuscripcion();
                limite.setIdSuscripcion(suscripcionOpt.get());
                limite.setIdSede(sedeOpt.get());
                limite.setLimiteAlumnosAsignado(dto.getLimiteAlumnosAsignado());
                limite.setEstado(1);
                
                limites.add(limite);
            }
            
            // Validar que no exceda el límite total
            if (!servicioLimites.validarLimitesPersonalizados(idSuscripcion, limites)) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "La suma de límites excede el límite total de la suscripción"));
            }
            
            // Desactivar distribución anterior (soft delete)
            servicioLimites.eliminarPorSuscripcion(idSuscripcion);
            
            // Guardar nueva distribución (siempre crea nuevos registros después de desactivar los viejos)
            List<LimitesSedesSuscripcion> guardados = new ArrayList<>();
            for (LimitesSedesSuscripcion limite : limites) {
                guardados.add(servicioLimites.guardar(limite));
            }
            
            System.out.println("✅ Distribución personalizada guardada: " + guardados.size() + " límites");
            
            return ResponseEntity.ok(Map.of(
                "mensaje", "Distribución personalizada guardada exitosamente",
                "limites", guardados
            ));
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", e.getMessage()));
        }
    }
}
