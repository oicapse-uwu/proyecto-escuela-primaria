// Revisado
package com.escuelita.www.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.escuelita.www.entity.Alumnos;
import com.escuelita.www.entity.Apoderados;
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
        alumnoapoderado.setEsRepresentanteFinanciero(dto.getEsRepresentanteFinanciero());
        alumnoapoderado.setViveConEstudiante(dto.getViveConEstudiante());

        Alumnos alumno = repoAlumnos
            .findById(dto.getIdAlumno())
            .orElse(null);
        Apoderados apoderado = repoApoderados
            .findById(dto.getIdApoderado())
            .orElse(null);
        
        alumnoapoderado.setIdAlumno(alumno);
        alumnoapoderado.setIdApoderado(apoderado);

        return ResponseEntity.ok(serviceAlumnoApoderado.guardar(alumnoapoderado));
    }
    @PutMapping("/alumnoapoderado")
    public ResponseEntity<?> modificar(@RequestBody AlumnoApoderadoDTO dto) {
        if(dto.getIdAlumnoApoderado() == null){
            return ResponseEntity.badRequest()
                    .body("ID de alumno_apoderado es requerido");
        }
        AlumnoApoderado alumnoapoderado = new AlumnoApoderado();
        alumnoapoderado.setIdAlumnoApoderado(dto.getIdAlumnoApoderado());
        alumnoapoderado.setParentesco(dto.getParentesco());
        alumnoapoderado.setEsRepresentanteFinanciero(dto.getEsRepresentanteFinanciero());
        alumnoapoderado.setViveConEstudiante(dto.getViveConEstudiante());

        // Crear objeto Alumnos con el ID
        Alumnos alumno = new Alumnos();
        alumno.setIdAlumno(dto.getIdAlumno());
        alumnoapoderado.setIdAlumno(alumno);

        // Crear objeto Apoderados con el ID
        Apoderados apoderado = new Apoderados();
        apoderado.setIdApoderado(dto.getIdApoderado());
        alumnoapoderado.setIdApoderado(apoderado);

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