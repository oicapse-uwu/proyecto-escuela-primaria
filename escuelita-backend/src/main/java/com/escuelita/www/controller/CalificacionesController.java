package com.escuelita.www.controller;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.escuelita.www.entity.*;
import com.escuelita.www.repository.*;
import com.escuelita.www.service.ICalificacionesService;

@RestController
@RequestMapping("/restful")
public class CalificacionesController {
    @Autowired
    private ICalificacionesService serviceCalificaciones;
    @Autowired
    private EvaluacionesRepository repoEvaluaciones;
    @Autowired
    private MatriculasRepository repoMatriculas;

    @GetMapping("/calificaciones")
    public List<Calificaciones> buscartodos() {
        return serviceCalificaciones.buscarTodos();
    }

    @PostMapping("/calificaciones")
    public ResponseEntity<?> guardar(@RequestBody CalificacionesDTO dto) {
        Calificaciones cal = new Calificaciones();
        cal.setNota_obtenida(dto.getNota_obtenida());
        cal.setObservaciones(dto.getObservaciones());
        cal.setFecha_calificacion(dto.getFecha_calificacion());

        cal.setId_evaluacion(repoEvaluaciones.findById(dto.getId_evaluacion()).orElse(null));
        cal.setId_matricula(repoMatriculas.findById(dto.getId_matricula()).orElse(null));

        return ResponseEntity.ok(serviceCalificaciones.guardar(cal));
    }

    @PutMapping("/calificaciones")
    public ResponseEntity<?> modificar(@RequestBody CalificacionesDTO dto) {
        if(dto.getId_calificacion() == null) return ResponseEntity.badRequest().body("ID requerido");
        
        Calificaciones cal = new Calificaciones();
        cal.setId_calificacion(dto.getId_calificacion());
        cal.setNota_obtenida(dto.getNota_obtenida());
        cal.setObservaciones(dto.getObservaciones());
        cal.setFecha_calificacion(dto.getFecha_calificacion());

        Evaluaciones ev = new Evaluaciones(); ev.setId_evaluacion(dto.getId_evaluacion());
        cal.setId_evaluacion(ev);

        Matriculas mat = new Matriculas(); mat.setId_matricula(dto.getId_matricula());
        cal.setId_matricula(mat);

        return ResponseEntity.ok(serviceCalificaciones.modificar(cal));
    }

    @GetMapping("/calificaciones/{id}")
    public Optional<Calificaciones> buscarId(@PathVariable Long id) { return serviceCalificaciones.buscarId(id); }

    @DeleteMapping("/calificaciones/{id}")
    public String eliminar(@PathVariable Long id) {
        serviceCalificaciones.eliminar(id);
        return "Calificación eliminada correctamente";
    }
}