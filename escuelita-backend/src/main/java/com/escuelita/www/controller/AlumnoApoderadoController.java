// Sin tocar - Con excepción por modulos
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

import com.escuelita.www.entity.AlumnoApoderado;
import com.escuelita.www.entity.AlumnoApoderadoDTO;
import com.escuelita.www.entity.Alumnos;
import com.escuelita.www.entity.Apoderados;
import com.escuelita.www.repository.AlumnosRepository;
import com.escuelita.www.repository.ApoderadosRepository;
import com.escuelita.www.service.IAlumnoApoderadoService;
import com.escuelita.www.security.RequireModulo;

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
    @RequireModulo(5)  // 5 = Módulo ALUMNOS
    public List<AlumnoApoderado> buscarTodos() {
        return serviceAlumnoApoderado.buscarTodos(); 
    }
    @PostMapping("/alumnoapoderado")
    @RequireModulo(5)  // 5 = Módulo ALUMNOS
    public ResponseEntity<?> guardar(@RequestBody AlumnoApoderadoDTO dto) {
        AlumnoApoderado alumnoApoderado = new AlumnoApoderado();
        alumnoApoderado.setParentesco(dto.getParentesco());
        alumnoApoderado.setEsRepresentanteFinanciero(dto.getEsRepresentanteFinanciero());
        alumnoApoderado.setViveConEstudiante(dto.getViveConEstudiante());

        Alumnos alumno = repoAlumnos
            .findById(dto.getIdAlumno())
            .orElse(null);
        Apoderados apoderado = repoApoderados
            .findById(dto.getIdApoderado())
            .orElse(null);
        
        alumnoApoderado.setIdAlumno(alumno);
        alumnoApoderado.setIdApoderado(apoderado);

        return ResponseEntity.ok(serviceAlumnoApoderado.guardar(alumnoApoderado));
    }
    @PutMapping("/alumnoapoderado")
    @RequireModulo(5)  // 5 = Módulo ALUMNOS
    public ResponseEntity<?> modificar(@RequestBody AlumnoApoderadoDTO dto) {
        if(dto.getIdAlumnoApoderado() == null){
            return ResponseEntity.badRequest()
                    .body("ID de alumno_apoderado es requerido");
        }
        AlumnoApoderado alumnoApoderado = new AlumnoApoderado();
        alumnoApoderado.setIdAlumnoApoderado(dto.getIdAlumnoApoderado());
        alumnoApoderado.setParentesco(dto.getParentesco());
        alumnoApoderado.setEsRepresentanteFinanciero(dto.getEsRepresentanteFinanciero());
        alumnoApoderado.setViveConEstudiante(dto.getViveConEstudiante());

        Alumnos alumno = repoAlumnos
            .findById(dto.getIdAlumno())
            .orElse(null);
        Apoderados apoderado = repoApoderados
            .findById(dto.getIdApoderado())
            .orElse(null);

        alumnoApoderado.setIdAlumno(alumno);
        alumnoApoderado.setIdApoderado(apoderado);

        return ResponseEntity.ok(serviceAlumnoApoderado.modificar(alumnoApoderado));
    }
    @GetMapping("/alumnoapoderado/{id}")
    @RequireModulo(5)  // 5 = Módulo ALUMNOS
    public Optional<AlumnoApoderado> buscarId(@PathVariable("id") Long id){
        return serviceAlumnoApoderado.buscarId(id);
    }
    @DeleteMapping("/alumnoapoderado/{id}")
    @RequireModulo(5)  // 5 = Módulo ALUMNOS
    public String eliminar(@PathVariable Long id){
        serviceAlumnoApoderado.eliminar(id);
        return "Relación entre Alumno y Apoderado eliminada correctamente";
    }   
}