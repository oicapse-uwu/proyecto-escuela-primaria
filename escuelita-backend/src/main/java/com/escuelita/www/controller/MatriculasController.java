// Revisado
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

import com.escuelita.www.entity.Alumnos;
import com.escuelita.www.entity.AnioEscolar;
import com.escuelita.www.entity.Matriculas;
import com.escuelita.www.entity.MatriculasDTO;
import com.escuelita.www.entity.Secciones;
import com.escuelita.www.repository.AlumnosRepository;
import com.escuelita.www.repository.AnioEscolarRepository;
import com.escuelita.www.repository.SeccionesRepository;
import com.escuelita.www.service.IMatriculasService;

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
        Matriculas matriculas = new Matriculas();
        matriculas.setCodigoMatricula(dto.getCodigoMatricula());
        matriculas.setFechaMatricula(dto.getFechaMatricula());
        matriculas.setSituacionAcademicaPrevia(dto.getSituacionAcademicaPrevia());
        matriculas.setEstadoMatricula(dto.getEstadoMatricula());
        matriculas.setObservacionesMatricula(dto.getObservacionesMatricula());
        matriculas.setFechaRetiro(dto.getFechaRetiro());
        matriculas.setMotivoRetiro(dto.getMotivoRetiro());
        matriculas.setColegioDestino(dto.getColegioDestino());

        Alumnos alumnos = repoAlumnos
            .findById(dto.getIdAlumno())
            .orElse(null);
        Secciones secciones = repoSecciones
            .findById(dto.getIdSeccion())
            .orElse(null);
        AnioEscolar anioEscolar = repoAnioEscolar
            .findById(dto.getIdAnio())
            .orElse(null);
        
        matriculas.setIdAlumno(alumnos);
        matriculas.setIdSeccion(secciones);
        matriculas.setIdAnio(anioEscolar);

        return ResponseEntity.ok(serviceMatriculas.guardar(matriculas));
    }
    @PutMapping("/matriculas")
    public ResponseEntity<?> modificar(@RequestBody MatriculasDTO dto) {
        if(dto.getIdMatricula() == null){
            return ResponseEntity.badRequest()
                    .body("ID de matricula es requerido");
        }
        Matriculas matriculas = new Matriculas();
        matriculas.setIdMatricula(dto.getIdMatricula());
        matriculas.setCodigoMatricula(dto.getCodigoMatricula());
        matriculas.setFechaMatricula(dto.getFechaMatricula());
        matriculas.setSituacionAcademicaPrevia(dto.getSituacionAcademicaPrevia());
        matriculas.setEstadoMatricula(dto.getEstadoMatricula());
        matriculas.setObservacionesMatricula(dto.getObservacionesMatricula());
        matriculas.setFechaRetiro(dto.getFechaRetiro());
        matriculas.setMotivoRetiro(dto.getMotivoRetiro());
        matriculas.setColegioDestino(dto.getColegioDestino());

        Alumnos alumnos = repoAlumnos
            .findById(dto.getIdAlumno())
            .orElse(null);
        Secciones secciones = repoSecciones
            .findById(dto.getIdSeccion())
            .orElse(null);
        AnioEscolar anioEscolar = repoAnioEscolar
            .findById(dto.getIdAnio())
            .orElse(null);

        matriculas.setIdAlumno(alumnos);
        matriculas.setIdSeccion(secciones);
        matriculas.setIdAnio(anioEscolar);    
        
        return ResponseEntity.ok(serviceMatriculas.modificar(matriculas));
    }
    @GetMapping("/matriculas/{id}")
    public Optional<Matriculas> buscarId(@PathVariable("id") Long id){
        return serviceMatriculas.buscarId(id);
    }
    @DeleteMapping("/matriculas/{id}")
    public String eliminar(@PathVariable Long id){
        serviceMatriculas.eliminar(id);
        return "Matrícula eliminada correctamente";
    }   
}