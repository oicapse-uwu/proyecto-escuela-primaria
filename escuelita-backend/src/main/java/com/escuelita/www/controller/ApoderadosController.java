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

import com.escuelita.www.entity.Apoderados;
import com.escuelita.www.entity.ApoderadosDTO;
import com.escuelita.www.entity.Sedes;
import com.escuelita.www.entity.TipoDocumentos;

import com.escuelita.www.repository.SedesRepository;
import com.escuelita.www.repository.TipoDocumentosRepository;

import com.escuelita.www.service.IApoderadosService;

@RestController
@RequestMapping("/restful")
public class ApoderadosController {

    @Autowired
    private IApoderadosService serviceApoderados;

    @Autowired
    private TipoDocumentosRepository repoTipoDocumentos;
    @Autowired
    private SedesRepository repoSedes;

    @GetMapping("/apoderados")
    public List<Apoderados> buscarTodos() {
        return serviceApoderados.buscarTodos(); 
    }
    @PostMapping("/apoderados")
    public ResponseEntity<?> guardar(@RequestBody ApoderadosDTO dto) {
        Apoderados apoderado = new Apoderados();
        apoderado.setNombres(dto.getNombres());
        apoderado.setApellidos(dto.getApellidos());
        apoderado.setNumeroDocumento(dto.getNumeroDocumento());
        apoderado.setTelefonoPrincipal(dto.getTelefonoPrincipal());
        apoderado.setCorreo(dto.getCorreo());
        apoderado.setLugarTrabajo(dto.getLugarTrabajo());

        Sedes sede = repoSedes
            .findById(dto.getIdSede())
            .orElse(null);
        TipoDocumentos tipo = repoTipoDocumentos
            .findById(dto.getIdTipoDoc())
            .orElse(null);
        
        apoderado.setIdSede(sede);
        apoderado.setIdTipoDoc(tipo);

        return ResponseEntity.ok(serviceApoderados.guardar(apoderado));
    }
    @PutMapping("/apoderados")
    public ResponseEntity<?> modificar(@RequestBody ApoderadosDTO dto) {
        if(dto.getIdApoderado() == null){
            return ResponseEntity.badRequest()
                    .body("ID de apoderado es requerido");
        }
        Apoderados apoderado = new Apoderados();
        apoderado.setIdApoderado(dto.getIdApoderado());
        apoderado.setNombres(dto.getNombres());
        apoderado.setApellidos(dto.getApellidos());
        apoderado.setNumeroDocumento(dto.getNumeroDocumento());
        apoderado.setTelefonoPrincipal(dto.getTelefonoPrincipal());
        apoderado.setCorreo(dto.getCorreo());
        apoderado.setLugarTrabajo(dto.getLugarTrabajo());

        apoderado.setIdSede(new Sedes(dto.getIdSede()));
        apoderado.setIdTipoDoc(new TipoDocumentos(dto.getIdTipoDoc()));

        return ResponseEntity.ok(serviceApoderados.modificar(apoderado));
    }
    @GetMapping("/apoderados/{id}")
    public Optional<Apoderados> buscarId(@PathVariable("id") Long id){
        return serviceApoderados.buscarId(id);
    }
    @DeleteMapping("/apoderados/{id}")
    public String eliminar(@PathVariable Long id){
        serviceApoderados.eliminar(id);
        return "Apoderado eliminado";
    }   
}