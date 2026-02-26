// Revisado
package com.escuelita.www.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.escuelita.www.entity.RequisitosDocumentos;
import com.escuelita.www.service.IRequisitosDocumentosService;

@RestController
@RequestMapping("/restful")
public class RequisitosDocumentosController {
    @Autowired
    private IRequisitosDocumentosService serviceRequisitosDocumentos;

    @GetMapping("/requisitosdocumentos")
    public List<RequisitosDocumentos> buscarTodos() {
        return serviceRequisitosDocumentos.buscarTodos(); 
    }
    @PostMapping("/requisitosdocumentos")
    public RequisitosDocumentos guardar(@RequestBody RequisitosDocumentos requisitosDocumentos) {
        serviceRequisitosDocumentos.guardar(requisitosDocumentos);
        return requisitosDocumentos;
    }
    @PutMapping("/requisitosdocumentos")
    public RequisitosDocumentos modificar(@RequestBody RequisitosDocumentos requisitosDocumentos) {
        serviceRequisitosDocumentos.modificar(requisitosDocumentos);
        return requisitosDocumentos;
    }
    @GetMapping("/requisitosdocumentos/{id}")
    public Optional<RequisitosDocumentos> buscarId(@PathVariable("id") Long id){
        return serviceRequisitosDocumentos.buscarId(id);
    }
    @DeleteMapping("/requisitosdocumentos/{id}")
    public String eliminar(@PathVariable Long id){
        serviceRequisitosDocumentos.eliminar(id);
        return "Requisito del documento perteneciente al Alumno eliminado";
    }
}