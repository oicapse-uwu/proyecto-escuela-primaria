// Revisado
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
    public List<Matriculas> buscarTodos() {
        return serviceMatriculas.buscarTodos(); 
    }
    @PostMapping("/matriculas")
    public ResponseEntity<?> guardar(@RequestBody MatriculasDTO dto) {
        Matriculas matricula = new Matriculas();
        matricula.setCodigoMatricula(dto.getCodigoMatricula());
        matricula.setFechaMatricula(dto.getFechaMatricula());
        matricula.setSituacionAcademicaPrevia(dto.getSituacionAcademicaPrevia());
        matricula.setEstadoMatricula(dto.getEstadoMatricula());
        matricula.setObservacionesMatricula(dto.getObservacionesMatricula());
        matricula.setFechaRetiro(dto.getFechaRetiro());
        matricula.setMotivoRetiro(dto.getMotivoRetiro());
        matricula.setColegioDestino(dto.getColegioDestino());

        Alumnos alumno = repoAlumnos
            .findById(dto.getIdAlumno())
            .orElse(null);
        Secciones seccion = repoSecciones
            .findById(dto.getIdSeccion())
            .orElse(null);
        AnioEscolar anioEscolar = repoAnioEscolar
            .findById(dto.getIdAnio())
            .orElse(null);
        
        matricula.setIdAlumno(alumno);
        matricula.setIdSeccion(seccion);
        matricula.setIdAnio(anioEscolar);

        return ResponseEntity.ok(serviceMatriculas.guardar(matricula));
    }
    @PutMapping("/matriculas")
    public ResponseEntity<?> modificar(@RequestBody MatriculasDTO dto) {
        if(dto.getIdMatricula() == null){
            return ResponseEntity.badRequest()
                    .body("ID de matricula es requerido");
        }
        Matriculas matricula = new Matriculas();
        matricula.setIdMatricula(dto.getIdMatricula());
        matricula.setCodigoMatricula(dto.getCodigoMatricula());
        matricula.setFechaMatricula(dto.getFechaMatricula());
        matricula.setSituacionAcademicaPrevia(dto.getSituacionAcademicaPrevia());
        matricula.setEstadoMatricula(dto.getEstadoMatricula());
        matricula.setObservacionesMatricula(dto.getObservacionesMatricula());
        matricula.setFechaRetiro(dto.getFechaRetiro());
        matricula.setMotivoRetiro(dto.getMotivoRetiro());
        matricula.setColegioDestino(dto.getColegioDestino());

        matricula.setIdAlumno(new Alumnos(dto.getIdAlumno()));
        matricula.setIdSeccion(new Secciones(dto.getIdSeccion()));
        matricula.setIdAnio(new AnioEscolar(dto.getIdAnio()));    
        
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