package com.escuelita.www.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.escuelita.www.entity.Alumnos;
import com.escuelita.www.entity.AlumnosDTO;
import com.escuelita.www.entity.Apoderados;
import com.escuelita.www.entity.ApoderadosDTO;
import com.escuelita.www.entity.AlumnoApoderado;
import com.escuelita.www.entity.AlumnoApoderadoDTO;

import com.escuelita.www.repository.AlumnosRepository;
import com.escuelita.www.repository.ApoderadosRepository;

import com.escuelita.www.service.IAlumnoApoderadoService;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@RequestMapping("/restful")
public class AlumnoApoderadoController {
    
    @Autowired
    private IAlumnoApoderadoService serviceAlumnoApoderado;

    @Autowired
    private AlumnosRepository repoAlumnos;
    @Autowired
    private ApoderadosRepository repoApoderados;

    @GetMapping("/alumnoapoderado")
    public List<AlumnoApoderado> buscartodos() {
        return serviceAlumnoApoderado.buscarTodos(); 
    }
    @PostMapping("/alumnoapoderado")
    public ResponseEntity<?> guardar(@RequestBody AlumnoApoderadoDTO dto) {
        AlumnoApoderado alumnoapoderado = new AlumnoApoderado();
        alumnoapoderado.setParentesco(dto.getParentesco());
        alumnoapoderado.setEs_representante_financiero(dto.getEs_representante_financiero());
        alumnoapoderado.setVive_con_estudiante(dto.getVive_con_estudiante());

        Alumnos alumno = repoAlumnos
            .findById(dto.getId_alumno())
            .orElse(null);
        Apoderados apoderado = repoApoderados
            .findById(dto.getId_apoderado())
            .orElse(null);
        
        alumnoapoderado.setId_alumno(alumno);
        alumnoapoderado.setId_apoderado(apoderado);

        return ResponseEntity.ok(serviceAlumnoApoderado.guardar(alumnoapoderado));
    }
    @PutMapping("/alumnoapoderado")
    public ResponseEntity<?> modificar(@RequestBody AlumnoApoderadoDTO dto) {
        if(dto.getId_alumno_apod() == null){
            return ResponseEntity.badRequest()
                    .body("ID de alumno_apoderado es requerido");
        }
        AlumnoApoderado alumnoapoderado = new AlumnoApoderado();
        alumnoapoderado.setId_alumno_apod(dto.getId_alumno_apod());
        alumnoapoderado.setParentesco(dto.getParentesco());
        alumnoapoderado.setEs_representante_financiero(dto.getEs_representante_financiero());
        alumnoapoderado.setVive_con_estudiante(dto.getVive_con_estudiante());

        // Crear objeto Alumnos con el ID
        Alumnos alumno = new Alumnos();
        alumno.setId_alumno(dto.getId_alumno());
        alumnoapoderado.setId_alumno(alumno);

        // Crear objeto Apoderados con el ID
        Apoderados apoderado = new Apoderados();
        apoderado.setId_apoderado(dto.getId_apoderado());
        alumnoapoderado.setId_apoderado(apoderado);

        return ResponseEntity.ok(serviceAlumnoApoderado.modificar(alumnoapoderado));
        
    }
    @GetMapping("/alumnoapoderado/{id}")
    public Optional<AlumnoApoderado> buscarId(@PathVariable("id") Long id){
        return serviceAlumnoApoderado.buscarId(id);
    }
    @DeleteMapping("/alumnoapoderado/{id}")
    public String eliminar(@PathVariable Long id){
        serviceAlumnoApoderado.eliminar(id);
        return "Relacion entre Alumno y Apoderado eliminado";
    }   
}