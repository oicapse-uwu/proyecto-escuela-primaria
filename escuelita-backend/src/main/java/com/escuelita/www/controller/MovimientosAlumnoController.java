package com.escuelita.www.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.escuelita.www.entity.Matriculas;
import com.escuelita.www.entity.MovimientosAlumno;
import com.escuelita.www.entity.MovimientosAlumnoDTO;
import com.escuelita.www.repository.MatriculasRepository;
import com.escuelita.www.security.RequireModulo;
import com.escuelita.www.service.jpa.MovimientosAlumnoService;

@RestController
@RequestMapping("/restful")
public class MovimientosAlumnoController {
    
    @Autowired
    private MovimientosAlumnoService serviceMovimientos;
    
    @Autowired
    private MatriculasRepository repoMatriculas;
    
    /**
     * Listar todos los movimientos
     */
    @GetMapping("/movimientos-alumno")
    @RequireModulo(5)  // 5 = Módulo ALUMNOS
    public List<MovimientosAlumno> listarTodos() {
        return serviceMovimientos.buscarTodos();
    }
    
    /**
     * Buscar movimiento por ID
     */
    @GetMapping("/movimientos-alumno/{id}")
    @RequireModulo(5)
    public ResponseEntity<?> buscarPorId(@PathVariable Long id) {
        Optional<MovimientosAlumno> movimiento = serviceMovimientos.buscarPorId(id);
        if (movimiento.isPresent()) {
            return ResponseEntity.ok(movimiento.get());
        }
        return ResponseEntity.notFound().build();
    }
    
    /**
     * Buscar movimientos por matrícula
     */
    @GetMapping("/movimientos-alumno/matricula/{idMatricula}")
    @RequireModulo(5)
    public List<MovimientosAlumno> buscarPorMatricula(@PathVariable Long idMatricula) {
        return serviceMovimientos.buscarPorMatricula(idMatricula);
    }
    
    /**
     * Buscar movimientos por alumno
     */
    @GetMapping("/movimientos-alumno/alumno/{idAlumno}")
    @RequireModulo(5)
    public List<MovimientosAlumno> buscarPorAlumno(@PathVariable Long idAlumno) {
        return serviceMovimientos.buscarPorAlumno(idAlumno);
    }
    
    /**
     * Buscar movimientos pendientes
     */
    @GetMapping("/movimientos-alumno/pendientes")
    @RequireModulo(5)
    public List<MovimientosAlumno> buscarPendientes() {
        return serviceMovimientos.buscarPendientes();
    }
    
    /**
     * Buscar movimientos por tipo
     */
    @GetMapping("/movimientos-alumno/tipo/{tipo}")
    @RequireModulo(5)
    public List<MovimientosAlumno> buscarPorTipo(@PathVariable String tipo) {
        return serviceMovimientos.buscarPorTipo(tipo);
    }
    
    /**
     * Crear nuevo movimiento
     */
    @PostMapping("/movimientos-alumno")
    @RequireModulo(5)
    public ResponseEntity<?> crear(@RequestBody MovimientosAlumnoDTO dto) {
        try {
            // Convertir DTO a Entity
            MovimientosAlumno movimiento = new MovimientosAlumno();
            
            // Buscar matrícula
            Matriculas matricula = repoMatriculas.findById(dto.getIdMatricula())
                .orElseThrow(() -> new RuntimeException("Matrícula no encontrada"));
            
            movimiento.setIdMatricula(matricula);
            movimiento.setTipoMovimiento(dto.getTipoMovimiento());
            movimiento.setFechaMovimiento(dto.getFechaMovimiento());
            movimiento.setMotivo(dto.getMotivo());
            movimiento.setColegioDestino(dto.getColegioDestino());
            movimiento.setDocumentosUrl(dto.getDocumentosUrl());
            movimiento.setObservaciones(dto.getObservaciones());
            movimiento.setEstadoSolicitud(dto.getEstadoSolicitud());
            
            MovimientosAlumno movimientoGuardado = serviceMovimientos.crear(movimiento);
            return ResponseEntity.status(HttpStatus.CREATED).body(movimientoGuardado);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al crear el movimiento: " + e.getMessage());
        }
    }
    
    /**
     * Aprobar movimiento
     */
    @PutMapping("/movimientos-alumno/{id}/aprobar")
    @RequireModulo(5)
    public ResponseEntity<?> aprobar(@PathVariable Long id) {
        try {
            MovimientosAlumno movimiento = serviceMovimientos.aprobar(id);
            return ResponseEntity.ok(movimiento);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al aprobar el movimiento: " + e.getMessage());
        }
    }
    
    /**
     * Rechazar movimiento
     */
    @PutMapping("/movimientos-alumno/{id}/rechazar")
    @RequireModulo(5)
    public ResponseEntity<?> rechazar(@PathVariable Long id) {
        try {
            MovimientosAlumno movimiento = serviceMovimientos.rechazar(id);
            return ResponseEntity.ok(movimiento);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al rechazar el movimiento: " + e.getMessage());
        }
    }
    
    /**
     * Actualizar movimiento
     */
    @PutMapping("/movimientos-alumno/{id}")
    @RequireModulo(5)
    public ResponseEntity<?> actualizar(@PathVariable Long id, @RequestBody MovimientosAlumnoDTO dto) {
        try {
            Optional<MovimientosAlumno> optMovimiento = serviceMovimientos.buscarPorId(id);
            
            if (optMovimiento.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            MovimientosAlumno movimiento = optMovimiento.get();
            
            // Actualizar campos
            if (dto.getTipoMovimiento() != null) {
                movimiento.setTipoMovimiento(dto.getTipoMovimiento());
            }
            if (dto.getFechaMovimiento() != null) {
                movimiento.setFechaMovimiento(dto.getFechaMovimiento());
            }
            if (dto.getMotivo() != null) {
                movimiento.setMotivo(dto.getMotivo());
            }
            if (dto.getColegioDestino() != null) {
                movimiento.setColegioDestino(dto.getColegioDestino());
            }
            if (dto.getDocumentosUrl() != null) {
                movimiento.setDocumentosUrl(dto.getDocumentosUrl());
            }
            if (dto.getObservaciones() != null) {
                movimiento.setObservaciones(dto.getObservaciones());
            }
            
            MovimientosAlumno movimientoActualizado = serviceMovimientos.actualizar(movimiento);
            return ResponseEntity.ok(movimientoActualizado);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al actualizar el movimiento: " + e.getMessage());
        }
    }
    
    /**
     * Eliminar movimiento
     */
    @DeleteMapping("/movimientos-alumno/{id}")
    @RequireModulo(5)
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        try {
            serviceMovimientos.eliminar(id);
            return ResponseEntity.ok("Movimiento eliminado correctamente");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al eliminar el movimiento: " + e.getMessage());
        }
    }
}
