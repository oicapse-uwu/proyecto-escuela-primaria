// Sin tocar
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
import com.escuelita.www.entity.DocumentosAlumno;
import com.escuelita.www.entity.DocumentosAlumnoDTO;
import com.escuelita.www.entity.RequisitosDocumentos;
import com.escuelita.www.repository.AlumnosRepository;
import com.escuelita.www.repository.RequisitosDocumentosRepository;
import com.escuelita.www.service.IDocumentosAlumnoService;
import com.escuelita.www.security.RequireModulo;

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
    @RequireModulo(6)  // 6 = Módulo MATRÍCULAS
    public List<DocumentosAlumno> buscarTodos() {
        return serviceDocumentosAlumno.buscarTodos(); 
    }
    @PostMapping("/documentosalumno")
    @RequireModulo(6)  // 6 = Módulo MATRÍCULAS
    public ResponseEntity<?> guardar(@RequestBody DocumentosAlumnoDTO dto) {
        DocumentosAlumno documentosAlumno = new DocumentosAlumno();
        documentosAlumno.setRutaArchivo(dto.getRutaArchivo());
        documentosAlumno.setFechaSubida(dto.getFechaSubida());
        documentosAlumno.setEstadoRevision(dto.getEstadoRevision());
        documentosAlumno.setObservaciones(dto.getObservaciones());

        Alumnos alumno = repoAlumnos
            .findById(dto.getIdAlumno())
            .orElse(null);
        RequisitosDocumentos requisito = repoRequisitosDocumentos
            .findById(dto.getIdRequisito())
            .orElse(null);
        
        documentosAlumno.setIdAlumno(alumno);
        documentosAlumno.setIdRequisito(requisito);

        return ResponseEntity.ok(serviceDocumentosAlumno.guardar(documentosAlumno));
    }
    @PutMapping("/documentosalumno")
    @RequireModulo(6)  // 6 = Módulo MATRÍCULAS
    public ResponseEntity<?> modificar(@RequestBody DocumentosAlumnoDTO dto) {
        if(dto.getIdDocumentoAlumno() == null) {
            return ResponseEntity.badRequest()
            .body("El ID del documento del alumno es requerido.");
        }
        DocumentosAlumno documentosAlumno = new DocumentosAlumno();
        documentosAlumno.setIdDocumentoAlumno(dto.getIdDocumentoAlumno());
        documentosAlumno.setRutaArchivo(dto.getRutaArchivo());
        documentosAlumno.setFechaSubida(dto.getFechaSubida());
        documentosAlumno.setEstadoRevision(dto.getEstadoRevision());
        documentosAlumno.setObservaciones(dto.getObservaciones());

        Alumnos alumno = repoAlumnos
            .findById(dto.getIdAlumno())
            .orElse(null);
        RequisitosDocumentos requisito = repoRequisitosDocumentos
            .findById(dto.getIdRequisito())
            .orElse(null);

        documentosAlumno.setIdAlumno(alumno);
        documentosAlumno.setIdRequisito(requisito);
        
        return ResponseEntity.ok(serviceDocumentosAlumno.modificar(documentosAlumno));
    }
    @GetMapping("/documentosalumno/{id}")
    @RequireModulo(6)  // 6 = Módulo MATRÍCULAS
    public Optional<DocumentosAlumno> buscarId(@PathVariable("id") Long id){
        return serviceDocumentosAlumno.buscarId(id);
    }
    @DeleteMapping("/documentosalumno/{id}")
    @RequireModulo(6)  // 6 = Módulo MATRÍCULAS
    public String eliminar(@PathVariable Long id){
        serviceDocumentosAlumno.eliminar(id);
        return "Documento del Alumno eliminado correctamente";
    }   
}