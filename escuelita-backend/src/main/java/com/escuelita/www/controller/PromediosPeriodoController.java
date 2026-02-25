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
import com.escuelita.www.entity.Matriculas;
import com.escuelita.www.entity.Periodos;
import com.escuelita.www.entity.PromediosPeriodo;
import com.escuelita.www.entity.PromediosPeriodoDTO;
import com.escuelita.www.repository.AsignacionDocenteRepository;
import com.escuelita.www.repository.MatriculasRepository;
import com.escuelita.www.repository.PeriodosRepository;
import com.escuelita.www.service.IPromediosPeriodoService;

@RestController
@RequestMapping("/restful")
public class PromediosPeriodoController {
    @Autowired
    private IPromediosPeriodoService servicePromedios;
    @Autowired
    private AsignacionDocenteRepository repoAsignacion;
    @Autowired
    private MatriculasRepository repoMatriculas;
    @Autowired
    private PeriodosRepository repoPeriodos;

    @GetMapping("/promediosperiodo")
    public List<PromediosPeriodo> buscarTodos() {
        return servicePromedios.buscarTodos();
    }

    @PostMapping("/promediosperiodo")
    public ResponseEntity<?> guardar(@RequestBody PromediosPeriodoDTO dto) {
        PromediosPeriodo promedio = new PromediosPeriodo();
        promedio.setNotaFinalArea(dto.getNotaFinalArea());
        promedio.setComentarioLibreta(dto.getComentarioLibreta());
        promedio.setEstadoCierre(dto.getEstadoCierre());

        promedio.setIdAsignacion(repoAsignacion.findById(dto.getIdAsignacion()).orElse(null));
        promedio.setIdMatricula(repoMatriculas.findById(dto.getIdMatricula()).orElse(null));
        promedio.setIdPeriodo(repoPeriodos.findById(dto.getIdPeriodo()).orElse(null));

        return ResponseEntity.ok(servicePromedios.guardar(promedio));
    }

    @PutMapping("/promediosperiodo")
    public ResponseEntity<?> modificar(@RequestBody PromediosPeriodoDTO dto) {
        if(dto.getIdPromedio() == null) return ResponseEntity.badRequest().body("ID requerido");
        
        PromediosPeriodo promedio = new PromediosPeriodo();
        promedio.setIdPromedio(dto.getIdPromedio());
        promedio.setNotaFinalArea(dto.getNotaFinalArea());
        promedio.setComentarioLibreta(dto.getComentarioLibreta());
        promedio.setEstadoCierre(dto.getEstadoCierre());

        AsignacionDocente asignacion = new AsignacionDocente(); asignacion.setIdAsignacion(dto.getIdAsignacion());
        promedio.setIdAsignacion(asignacion);

        Matriculas matricula = new Matriculas(); matricula.setIdMatricula(dto.getIdMatricula());
        promedio.setIdMatricula(matricula);

        Periodos periodo = new Periodos(); periodo.setIdPeriodo(dto.getIdPeriodo());
        promedio.setIdPeriodo(periodo);

        return ResponseEntity.ok(servicePromedios.modificar(promedio));
    }

    @GetMapping("/promediosperiodo/{id}")
    public Optional<PromediosPeriodo> buscarId(@PathVariable Long id) { return servicePromedios.buscarId(id); }

    @DeleteMapping("/promediosperiodo/{id}")
    public String eliminar(@PathVariable Long id) {
        servicePromedios.eliminar(id);
        return "Promedio de periodo eliminado";
    }
}