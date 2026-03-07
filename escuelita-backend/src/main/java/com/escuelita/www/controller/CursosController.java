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

import com.escuelita.www.entity.Areas;
import com.escuelita.www.entity.Cursos;
import com.escuelita.www.entity.CursosDTO;
import com.escuelita.www.repository.AreasRepository;
import com.escuelita.www.service.ICursosService;
import com.escuelita.www.security.RequireModulo;

@RestController
@RequestMapping("/restful")
public class CursosController {

    @Autowired
    private ICursosService serviceCursos;
    @Autowired
    private AreasRepository repoAreas;

    @GetMapping("/cursos")
    @RequireModulo(4)  // 4 = Módulo GESTIÓN ACA DÉMICA
    public List<Cursos> buscarTodos() {
        return serviceCursos.buscarTodos();
    }
    @PostMapping("/cursos")
    @RequireModulo(4)  // 4 = Módulo GESTIÓN ACA DÉMICA
    public ResponseEntity<?> guardar(@RequestBody CursosDTO dto) {
        Cursos cursos = new Cursos();
        cursos.setNombreCurso(dto.getNombreCurso());

        Areas areas = repoAreas
                .findById(dto.getIdArea())
                .orElse(null);

        cursos.setIdArea(areas);

        return ResponseEntity.ok(serviceCursos.guardar(cursos));
    }
    @PutMapping("/cursos")
    @RequireModulo(4)  // 4 = Módulo GESTIÓN ACADÉMICA
    public ResponseEntity<?> modificar(@RequestBody CursosDTO dto) {
        if (dto.getIdCurso() == null) {
            return ResponseEntity.badRequest()
                    .body("ID de curso es requerido");
        }
        Cursos cursos = new Cursos();
        cursos.setIdCurso(dto.getIdCurso());
        cursos.setNombreCurso(dto.getNombreCurso());

        Areas areas = repoAreas
            .findById(dto.getIdArea())
            .orElse(null);

        cursos.setIdArea(areas);
        return ResponseEntity.ok(serviceCursos.modificar(cursos));
    }
    @DeleteMapping("/cursos/{id}")
    @RequireModulo(4)  // 4 = Módulo GESTIÓN ACADÉMICA
    public String eliminar(@PathVariable Long id) {
        serviceCursos.eliminar(id);
        return "Curso eliminado correctamente";
    }
}