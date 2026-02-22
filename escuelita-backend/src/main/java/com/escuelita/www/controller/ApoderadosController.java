package com.escuelita.www.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.escuelita.www.entity.Alumnos;
import com.escuelita.www.entity.AlumnosDTO;
import com.escuelita.www.entity.Apoderados;
import com.escuelita.www.entity.ApoderadosDTO;
import com.escuelita.www.entity.Sedes;
import com.escuelita.www.entity.TiposDocumento;

import com.escuelita.www.repository.SedesRepository;
import com.escuelita.www.repository.TiposDocumentoRepository;

import com.escuelita.www.service.IApoderadosService;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@RequestMapping("/restful")
public class ApoderadosController {

    @Autowired
    private IApoderadosService serviceApoderados;

    @Autowired
    private TiposDocumentoRepository repoTiposDocumento;
    @Autowired
    private SedesRepository repoSedes;

    @GetMapping("/apoderados")
    public List<Apoderados> buscartodos() {
        return serviceApoderados.buscarTodos(); 
    }
    @PostMapping("/apoderados")
    public ResponseEntity<?> guardar(@RequestBody ApoderadosDTO dto) {
        Apoderados apoderado = new Apoderados();
        apoderado.setNombres(dto.getNombres());
        apoderado.setApellidos(dto.getApellidos());
        apoderado.setNumero_documento(dto.getNumero_documento());
        apoderado.setTelefono_principal(dto.getTelefono_principal());
        apoderado.setCorreo(dto.getCorreo());
        apoderado.setLugar_trabajo(dto.getLugar_trabajo());

        Sedes sede = repoSedes
            .findById(dto.getId_sede())
            .orElse(null);
        TiposDocumentos tipo = repoTiposDocumento
            .findById(dto.getId_tipo_doc())
            .orElse(null);
        
        apoderado.setId_sede(sede);
        apoderado.setId_tipo_doc(tipo);

        return ResponseEntity.ok(serviceApoderados.guardar(apoderado));
    }
    @PutMapping("/apoderados")
    public ResponseEntity<?> modificar(@RequestBody ApoderadosDTO dto) {
        if(dto.getId_apoderado() == null){
            return ResponseEntity.badRequest()
                    .body("ID de apoderado es requerido");
        }
        Apoderados apoderado = new Apoderados();
        apoderado.setId_apoderado(dto.getId_apoderado());
        apoderado.setNombres(dto.getNombres());
        apoderado.setApellidos(dto.getApellidos());
        apoderado.setNumero_documento(dto.getNumero_documento());
        apoderado.setTelefono_principal(dto.getTelefono_principal());
        apoderado.setCorreo(dto.getCorreo());
        apoderado.setLugar_trabajo(dto.getLugar_trabajo());

        apoderado.setId_sede(new Sede(dto.getId_sede()));
        apoderado.setId_tipo_doc(new TiposDocumento(dto.getId_tipo_doc()));

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