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

import com.escuelita.www.entity.AnioEscolar;
import com.escuelita.www.entity.Cursos;
import com.escuelita.www.entity.Grados;
import com.escuelita.www.entity.MallaCurricular;
import com.escuelita.www.entity.MallaCurricularDTO;
import com.escuelita.www.entity.Sedes;
import com.escuelita.www.repository.AnioEscolarRepository;
import com.escuelita.www.repository.CursosRepository;
import com.escuelita.www.repository.GradosRepository;
import com.escuelita.www.repository.SedesRepository;
import com.escuelita.www.security.RequireModulo;
import com.escuelita.www.service.IMallaCurricularService;
import com.escuelita.www.util.TenantContext;

@RestController
@RequestMapping("/restful")
public class MallaCurricularController {

    @Autowired
    private IMallaCurricularService serviceMallaCurricular;
    @Autowired
    private AnioEscolarRepository repoAnioEscolar;
    @Autowired
    private GradosRepository repoGrados;
    @Autowired
    private CursosRepository repoCursos;
    @Autowired
    private SedesRepository repoSedes;

    @GetMapping("/mallacurricular")
    @RequireModulo(4)  // 4 = Módulo GESTIÓN ACADÉMICA
    public List<MallaCurricular> buscarTodos() {
        // El service ya filtra por sede usando TenantContext
        return serviceMallaCurricular.buscarTodos();
    }
    
    @PostMapping("/mallacurricular")
    @RequireModulo(4)  // 4 = Módulo GESTIÓN ACADÉMICA
    public ResponseEntity<?> guardar(@RequestBody MallaCurricularDTO dto) {
        MallaCurricular mallaCurricular = new MallaCurricular();

        // Asignar la sede automáticamente desde TenantContext
        Long sedeId = TenantContext.getSedeId();
        if (sedeId != null) {
            Sedes sede = repoSedes.findById(sedeId).orElse(null);
            mallaCurricular.setIdSede(sede);
        }

        AnioEscolar anioEscolar = repoAnioEscolar
            .findById(dto.getIdAnioEscolar())
            .orElse(null);
        Grados grados = repoGrados
            .findById(dto.getIdGrado())
            .orElse(null);
        Cursos cursos = repoCursos
            .findById(dto.getIdCurso())
            .orElse(null);

        mallaCurricular.setIdAnioEscolar(anioEscolar);
        mallaCurricular.setIdGrado(grados);
        mallaCurricular.setIdCurso(cursos);

        return ResponseEntity.ok(serviceMallaCurricular.guardar(mallaCurricular));
    }
    
    @PutMapping("/mallacurricular")
    @RequireModulo(4)  // 4 = Módulo GESTIÓN ACADÉMICA
    public ResponseEntity<?> modificar(@RequestBody MallaCurricularDTO dto) {
        if (dto.getIdMalla() == null) {
            return ResponseEntity.badRequest()
                    .body("ID de malla es requerido");
        }
        MallaCurricular mallaCurricular = new MallaCurricular();
        mallaCurricular.setIdMalla(dto.getIdMalla());

        // Asignar la sede automáticamente desde TenantContext
        Long sedeId = TenantContext.getSedeId();
        if (sedeId != null) {
            Sedes sede = repoSedes.findById(sedeId).orElse(null);
            mallaCurricular.setIdSede(sede);
        }

        AnioEscolar anioEscolar = repoAnioEscolar
            .findById(dto.getIdAnioEscolar())
            .orElse(null);
        Grados grados = repoGrados
            .findById(dto.getIdGrado())
            .orElse(null);
        Cursos cursos = repoCursos
            .findById(dto.getIdCurso())
            .orElse(null);

        mallaCurricular.setIdAnioEscolar(anioEscolar);
        mallaCurricular.setIdGrado(grados);
        mallaCurricular.setIdCurso(cursos);

        return ResponseEntity.ok(serviceMallaCurricular.modificar(mallaCurricular));
    }
    
    @GetMapping("/mallacurricular/{id}")
    @RequireModulo(4)  // 4 = Módulo GESTIÓN ACADÉMICA
    public Optional<MallaCurricular> buscarId(@PathVariable("id") Long id) {
        return serviceMallaCurricular.buscarId(id);
    }
    
    @DeleteMapping("/mallacurricular/{id}")
    @RequireModulo(4)  // 4 = Módulo GESTIÓN ACADÉMICA
    public String eliminar(@PathVariable Long id){
        serviceMallaCurricular.eliminar(id);
        return "Malla curricular eliminada correctamente";
    }
}