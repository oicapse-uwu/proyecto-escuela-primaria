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
import com.escuelita.www.entity.Asistencias;
import com.escuelita.www.entity.AsistenciasDTO;
import com.escuelita.www.entity.Matriculas;
import com.escuelita.www.repository.AsignacionDocenteRepository;
import com.escuelita.www.repository.MatriculasRepository;
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
    public List<Asistencias> buscarTodos() {
        return serviceAsistencias.buscarTodos();
    }

    @PostMapping("/asistencias")
    public ResponseEntity<?> guardar(@RequestBody AsistenciasDTO dto) {
        Asistencias asistencia = new Asistencias();
        asistencia.setFecha(dto.getFecha());
        asistencia.setEstadoAsistencia(dto.getEstadoAsistencia());
        asistencia.setObservaciones(dto.getObservaciones());

        asistencia.setIdAsignacion(repoAsignacion.findById(dto.getIdAsignacion()).orElse(null));
        asistencia.setIdMatricula(repoMatriculas.findById(dto.getIdMatricula()).orElse(null));

        return ResponseEntity.ok(serviceAsistencias.guardar(asistencia));
    }

    @PutMapping("/asistencias")
    public ResponseEntity<?> modificar(@RequestBody AsistenciasDTO dto) {
        if(dto.getIdAsistencia() == null) return ResponseEntity.badRequest().body("ID requerido");
        
        Asistencias asistencia = new Asistencias();
        asistencia.setIdAsistencia(dto.getIdAsistencia());
        asistencia.setFecha(dto.getFecha());
        asistencia.setEstadoAsistencia(dto.getEstadoAsistencia());
        asistencia.setObservaciones(dto.getObservaciones());

        AsignacionDocente ad = new AsignacionDocente(); ad.setIdAsignacion(dto.getIdAsignacion());
        asistencia.setIdAsignacion(ad);

        Matriculas mat = new Matriculas(); mat.setIdMatricula(dto.getIdMatricula());
        asistencia.setIdMatricula(mat);

        return ResponseEntity.ok(serviceAsistencias.modificar(asistencia));
    }

    @GetMapping("/asistencias/{id}")
    public Optional<Asistencias> buscarId(@PathVariable Long id) { return serviceAsistencias.buscarId(id); }

    @DeleteMapping("/asistencias/{id}")
    public String eliminar(@PathVariable Long id) {
        serviceAsistencias.eliminar(id);
        return "Registro de asistencia eliminado";
    }
}