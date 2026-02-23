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
    public List<PromediosPeriodo> buscartodos() {
        return servicePromedios.buscarTodos();
    }

    @PostMapping("/promediosperiodo")
    public ResponseEntity<?> guardar(@RequestBody PromediosPeriodoDTO dto) {
        PromediosPeriodo prom = new PromediosPeriodo();
        prom.setNotaFinalArea(dto.getNotaFinalArea());
        prom.setComentarioLibreta(dto.getComentarioLibreta());
        prom.setEstadoCierre(dto.getEstadoCierre());

        prom.setIdAsignacion(repoAsignacion.findById(dto.getIdAsignacion()).orElse(null));
        prom.setIdMatricula(repoMatriculas.findById(dto.getIdMatricula()).orElse(null));
        prom.setIdPeriodo(repoPeriodos.findById(dto.getIdPeriodo()).orElse(null));

        return ResponseEntity.ok(servicePromedios.guardar(prom));
    }

    @PutMapping("/promediosperiodo")
    public ResponseEntity<?> modificar(@RequestBody PromediosPeriodoDTO dto) {
        if(dto.getIdPromedio() == null) return ResponseEntity.badRequest().body("ID requerido");
        
        PromediosPeriodo prom = new PromediosPeriodo();
        prom.setIdPromedio(dto.getIdPromedio());
        prom.setNotaFinalArea(dto.getNotaFinalArea());
        prom.setComentarioLibreta(dto.getComentarioLibreta());
        prom.setEstadoCierre(dto.getEstadoCierre());

        AsignacionDocente ad = new AsignacionDocente(); ad.setIdAsignacion(dto.getIdAsignacion());
        prom.setIdAsignacion(ad);

        Matriculas mat = new Matriculas(); mat.setIdMatricula(dto.getIdMatricula());
        prom.setIdMatricula(mat);

        Periodos per = new Periodos(); per.setIdPeriodo(dto.getIdPeriodo());
        prom.setIdPeriodo(per);

        return ResponseEntity.ok(servicePromedios.modificar(prom));
    }

    @GetMapping("/promediosperiodo/{id}")
    public Optional<PromediosPeriodo> buscarId(@PathVariable Long id) { return servicePromedios.buscarId(id); }

    @DeleteMapping("/promediosperiodo/{id}")
    public String eliminar(@PathVariable Long id) {
        servicePromedios.eliminar(id);
        return "Promedio de periodo eliminado";
    }
}