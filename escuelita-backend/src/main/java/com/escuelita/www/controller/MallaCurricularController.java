package com.escuelita.www.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.escuelita.www.entity.*;
import com.escuelita.www.repository.*;
import com.escuelita.www.service.IMallaCurricularService;

@RestController
@RequestMapping("/primaria_bd_real")
public class MallaCurricularController {

    @Autowired
    private IMallaCurricularService serviceMallaCurricular;
    @Autowired
    private AnioEscolarRepository repoAnio;
    @Autowired
    private GradosRepository repoGrados;
    @Autowired
    private CursosRepository repoCursos;

    @GetMapping("/mallacurricular")
    public List<MallaCurricular> buscartodos() {
        return serviceMallaCurricular.buscarTodos();
    }

    @PostMapping("/mallacurricular")
    public ResponseEntity<?> guardar(@RequestBody MallaCurricularDTO dto) {
        MallaCurricular malla = new MallaCurricular();
        if (dto.getEstado() != null)
            malla.setEstado(dto.getEstado());

        malla.setAnioEscolar(repoAnio.findById(dto.getId_anio()).orElse(null));
        malla.setGrado(repoGrados.findById(dto.getId_grado()).orElse(null));
        malla.setCurso(repoCursos.findById(dto.getId_curso()).orElse(null));

        serviceMallaCurricular.guardar(malla);
        return ResponseEntity.ok(malla);
    }

    @PutMapping("/mallacurricular")
    public ResponseEntity<?> modificar(@RequestBody MallaCurricularDTO dto) {
        if (dto.getId_malla() == null) {
            return ResponseEntity.badRequest().body("ID de malla es requerido");
        }
        MallaCurricular malla = new MallaCurricular();
        malla.setId_malla(dto.getId_malla());
        if (dto.getEstado() != null)
            malla.setEstado(dto.getEstado());

        malla.setAnioEscolar(new AnioEscolar(dto.getId_anio()));
        malla.setGrado(new Grados(dto.getId_grado()));
        malla.setCurso(new Cursos(dto.getId_curso()));

        serviceMallaCurricular.modificar(malla);
        return ResponseEntity.ok(malla);
    }

    @GetMapping("/mallacurricular/{id}")
    public Optional<MallaCurricular> buscarId(@PathVariable("id") Long id) {
        return serviceMallaCurricular.buscarId(id);
    }

    @DeleteMapping("/mallacurricular/{id}")
    public String eliminar(@PathVariable Long id) {
        serviceMallaCurricular.eliminar(id);
        return "Malla curricular eliminada";
    }
}