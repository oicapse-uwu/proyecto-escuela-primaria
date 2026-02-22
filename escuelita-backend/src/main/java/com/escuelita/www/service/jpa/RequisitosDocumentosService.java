package com.escuelita.www.service.jpa;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.escuelita.www.entity.RequisitosDocumentos;
import com.escuelita.www.repository.RequisitosDocumentosRepository;
import com.escuelita.www.service.IRequisitosDocumentosService;

@Service
public class RequisitosDocumentosService implements IRequisitosDocumentosService{
    @Autowired
    private RequisitosDocumentosRepository repoRequisitosDocumentos;
    
    public List<RequisitosDocumentos> buscarTodos(){
        return repoRequisitosDocumentos.findAll();
    }
    public void guardar(RequisitosDocumentos requisitodocumento){
        repoRequisitosDocumentos.save(requisitodocumento);
    }
    public void modificar(RequisitosDocumentos requisitodocumento){
        repoRequisitosDocumentos.save(requisitodocumento);
    }
    public Optional<RequisitosDocumentos> buscarId(Long id){
        return repoRequisitosDocumentos.findById(id);
    }
    public void eliminar(Long id){
        repoRequisitosDocumentos.deleteById(id);
    }
}