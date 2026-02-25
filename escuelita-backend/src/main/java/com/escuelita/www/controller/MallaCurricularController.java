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
import com.escuelita.www.repository.AnioEscolarRepository;
import com.escuelita.www.repository.CursosRepository;
import com.escuelita.www.repository.GradosRepository;
import com.escuelita.www.service.IMallaCurricularService;

@RestController
@RequestMapping("/restful")
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
    public List<MallaCurricular> buscarTodos() {
        return serviceMallaCurricular.buscarTodos();
    }

    @PostMapping("/mallacurricular")
    public ResponseEntity<?> guardar(@RequestBody MallaCurricularDTO dto) {
        MallaCurricular malla = new MallaCurricular();
        if (dto.getEstado() != null)
            malla.setEstado(dto.getEstado());

        malla.setAnioEscolar(repoAnio.findById(dto.getIdAnio()).orElse(null));
        malla.setGrado(repoGrados.findById(dto.getIdGrado()).orElse(null));
        malla.setCurso(repoCursos.findById(dto.getIdCurso()).orElse(null));

        serviceMallaCurricular.guardar(malla);
        return ResponseEntity.ok(malla);
    }

    @PutMapping("/mallacurricular")
    public ResponseEntity<?> modificar(@RequestBody MallaCurricularDTO dto) {
        if (dto.getIdMalla() == null) {
            return ResponseEntity.badRequest().body("ID de malla es requerido");
        }
        MallaCurricular malla = new MallaCurricular();
        malla.setIdMalla(dto.getIdMalla());
        if (dto.getEstado() != null)
            malla.setEstado(dto.getEstado());

        malla.setAnioEscolar(new AnioEscolar(dto.getIdAnio()));
        malla.setGrado(new Grados(dto.getIdGrado()));
        malla.setCurso(new Cursos(dto.getIdCurso()));

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