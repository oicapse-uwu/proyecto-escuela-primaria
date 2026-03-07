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

import com.escuelita.www.entity.AsignacionDocente;
import com.escuelita.www.entity.Evaluaciones;
import com.escuelita.www.entity.EvaluacionesDTO;
import com.escuelita.www.entity.Periodos;
import com.escuelita.www.entity.TiposEvaluacion;
import com.escuelita.www.entity.TiposNota;
import com.escuelita.www.repository.AsignacionDocenteRepository;
import com.escuelita.www.repository.PeriodosRepository;
import com.escuelita.www.repository.TiposEvaluacionRepository;
import com.escuelita.www.repository.TiposNotaRepository;
import com.escuelita.www.service.IEvaluacionesService;
import com.escuelita.www.security.RequireModulo;

@RestController
@RequestMapping("/restful")
public class EvaluacionesController {

    @Autowired
    private IEvaluacionesService serviceEvaluaciones;
    @Autowired
    private AsignacionDocenteRepository repoAsignacion;
    @Autowired
    private PeriodosRepository repoPeriodos;
    @Autowired
    private TiposNotaRepository repoTiposNota;
    @Autowired
    private TiposEvaluacionRepository repoTiposEvaluacion;

    @GetMapping("/evaluaciones")
    @RequireModulo(7)  // 7 = Módulo EVALUACIONES Y NOTAS
    public List<Evaluaciones> buscarTodos() {
        return serviceEvaluaciones.buscarTodos();
    }
    @PostMapping("/evaluaciones")
    @RequireModulo(7)  // 7 = Módulo EVALUACIONES Y NOTAS
    public ResponseEntity<?> guardar(@RequestBody EvaluacionesDTO dto) {
        Evaluaciones evaluaciones = new Evaluaciones();
        evaluaciones.setTemaEspecifico(dto.getTemaEspecifico());
        evaluaciones.setFechaEvaluacion(dto.getFechaEvaluacion());

        AsignacionDocente asignacionDocente = repoAsignacion
            .findById(dto.getIdAsignacion())
            .orElse(null);
        Periodos periodos = repoPeriodos
            .findById(dto.getIdPeriodo())
            .orElse(null);
        TiposNota tiposNota = repoTiposNota
            .findById(dto.getIdTipoNota())
            .orElse(null);
        TiposEvaluacion tiposEvaluacion = repoTiposEvaluacion
            .findById(dto.getIdTipoEvaluacion())
            .orElse(null);

        evaluaciones.setIdAsignacion(asignacionDocente);
        evaluaciones.setIdPeriodo(periodos);
        evaluaciones.setIdTipoNota(tiposNota);
        evaluaciones.setIdTipoEvaluacion(tiposEvaluacion);

        return ResponseEntity.ok(serviceEvaluaciones.guardar(evaluaciones));
    }
    @PutMapping("/evaluaciones")
    @RequireModulo(7)  // 7 = Módulo EVALUACIONES Y NOTAS
    public ResponseEntity<?> modificar(@RequestBody EvaluacionesDTO dto) {
        if(dto.getIdEvaluacion() == null) {
            return ResponseEntity.badRequest()
                .body("ID de evaluación es requerido");
        }
        Evaluaciones evaluaciones = new Evaluaciones();
        evaluaciones.setIdEvaluacion(dto.getIdEvaluacion());
        evaluaciones.setTemaEspecifico(dto.getTemaEspecifico());
        evaluaciones.setFechaEvaluacion(dto.getFechaEvaluacion());

        AsignacionDocente asignacionDocente = repoAsignacion
            .findById(dto.getIdAsignacion())
            .orElse(null);
        Periodos periodos = repoPeriodos
            .findById(dto.getIdPeriodo())
            .orElse(null);
        TiposNota tiposNota = repoTiposNota
            .findById(dto.getIdTipoNota())
            .orElse(null);
        TiposEvaluacion tiposEvaluacion = repoTiposEvaluacion
            .findById(dto.getIdTipoEvaluacion())
            .orElse(null);

        evaluaciones.setIdAsignacion(asignacionDocente);
        evaluaciones.setIdPeriodo(periodos);
        evaluaciones.setIdTipoNota(tiposNota);
        evaluaciones.setIdTipoEvaluacion(tiposEvaluacion);

        return ResponseEntity.ok(serviceEvaluaciones.modificar(evaluaciones));
    }
    @GetMapping("/evaluaciones/{id}")
    @RequireModulo(7)  // 7 = Módulo EVALUACIONES Y NOTAS
    public Optional<Evaluaciones> buscarId(@PathVariable("id") Long id) {
        return serviceEvaluaciones.buscarId(id);
    }
    @DeleteMapping("/evaluaciones/{id}")
    @RequireModulo(7)  // 7 = Módulo EVALUACIONES Y NOTAS
    public String eliminar(@PathVariable Long id) {
        serviceEvaluaciones.eliminar(id);
        return "Evaluación eliminada correctamente";
    }
}