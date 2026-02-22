package com.escuelita.www.service.jpa;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.escuelita.www.entity.DocumentosAlumno;
import com.escuelita.www.repository.DocumentosAlumnoRepository;
import com.escuelita.www.service.IDocumentosAlumnoService;

@Service
public class DocumentosAlumnoService implements IDocumentosAlumnoService{
    @Autowired
    private DocumentosAlumnoRepository repoDocumentosAlumno;
    
    public List<DocumentosAlumno> buscarTodos(){
        return repoDocumentosAlumno.findAll();
    }
    public DocumentosAlumno guardar(DocumentosAlumno documentoalumno){
        return repoDocumentosAlumno.save(documentoalumno);
    }
    public DocumentosAlumno modificar(DocumentosAlumno documentoalumno){
        return repoDocumentosAlumno.save(documentoalumno);
    }
    public Optional<DocumentosAlumno> buscarId(Long id){
        return repoDocumentosAlumno.findById(id);
    }
    public void eliminar(Long id){
        repoDocumentosAlumno.deleteById(id);
    }
}