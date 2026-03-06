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

import com.escuelita.www.entity.Calificaciones;
import com.escuelita.www.entity.CalificacionesDTO;
import com.escuelita.www.entity.Evaluaciones;
import com.escuelita.www.entity.Matriculas;
import com.escuelita.www.repository.EvaluacionesRepository;
import com.escuelita.www.repository.MatriculasRepository;
import com.escuelita.www.service.ICalificacionesService;
import com.escuelita.www.security.RequireModulo;

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
    @RequireModulo(7)  // 7 = Módulo EVALUACIONES Y NOTAS
    public List<Calificaciones> buscarTodos() {
        return serviceCalificaciones.buscarTodos();
    }
    @PostMapping("/calificaciones")
    @RequireModulo(7)  // 7 = Módulo EVALUACIONES Y NOTAS
    public ResponseEntity<?> guardar(@RequestBody CalificacionesDTO dto) {
        Calificaciones calificaciones = new Calificaciones();
        calificaciones.setNotaObtenida(dto.getNotaObtenida());
        calificaciones.setObservaciones(dto.getObservaciones());
        calificaciones.setFechaCalificacion(dto.getFechaCalificacion());

        Evaluaciones evaluaciones = repoEvaluaciones
            .findById(dto.getIdEvaluacion())
            .orElse(null);
        Matriculas matriculas = repoMatriculas
            .findById(dto.getIdMatricula())
            .orElse(null);

        calificaciones.setIdEvaluacion(evaluaciones);
        calificaciones.setIdMatricula(matriculas);

        return ResponseEntity.ok(serviceCalificaciones.guardar(calificaciones));
    }
    @PutMapping("/calificaciones")
    @RequireModulo(7)  // 7 = Módulo EVALUACIONES Y NOTAS
    public ResponseEntity<?> modificar(@RequestBody CalificacionesDTO dto) {
        if(dto.getIdCalificacion() == null) {
            return ResponseEntity.badRequest()
                    .body("ID de calificación es requerido");
        }
        Calificaciones calificaciones = new Calificaciones();
        calificaciones.setIdCalificacion(dto.getIdCalificacion());
        calificaciones.setNotaObtenida(dto.getNotaObtenida());
        calificaciones.setObservaciones(dto.getObservaciones());
        calificaciones.setFechaCalificacion(dto.getFechaCalificacion());

        Evaluaciones evaluaciones = repoEvaluaciones
            .findById(dto.getIdEvaluacion())
            .orElse(null);
        Matriculas matriculas = repoMatriculas
            .findById(dto.getIdMatricula())
            .orElse(null);

        calificaciones.setIdEvaluacion(evaluaciones);
        calificaciones.setIdMatricula(matriculas);

        return ResponseEntity.ok(serviceCalificaciones.modificar(calificaciones));
    }
    @GetMapping("/calificaciones/{id}")
    @RequireModulo(7)  // 7 = Módulo EVALUACIONES Y NOTAS
    public Optional<Calificaciones> buscarId(@PathVariable("id") Long id) {
        return serviceCalificaciones.buscarId(id);
    }
    
    @DeleteMapping("/calificaciones/{id}")
    @RequireModulo(7)  // 7 = Módulo EVALUACIONES Y NOTAS
    public String eliminar(@PathVariable Long id) {
        serviceCalificaciones.eliminar(id);
        return "Calificación eliminada correctamente";
    }
}