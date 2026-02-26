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
    @Override
    public void guardar(RequisitosDocumentos requisitosDocumentos){
        repoRequisitosDocumentos.save(requisitosDocumentos);
    }
    @Override
    public void modificar(RequisitosDocumentos requisitosDocumentos){
        repoRequisitosDocumentos.save(requisitosDocumentos);
    }
    public Optional<RequisitosDocumentos> buscarId(Long id){
        return repoRequisitosDocumentos.findById(id);
    }
    public void eliminar(Long id){
        repoRequisitosDocumentos.deleteById(id);
    }
}