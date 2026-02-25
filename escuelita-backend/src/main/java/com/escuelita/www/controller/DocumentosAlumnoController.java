// Revisado
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
    public List<DocumentosAlumno> buscarTodos() {
        return serviceDocumentosAlumno.buscarTodos(); 
    }
    @PostMapping("/documentosalumno")
    public ResponseEntity<?> guardar(@RequestBody DocumentosAlumnoDTO dto) {
        DocumentosAlumno documentosalumno = new DocumentosAlumno();
        documentosalumno.setRutaArchivo(dto.getRutaArchivo());
        documentosalumno.setFechaSubida(dto.getFechaSubida());
        documentosalumno.setEstadoRevision(dto.getEstadoRevision());
        documentosalumno.setObservaciones(dto.getObservaciones());

        Alumnos alumno = repoAlumnos
            .findById(dto.getIdAlumno())
            .orElse(null);
        RequisitosDocumentos requisito = repoRequisitosDocumentos
            .findById(dto.getIdRequisito())
            .orElse(null);
        
        documentosalumno.setIdAlumno(alumno);
        documentosalumno.setIdRequisito(requisito);

        return ResponseEntity.ok(serviceDocumentosAlumno.guardar(documentosalumno));
    }
    @PutMapping("/documentosalumno")
    public ResponseEntity<?> modificar(@RequestBody DocumentosAlumnoDTO dto) {
        if(dto.getIdDocumentoAlumno() == null) {
            return ResponseEntity.badRequest()
            .body("El ID del documento del alumno es requerido.");
        }
        DocumentosAlumno documentoalumno = new DocumentosAlumno();
        documentoalumno.setIdDocumentoAlumno(dto.getIdDocumentoAlumno());
        documentoalumno.setRutaArchivo(dto.getRutaArchivo());
        documentoalumno.setFechaSubida(dto.getFechaSubida());
        documentoalumno.setEstadoRevision(dto.getEstadoRevision());
        documentoalumno.setObservaciones(dto.getObservaciones());

        documentoalumno.setIdAlumno(new Alumnos(dto.getIdAlumno()));
        documentoalumno.setIdRequisito(new RequisitosDocumentos(dto.getIdRequisito()));
        
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