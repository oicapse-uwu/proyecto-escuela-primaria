package com.escuelita.www.service;

import java.util.List;
import java.util.Optional;

import com.escuelita.www.entity.DocumentosAlumno;

public interface IDocumentosAlumnoService {
    List<DocumentosAlumno> buscarTodos();
    DocumentosAlumno guardar(DocumentosAlumno documentosalumno);
    DocumentosAlumno modificar(DocumentosAlumno documentosalumno);
    Optional<DocumentosAlumno> buscarId(Long id);
    void eliminar(Long id); 
}