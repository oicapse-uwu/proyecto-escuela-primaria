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

import com.escuelita.www.entity.Calificaciones;
import com.escuelita.www.entity.CalificacionesDTO;
import com.escuelita.www.entity.Evaluaciones;
import com.escuelita.www.entity.Matriculas;
import com.escuelita.www.repository.EvaluacionesRepository;
import com.escuelita.www.repository.MatriculasRepository;
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
    public List<Calificaciones> buscarTodos() {
        return serviceCalificaciones.buscarTodos();
    }

    @PostMapping("/calificaciones")
    public ResponseEntity<?> guardar(@RequestBody CalificacionesDTO dto) {
        Calificaciones calificacion = new Calificaciones();
        calificacion.setNotaObtenida(dto.getNotaObtenida());
        calificacion.setObservaciones(dto.getObservaciones());
        calificacion.setFechaCalificacion(dto.getFechaCalificacion());

        calificacion.setIdEvaluacion(repoEvaluaciones.findById(dto.getIdEvaluacion()).orElse(null));
        calificacion.setIdMatricula(repoMatriculas.findById(dto.getIdMatricula()).orElse(null));

        return ResponseEntity.ok(serviceCalificaciones.guardar(calificacion));
    }

    @PutMapping("/calificaciones")
    public ResponseEntity<?> modificar(@RequestBody CalificacionesDTO dto) {
        if(dto.getIdCalificacion() == null) return ResponseEntity.badRequest().body("ID requerido");
        
        Calificaciones calificacion = new Calificaciones();
        calificacion.setIdCalificacion(dto.getIdCalificacion());
        calificacion.setNotaObtenida(dto.getNotaObtenida());
        calificacion.setObservaciones(dto.getObservaciones());
        calificacion.setFechaCalificacion(dto.getFechaCalificacion());

        Evaluaciones evaluacion = new Evaluaciones(); evaluacion.setIdEvaluacion(dto.getIdEvaluacion());
        calificacion.setIdEvaluacion(evaluacion);

        Matriculas matricula = new Matriculas(); matricula.setIdMatricula(dto.getIdMatricula());
        calificacion.setIdMatricula(matricula);

        return ResponseEntity.ok(serviceCalificaciones.modificar(calificacion));
    }

    @GetMapping("/calificaciones/{id}")
    public Optional<Calificaciones> buscarId(@PathVariable Long id) { return serviceCalificaciones.buscarId(id); }

    @DeleteMapping("/calificaciones/{id}")
    public String eliminar(@PathVariable Long id) {
        serviceCalificaciones.eliminar(id);
        return "Calificación eliminada correctamente";
    }
}