package com.escuelita.www.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.escuelita.www.entity.Matriculas;
import com.escuelita.www.entity.MatriculasDTO;
import com.escuelita.www.entity.Alumnos;
import com.escuelita.www.entity.AlumnosDTO;
import com.escuelita.www.entity.Secciones;
import com.escuelita.www.entity.AnioEscolar;

import com.escuelita.www.repository.AlumnosRepository;
import com.escuelita.www.repository.SeccionesRepository;
import com.escuelita.www.repository.AnioEscolarRepository;

import com.escuelita.www.service.IMatriculasService;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@RequestMapping("/restful")
public class MatriculasController {

    @Autowired
    private IMatriculasService serviceMatriculas;

    @Autowired
    private AlumnosRepository repoAlumnos;
    @Autowired
    private SeccionesRepository repoSecciones;
    @Autowired
    private AnioEscolarRepository repoAnioEscolar;

    @GetMapping("/matriculas")
    public List<Matriculas> buscartodos() {
        return serviceMatriculas.buscarTodos(); 
    }
    @PostMapping("/matriculas")
    public ResponseEntity<?> guardar(@RequestBody MatriculasDTO dto) {
        Matriculas matricula = new Matriculas();
        matricula.setCodigo_matricula(dto.getCodigo_matricula());
        matricula.setFecha_matricula(dto.getFecha_matricula());
        matricula.setSituacion_academica_previa(dto.getSituacion_academica_previa());
        matricula.setEstado_matricula(dto.getEstado_matricula());
        matricula.setObservaciones_matricula(dto.getObservaciones_matricula());
        matricula.setFecha_retiro(dto.getFecha_retiro());
        matricula.setMotivo_retiro(dto.getMotivo_retiro());
        matricula.setColegio_destino(dto.getColegio_destino());

        Alumnos alumno = repoAlumnos
            .findById(dto.getId_alumno())
            .orElse(null);
        Secciones seccion = repoSecciones
            .findById(dto.getId_seccion())
            .orElse(null);
        AnioEscolar anioEscolar = repoAnioEscolar
            .findById(dto.getId_anio())
            .orElse(null);
        
        matricula.setId_alumno(alumno);
        matricula.setId_seccion(seccion);
        matricula.setId_anio(anioEscolar);

        return ResponseEntity.ok(serviceMatriculas.guardar(matricula));
    }
    @PutMapping("/matriculas")
    public ResponseEntity<?> modificar(@RequestBody MatriculasDTO dto) {
        if(dto.getId_matricula() == null){
            return ResponseEntity.badRequest()
                    .body("ID de matricula es requerido");
        }
        Matriculas matricula = new Matriculas();
        matricula.setId_matricula(dto.getId_matricula());
        matricula.setCodigo_matricula(dto.getCodigo_matricula());
        matricula.setFecha_matricula(dto.getFecha_matricula());
        matricula.setSituacion_academica_previa(dto.getSituacion_academica_previa());
        matricula.setEstado_matricula(dto.getEstado_matricula());
        matricula.setObservaciones_matricula(dto.getObservaciones_matricula());
        matricula.setFecha_retiro(dto.getFecha_retiro());
        matricula.setMotivo_retiro(dto.getMotivo_retiro());
        matricula.setColegio_destino(dto.getColegio_destino());

        matricula.setId_alumno(new Alumnos(dto.getId_alumno()));
        matricula.setId_seccion(new Secciones(dto.getId_seccion()));
        matricula.setId_anio(new AnioEscolar(dto.getId_anio()));    
        
        return ResponseEntity.ok(serviceMatriculas.modificar(matricula));
    }
    @GetMapping("/matriculas/{id}")
    public Optional<Matriculas> buscarId(@PathVariable("id") Long id){
        return serviceMatriculas.buscarId(id);
    }
    @DeleteMapping("/matriculas/{id}")
    public String eliminar(@PathVariable Long id){
        serviceMatriculas.eliminar(id);
        return "Matricula eliminada";
    }   
}