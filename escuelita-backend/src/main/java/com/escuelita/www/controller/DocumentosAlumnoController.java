package com.escuelita.www.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.escuelita.www.entity.DocumentosAlumno;
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

    @GetMapping("/documentosalumno")
    public List<DocumentosAlumno> buscartodos() {
        return serviceDocumentosAlumno.buscarTodos(); 
    }
    @PostMapping("/documentosalumno")
    public DocumentosAlumno guardar(@RequestBody DocumentosAlumno documentosalumno) {
        serviceDocumentosAlumno.guardar(documentosalumno);
        return documentosalumno;
    }
    @PutMapping("/documentosalumno")
    public DocumentosAlumno modificar(@RequestBody DocumentosAlumno documentosalumno) {
        serviceDocumentosAlumno.modificar(documentosalumno);
        return documentosalumno;
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