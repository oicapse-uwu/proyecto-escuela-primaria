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
        Apoderados apoderados = new Apoderados();
        apoderados.setNombres(dto.getNombres());
        apoderados.setApellidos(dto.getApellidos());
        apoderados.setNumeroDocumento(dto.getNumeroDocumento());
        apoderados.setTelefonoPrincipal(dto.getTelefonoPrincipal());
        apoderados.setCorreo(dto.getCorreo());
        apoderados.setLugarTrabajo(dto.getLugarTrabajo());

        Sedes sedes = repoSedes
            .findById(dto.getIdSede())
            .orElse(null);
        TipoDocumentos tipoDocumentos = repoTipoDocumentos
            .findById(dto.getIdTipoDoc())
            .orElse(null);
        
        apoderados.setIdSede(sedes);
        apoderados.setIdTipoDoc(tipoDocumentos);

        return ResponseEntity.ok(serviceApoderados.guardar(apoderados));
    }
    @PutMapping("/apoderados")
    public ResponseEntity<?> modificar(@RequestBody ApoderadosDTO dto) {
        if(dto.getIdApoderado() == null){
            return ResponseEntity.badRequest()
                    .body("ID de apoderado es requerido");
        }
        Apoderados apoderados = new Apoderados();
        apoderados.setIdApoderado(dto.getIdApoderado());
        apoderados.setNombres(dto.getNombres());
        apoderados.setApellidos(dto.getApellidos());
        apoderados.setNumeroDocumento(dto.getNumeroDocumento());
        apoderados.setTelefonoPrincipal(dto.getTelefonoPrincipal());
        apoderados.setCorreo(dto.getCorreo());
        apoderados.setLugarTrabajo(dto.getLugarTrabajo());

        Sedes sedes = repoSedes
            .findById(dto.getIdSede())
            .orElse(null);
        TipoDocumentos tipoDocumentos = repoTipoDocumentos
            .findById(dto.getIdTipoDoc())
            .orElse(null);

        apoderados.setIdSede(sedes);
        apoderados.setIdTipoDoc(tipoDocumentos);

        return ResponseEntity.ok(serviceApoderados.modificar(apoderados));
    }
    @GetMapping("/apoderados/{id}")
    public Optional<Apoderados> buscarId(@PathVariable("id") Long id){
        return serviceApoderados.buscarId(id);
    }
    @DeleteMapping("/apoderados/{id}")
    public String eliminar(@PathVariable Long id){
        serviceApoderados.eliminar(id);
        return "Apoderado eliminado correctamente";
    }   
}