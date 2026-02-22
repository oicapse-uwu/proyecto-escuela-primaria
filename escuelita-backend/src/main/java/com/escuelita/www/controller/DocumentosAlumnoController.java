package com.escuelita.www.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.escuelita.www.entity.Alumnos;
import com.escuelita.www.entity.DocumentosAlumno;
import com.escuelita.www.entity.DocumentosAlumnoDTO;
import com.escuelita.www.entity.RequisitosDocumentos;

import com.escuelita.www.repository.AlumnosRepository;
import com.escuelita.www.repository.RequisitosDocumentosRepository;

import com.escuelita.www.service.IDocumentosAlumnoService;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@RequestMapping("/restful")
public class DocumentosAlumnoController {
    
    @Autowired
    private IDocumentosAlumnoService serviceDocumentosAlumno;

    @Autowired
    private AlumnosRepository repoAlumnos;
    @Autowired
    private RequisitosDocumentosRepository repoRequisitosDocumentos;

    @GetMapping("/documentosalumno")
    public List<DocumentosAlumno> buscartodos() {
        return serviceDocumentosAlumno.buscarTodos(); 
    }
    @PostMapping("/documentosalumno")
    public ResponseEntity<?> guardar(@RequestBody DocumentosAlumnoDTO dto) {
        DocumentosAlumno documentosalumno = new DocumentosAlumno();
        documentosalumno.setRuta_archivo(dto.getRuta_archivo());
        documentosalumno.setFecha_subida(dto.getFecha_subida());
        documentosalumno.setEstado_revision(dto.getEstado_revision());
        documentosalumno.setObservaciones(dto.getObservaciones());

        Alumnos alumno = repoAlumnos
            .findById(dto.getId_alumno())
            .orElse(null);
        RequisitosDocumentos requisito = repoRequisitosDocumentos
            .findById(dto.getId_requisito())
            .orElse(null);
        
        documentosalumno.setId_alumno(alumno);
        documentosalumno.setId_requisito(requisito);

        return ResponseEntity.ok(serviceDocumentosAlumno.guardar(documentosalumno));
    }
    @PutMapping("/documentosalumno")
    public ResponseEntity<?> modificar(@RequestBody DocumentosAlumnoDTO dto) {
        if(dto.getId_doc_alumno() == null) {
            return ResponseEntity.badRequest()
            .body("El ID del documento del alumno es requerido.");
        }
        DocumentosAlumno documentoalumno = new DocumentosAlumno();
        documentoalumno.setId_doc_alumno(dto.getId_doc_alumno());
        documentoalumno.setRuta_archivo(dto.getRuta_archivo());
        documentoalumno.setFecha_subida(dto.getFecha_subida());
        documentoalumno.setEstado_revision(dto.getEstado_revision());
        documentoalumno.setObservaciones(dto.getObservaciones());

        documentoalumno.setId_alumno(new Alumnos(dto.getId_alumno()));
        documentoalumno.setId_requisito(new RequisitosDocumentos(dto.getId_requisito()));
        
        return ResponseEntity.ok(serviceDocumentosAlumno.modificar(documentoalumno));
    }
    @GetMapping("/documentosalumno/{id}")
    public Optional<DocumentosAlumno> buscarId(@PathVariable("id") Long id){
        return serviceDocumentosAlumno.buscarId(id);
    }
    @DeleteMapping("/documentosalumno/{id}")
    public String eliminar(@PathVariable Long id){
        serviceDocumentosAlumno.eliminar(id);
        return "Documento del Alumno eliminado";
    }   
}