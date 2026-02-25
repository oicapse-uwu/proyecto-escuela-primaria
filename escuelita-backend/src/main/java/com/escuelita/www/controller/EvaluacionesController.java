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

import com.escuelita.www.entity.Evaluaciones;
import com.escuelita.www.entity.EvaluacionesDTO;

import com.escuelita.www.entity.AsignacionDocente;
import com.escuelita.www.entity.Periodos;
import com.escuelita.www.entity.TiposEvaluacion;
import com.escuelita.www.entity.TiposNota;

import com.escuelita.www.repository.AsignacionDocenteRepository;
import com.escuelita.www.repository.PeriodosRepository;
import com.escuelita.www.repository.TiposEvaluacionRepository;
import com.escuelita.www.repository.TiposNotaRepository;

import com.escuelita.www.service.IEvaluacionesService;

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
    public List<Evaluaciones> buscarTodos() {
        return serviceEvaluaciones.buscarTodos();
    }
    @PostMapping("/evaluaciones")
    public ResponseEntity<?> guardar(@RequestBody EvaluacionesDTO dto) {
        Evaluaciones evaluacion = new Evaluaciones();
        evaluacion.setTemaEspecifico(dto.getTemaEspecifico());
        evaluacion.setFechaEvaluacion(dto.getFechaEvaluacion());

        AsignacionDocente asignacion = repoAsignacion
            .findById(dto.getIdAsignacion())
            .orElse(null);
        Periodos periodo = repoPeriodos
            .findById(dto.getIdPeriodo())
            .orElse(null);
        TiposNota tipoNota = repoTiposNota
            .findById(dto.getIdTipoNota())
            .orElse(null);
        TiposEvaluacion tipoEvaluacion = repoTiposEvaluacion
            .findById(dto.getIdTipoEvaluacion())
            .orElse(null);

        evaluacion.setIdAsignacion(asignacion);
        evaluacion.setIdPeriodo(periodo);
        evaluacion.setIdTipoNota(tipoNota);
        evaluacion.setIdTipoEvaluacion(tipoEvaluacion);

        return ResponseEntity.ok(serviceEvaluaciones.guardar(evaluacion));
    }
    @PutMapping("/evaluaciones")
    public ResponseEntity<?> modificar(@RequestBody EvaluacionesDTO dto) {
        if(dto.getIdEvaluacion() == null) {
            return ResponseEntity.badRequest()
                .body("ID de evaluación es requerido");
        }
        Evaluaciones evaluacion = new Evaluaciones();
        evaluacion.setIdEvaluacion(dto.getIdEvaluacion());
        evaluacion.setTemaEspecifico(dto.getTemaEspecifico());
        evaluacion.setFechaEvaluacion(dto.getFechaEvaluacion());

        evaluacion.setIdAsignacion(new AsignacionDocente(dto.getIdAsignacion()));
        evaluacion.setIdPeriodo(new Periodos(dto.getIdPeriodo()));
        evaluacion.setIdTipoNota(new TiposNota(dto.getIdTipoNota()));
        evaluacion.setIdTipoEvaluacion(new TiposEvaluacion(dto.getIdTipoEvaluacion()));

        return ResponseEntity.ok(serviceEvaluaciones.modificar(evaluacion));
    }
    @GetMapping("/evaluaciones/{id}")
    public Optional<Evaluaciones> buscarId(@PathVariable Long id) {
        return serviceEvaluaciones.buscarId(id);
    }
    @DeleteMapping("/evaluaciones/{id}")
    public String eliminar(@PathVariable Long id) {
        serviceEvaluaciones.eliminar(id);
        return "Evaluación eliminada correctamente";
    }
}
