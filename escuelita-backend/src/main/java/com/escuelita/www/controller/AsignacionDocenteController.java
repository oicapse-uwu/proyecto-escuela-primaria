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

import com.escuelita.www.entity.AnioEscolar;
import com.escuelita.www.entity.AsignacionDocente;
import com.escuelita.www.entity.AsignacionDocenteDTO;
import com.escuelita.www.entity.Cursos;
import com.escuelita.www.entity.PerfilDocente;
import com.escuelita.www.entity.Secciones;
import com.escuelita.www.repository.AnioEscolarRepository;
import com.escuelita.www.repository.CursosRepository;
import com.escuelita.www.repository.PerfilDocenteRepository;
import com.escuelita.www.repository.SeccionesRepository;
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

        asignacion.setDocente(repoDocente.findById(dto.getIdDocente()).orElse(null));
        asignacion.setSeccion(repoSecciones.findById(dto.getIdSeccion()).orElse(null));
        asignacion.setCurso(repoCursos.findById(dto.getIdCurso()).orElse(null));
        asignacion.setAnioEscolar(repoAnio.findById(dto.getIdAnio()).orElse(null));

        serviceAsignacionDocente.guardar(asignacion);
        return ResponseEntity.ok(asignacion);
    }

    @PutMapping("/asignaciondocente")
    public ResponseEntity<?> modificar(@RequestBody AsignacionDocenteDTO dto) {
        if (dto.getIdAsignacion() == null) {
            return ResponseEntity.badRequest().body("ID de asignación es requerido");
        }
        AsignacionDocente asignacion = new AsignacionDocente();
        asignacion.setIdAsignacion(dto.getIdAsignacion());
        if (dto.getEstado() != null)
            asignacion.setEstado(dto.getEstado());

        asignacion.setDocente(new PerfilDocente(dto.getIdDocente()));
        asignacion.setSeccion(new Secciones(dto.getIdSeccion()));
        asignacion.setCurso(new Cursos(dto.getIdCurso()));
        asignacion.setAnioEscolar(new AnioEscolar(dto.getIdAnio()));

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