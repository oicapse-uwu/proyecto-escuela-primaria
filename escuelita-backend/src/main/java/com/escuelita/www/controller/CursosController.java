// Sin tocar
package com.escuelita.www.controller;

import java.util.List;

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
import com.escuelita.www.entity.Sedes;
import com.escuelita.www.repository.AreasRepository;
import com.escuelita.www.repository.SedesRepository;
import com.escuelita.www.security.RequireModulo;
import com.escuelita.www.service.ICursosService;

@RestController
@RequestMapping("/restful")
public class CursosController {

    @Autowired
    private ICursosService serviceCursos;
    @Autowired
    private AreasRepository repoAreas;
    @Autowired
    private SedesRepository repoSedes;

    @GetMapping("/cursos")
    @RequireModulo(4)  // 4 = Módulo GESTIÓN ACADÉMICA
    public List<Cursos> buscarTodos() {
        // El service ya filtra por sede usando TenantContext
        return serviceCursos.buscarTodos();
    }
    
    @PostMapping("/cursos")
    @RequireModulo(4)  // 4 = Módulo GESTIÓN ACADÉMICA
    public ResponseEntity<?> guardar(@RequestBody CursosDTO dto) {
        Cursos cursos = new Cursos();
        cursos.setNombreCurso(dto.getNombreCurso());

        // Asignar el área (global)
        Areas areas = repoAreas
                .findById(dto.getIdArea())
                .orElse(null);
        cursos.setIdArea(areas);

        // Asignar la sede (específica)
        if (dto.getIdSede() != null) {
            Sedes sede = repoSedes
                    .findById(dto.getIdSede())
                    .orElse(null);
            cursos.setIdSede(sede);
        }

        return ResponseEntity.ok(serviceCursos.guardar(cursos));
    }
    
    @PutMapping("/cursos")
    @RequireModulo(4)  // 4 = Módulo GESTIÓN ACADÉMICA
    public ResponseEntity<?> modificar(@RequestBody CursosDTO dto) {
        Cursos cursos = new Cursos();
        cursos.setIdCurso(dto.getIdCurso());
        cursos.setNombreCurso(dto.getNombreCurso());

        // Asignar el área (global)
        Areas areas = repoAreas
            .findById(dto.getIdArea())
            .orElse(null);
        cursos.setIdArea(areas);

        // Asignar la sede (específica)
        if (dto.getIdSede() != null) {
            Sedes sede = repoSedes
                    .findById(dto.getIdSede())
                    .orElse(null);
            cursos.setIdSede(sede);
        }

        return ResponseEntity.ok(serviceCursos.modificar(cursos));
    }
    
    @DeleteMapping("/cursos/{id}")
    @RequireModulo(4)  // 4 = Módulo GESTIÓN ACADÉMICA
    public String eliminar(@PathVariable Long id) {
        serviceCursos.eliminar(id);
        return "Curso eliminado correctamente";
    }
}