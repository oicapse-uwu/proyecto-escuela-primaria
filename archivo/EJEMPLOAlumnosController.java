package com.escuelita.www.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.escuelita.www.dto.AlumnoDTO;
import com.escuelita.www.service.AlumnoService;
import com.escuelita.www.security.RequierePermiso;
import lombok.extern.slf4j.Slf4j;

/**
 * EJEMPLO: Validación de permisos FUNCIONALES en endpoints
 * 
 * @RequierePermiso valida que el usuario tenga permiso ANTES de ejecutar
 * Si NO tiene permiso: Retorna 403 FORBIDDEN
 * Si SÍ tiene permiso: Ejecuta el método
 * 
 * USO EN TODOS LOS CONTROLADORES:
 * 
 *   @GetMapping
 *   @RequierePermiso(idModulo = 5, codigo = "VER")
 *   public ResponseEntity<?> obtener() { }
 * 
 *   @PostMapping
 *   @RequierePermiso(idModulo = 5, codigo = "CREAR")
 *   public ResponseEntity<?> crear(@RequestBody DTO dto) { }
 * 
 *   @PutMapping("/{id}")
 *   @RequierePermiso(idModulo = 5, codigo = "EDITAR")
 *   public ResponseEntity<?> editar(@PathVariable Long id, @RequestBody DTO dto) { }
 * 
 *   @DeleteMapping("/{id}")
 *   @RequierePermiso(idModulo = 5, codigo = "ELIMINAR")
 *   public ResponseEntity<?> eliminar(@PathVariable Long id) { }
 * 
 *   @PostMapping("/exportar")
 *   @RequierePermiso(idModulo = 5, codigo = "EXPORTAR")
 *   public ResponseEntity<?> exportar() { }
 */
public class EJEMPLOAlumnosController {

    private AlumnoService alumnoService;

    // ✅ VER ALUMNOS - Requiere permiso "VER"
    @RequierePermiso(idModulo = 5, codigo = "VER")
    public ResponseEntity<?> obtenerAlumnos() {
        return ResponseEntity.ok(alumnoService.obtenerTodos());
    }

    // ✅ CREAR ALUMNO - Requiere permiso "CREAR"
    @RequierePermiso(idModulo = 5, codigo = "CREAR")
    public ResponseEntity<?> crearAlumno(AlumnoDTO dto) {
        return ResponseEntity.ok(alumnoService.crear(dto));
    }

    // ✅ EDITAR ALUMNO - Requiere permiso "EDITAR"
    @RequierePermiso(idModulo = 5, codigo = "EDITAR")
    public ResponseEntity<?> editarAlumno(Long id, AlumnoDTO dto) {
        return ResponseEntity.ok(alumnoService.actualizar(id, dto));
    }

    // ✅ ELIMINAR ALUMNO - Requiere permiso "ELIMINAR"
    @RequierePermiso(idModulo = 5, codigo = "ELIMINAR")
    public ResponseEntity<?> eliminarAlumno(Long id) {
        alumnoService.eliminar(id);
        return ResponseEntity.ok("Alumno eliminado");
    }

    // ✅ EXPORTAR ALUMNOS - Requiere permiso "EXPORTAR"
    @RequierePermiso(idModulo = 5, codigo = "EXPORTAR")
    public ResponseEntity<?> exportarAlumnos() {
        return ResponseEntity.ok(alumnoService.exportarACSV());
    }

    // ✅ VER REPORTES - Requiere permiso "REPORTES"
    @RequierePermiso(idModulo = 5, codigo = "REPORTES")
    public ResponseEntity<?> verReportes() {
        return ResponseEntity.ok(alumnoService.generarReportes());
    }
}
