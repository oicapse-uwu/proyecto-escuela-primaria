// No modificado
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
        PromediosPeriodo promediosPeriodo = new PromediosPeriodo();
        promediosPeriodo.setNotaFinalArea(dto.getNotaFinalArea());
        promediosPeriodo.setComentarioLibreta(dto.getComentarioLibreta());
        promediosPeriodo.setEstadoCierre(dto.getEstadoCierre());

        AsignacionDocente asignacionDocente = repoAsignacion
            .findById(dto.getIdAsignacion())
            .orElse(null);
        Matriculas matriculas = repoMatriculas
            .findById(dto.getIdMatricula())
            .orElse(null);
        Periodos periodos = repoPeriodos
            .findById(dto.getIdPeriodo())
            .orElse(null);

        promediosPeriodo.setIdAsignacion(asignacionDocente);
        promediosPeriodo.setIdMatricula(matriculas);
        promediosPeriodo.setIdPeriodo(periodos);

        return ResponseEntity.ok(servicePromedios.guardar(promediosPeriodo));
    }
    @PutMapping("/promediosperiodo")
    public ResponseEntity<?> modificar(@RequestBody PromediosPeriodoDTO dto) {
        if(dto.getIdPromedio() == null) {
            return ResponseEntity.badRequest()
                    .body("ID requerido");
        }
        PromediosPeriodo promediosPeriodo = new PromediosPeriodo();
        promediosPeriodo.setIdPromedio(dto.getIdPromedio());
        promediosPeriodo.setNotaFinalArea(dto.getNotaFinalArea());
        promediosPeriodo.setComentarioLibreta(dto.getComentarioLibreta());
        promediosPeriodo.setEstadoCierre(dto.getEstadoCierre());

        AsignacionDocente asignacionDocente = repoAsignacion
            .findById(dto.getIdAsignacion())
            .orElse(null);
        Matriculas matriculas = repoMatriculas
            .findById(dto.getIdMatricula())
            .orElse(null);
        Periodos periodos = repoPeriodos
            .findById(dto.getIdPeriodo())
            .orElse(null);

        promediosPeriodo.setIdAsignacion(asignacionDocente);
        promediosPeriodo.setIdMatricula(matriculas);
        promediosPeriodo.setIdPeriodo(periodos);

        return ResponseEntity.ok(servicePromedios.modificar(promediosPeriodo));
    }
    @GetMapping("/promediosperiodo/{id}")
    public Optional<PromediosPeriodo> buscarId(@PathVariable("id") Long id) { 
        return servicePromedios.buscarId(id); 
    }
    @DeleteMapping("/promediosperiodo/{id}")
    public String eliminar(@PathVariable Long id) {
        servicePromedios.eliminar(id);
        return "Promedio de periodo eliminado correctamente";
    }
}