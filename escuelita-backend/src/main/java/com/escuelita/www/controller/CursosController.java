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

import com.escuelita.www.entity.Areas;
import com.escuelita.www.entity.Cursos;
import com.escuelita.www.entity.CursosDTO;
import com.escuelita.www.repository.AreasRepository;
import com.escuelita.www.service.ICursosService;

@RestController
@RequestMapping("/primaria_bd_real")
public class CursosController {

    @Autowired
    private ICursosService serviceCursos;

    @Autowired
    private AreasRepository repoAreas;

    @GetMapping("/cursos")
    public List<Cursos> buscartodos() {
        return serviceCursos.buscarTodos();
    }

    @PostMapping("/cursos")
    public ResponseEntity<?> guardar(@RequestBody CursosDTO dto) {
        Cursos curso = new Cursos();
        curso.setNombreCurso(dto.getNombreCurso());
        if (dto.getEstado() != null)
            curso.setEstado(dto.getEstado());

        Areas area = repoAreas
                .findById(dto.getIdArea())
                .orElse(null);

        curso.setArea(area);

        return ResponseEntity.ok(serviceCursos.guardar(curso));
    }

    @PutMapping("/cursos")
    public ResponseEntity<?> modificar(@RequestBody CursosDTO dto) {
        if (dto.getIdCurso() == null) {
            return ResponseEntity.badRequest()
                    .body("ID de curso es requerido");
        }
        Cursos curso = new Cursos();
        curso.setIdCurso(dto.getIdCurso());
        curso.setNombreCurso(dto.getNombreCurso());
        if (dto.getEstado() != null)
            curso.setEstado(dto.getEstado());

        curso.setArea(new Areas(dto.getIdArea()));

        return ResponseEntity.ok(serviceCursos.modificar(curso));
    }

    @GetMapping("/cursos/{id}")
    public Optional<Cursos> buscarId(@PathVariable("id") Long id) {
        return serviceCursos.buscarId(id);
    }

    @DeleteMapping("/cursos/{id}")
    public String eliminar(@PathVariable Long id) {
        serviceCursos.eliminar(id);
        return "Curso eliminado correctamente";
    }
}