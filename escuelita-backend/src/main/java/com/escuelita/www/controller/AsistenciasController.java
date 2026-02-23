package com.escuelita.www.controller;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.escuelita.www.entity.*;
import com.escuelita.www.repository.*;
import com.escuelita.www.service.IAsistenciasService;

@RestController
@RequestMapping("/restful")
public class AsistenciasController {
    @Autowired
    private IAsistenciasService serviceAsistencias;
    @Autowired
    private AsignacionDocenteRepository repoAsignacion;
    @Autowired
    private MatriculasRepository repoMatriculas;

    @GetMapping("/asistencias")
    public List<Asistencias> buscartodos() {
        return serviceAsistencias.buscarTodos();
    }

    @PostMapping("/asistencias")
    public ResponseEntity<?> guardar(@RequestBody AsistenciasDTO dto) {
        Asistencias asis = new Asistencias();
        asis.setFecha(dto.getFecha());
        asis.setEstado_asistencia(dto.getEstado_asistencia());
        asis.setObservaciones(dto.getObservaciones());

        asis.setId_asignacion(repoAsignacion.findById(dto.getId_asignacion()).orElse(null));
        asis.setId_matricula(repoMatriculas.findById(dto.id_matricula()).orElse(null));

        return ResponseEntity.ok(serviceAsistencias.guardar(asis));
    }

    @PutMapping("/asistencias")
    public ResponseEntity<?> modificar(@RequestBody AsistenciasDTO dto) {
        if(dto.getId_asistencia() == null) return ResponseEntity.badRequest().body("ID requerido");
        
        Asistencias asis = new Asistencias();
        asis.setId_asistencia(dto.getId_asistencia());
        asis.setFecha(dto.getFecha());
        asis.setEstado_asistencia(dto.getEstado_asistencia());
        asis.setObservaciones(dto.getObservaciones());

        AsignacionDocente ad = new AsignacionDocente(); ad.setId_asignacion(dto.getId_asignacion());
        asis.setId_asignacion(ad);

        Matriculas mat = new Matriculas(); mat.setId_matricula(dto.id_matricula());
        asis.setId_matricula(mat);

        return ResponseEntity.ok(serviceAsistencias.modificar(asis));
    }

    @GetMapping("/asistencias/{id}")
    public Optional<Asistencias> buscarId(@PathVariable Long id) { return serviceAsistencias.buscarId(id); }

    @DeleteMapping("/asistencias/{id}")
    public String eliminar(@PathVariable Long id) {
        serviceAsistencias.eliminar(id);
        return "Registro de asistencia eliminado";
    }
}