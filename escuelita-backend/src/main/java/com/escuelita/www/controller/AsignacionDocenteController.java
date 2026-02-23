package com.escuelita.www.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.escuelita.www.entity.*;
import com.escuelita.www.repository.*;
import com.escuelita.www.service.IAsignacionDocenteService;

@RestController
@RequestMapping("/primaria_bd_real")
public class AsignacionDocenteController {

    @Autowired
    private IAsignacionDocenteService serviceAsignacionDocente;
    @Autowired
    private PerfilDocenteRepository repoDocente;
    @Autowired
    private SeccionesRepository repoSecciones;
    @Autowired
    private CursosRepository repoCursos;
    @Autowired
    private AnioEscolarRepository repoAnio;

    @GetMapping("/asignaciondocente")
    public List<AsignacionDocente> buscartodos() {
        return serviceAsignacionDocente.buscarTodos();
    }

    @PostMapping("/asignaciondocente")
    public ResponseEntity<?> guardar(@RequestBody AsignacionDocenteDTO dto) {
        AsignacionDocente asignacion = new AsignacionDocente();
        if (dto.getEstado() != null)
            asignacion.setEstado(dto.getEstado());

        asignacion.setDocente(repoDocente.findById(dto.getId_docente()).orElse(null));
        asignacion.setSeccion(repoSecciones.findById(dto.getId_seccion()).orElse(null));
        asignacion.setCurso(repoCursos.findById(dto.getId_curso()).orElse(null));
        asignacion.setAnioEscolar(repoAnio.findById(dto.getId_anio()).orElse(null));

        serviceAsignacionDocente.guardar(asignacion);
        return ResponseEntity.ok(asignacion);
    }

    @PutMapping("/asignaciondocente")
    public ResponseEntity<?> modificar(@RequestBody AsignacionDocenteDTO dto) {
        if (dto.getId_asignacion() == null) {
            return ResponseEntity.badRequest().body("ID de asignación es requerido");
        }
        AsignacionDocente asignacion = new AsignacionDocente();
        asignacion.setId_asignacion(dto.getId_asignacion());
        if (dto.getEstado() != null)
            asignacion.setEstado(dto.getEstado());

        asignacion.setDocente(new PerfilDocente(dto.getId_docente()));
        asignacion.setSeccion(new Secciones(dto.getId_seccion()));
        asignacion.setCurso(new Cursos(dto.getId_curso()));
        asignacion.setAnioEscolar(new AnioEscolar(dto.getId_anio()));

        serviceAsignacionDocente.modificar(asignacion);
        return ResponseEntity.ok(asignacion);
    }

    @GetMapping("/asignaciondocente/{id}")
    public Optional<AsignacionDocente> buscarId(@PathVariable("id") Long id) {
        return serviceAsignacionDocente.buscarId(id);
    }

    @DeleteMapping("/asignaciondocente/{id}")
    public String eliminar(@PathVariable Long id) {
        serviceAsignacionDocente.eliminar(id);
        return "Asignación eliminada";
    }
}