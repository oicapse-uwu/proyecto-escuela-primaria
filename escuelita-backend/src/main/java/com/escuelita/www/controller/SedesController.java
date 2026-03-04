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

import com.escuelita.www.entity.Institucion;
import com.escuelita.www.entity.Sedes;
import com.escuelita.www.entity.SedesDTO;
import com.escuelita.www.repository.InstitucionRepository;
import com.escuelita.www.service.ISedesService;

@RestController
@RequestMapping("/restful")
public class SedesController {

    @Autowired
    private ISedesService serviceSedes;
    @Autowired
    private InstitucionRepository repoInstitucion;

    @GetMapping("/sedes")
    public List<Sedes> buscarTodos() { 
        return serviceSedes.buscarTodos();
    }
    @PostMapping("/sedes")
    public ResponseEntity<?> guardar(@RequestBody SedesDTO dto) {
        Sedes sedes = new Sedes();
        sedes.setNombreSede(dto.getNombreSede());
        sedes.setCodigoEstablecimiento(dto.getCodigoEstablecimiento());
        sedes.setEsSedePrincipal(dto.getEsSedePrincipal());
        sedes.setDireccion(dto.getDireccion());
        sedes.setDistrito(dto.getDistrito());
        sedes.setProvincia(dto.getProvincia());
        sedes.setDepartamento(dto.getDepartamento());
        sedes.setUgel(dto.getUgel());
        sedes.setTelefono(dto.getTelefono());
        sedes.setCorreoInstitucional(dto.getCorreoInstitucional());
        
        Institucion institucion = repoInstitucion
            .findById(dto.getIdInstitucion())
            .orElse(null);

        sedes.setIdInstitucion(institucion);

        return ResponseEntity.ok(serviceSedes.guardar(sedes));
    }
    @PutMapping("/sedes")
    public ResponseEntity<?> modificar(@RequestBody SedesDTO dto) {
        if(dto.getIdSede() == null){
            return ResponseEntity.badRequest()
                    .body("ID de sede es requerido");
        }
        Sedes sedes = new Sedes();
        sedes.setIdSede(dto.getIdSede());
        sedes.setNombreSede(dto.getNombreSede());
        sedes.setCodigoEstablecimiento(dto.getCodigoEstablecimiento());
        sedes.setEsSedePrincipal(dto.getEsSedePrincipal());
        sedes.setDireccion(dto.getDireccion());
        sedes.setDistrito(dto.getDistrito());
        sedes.setProvincia(dto.getProvincia());
        sedes.setDepartamento(dto.getDepartamento());
        sedes.setUgel(dto.getUgel());
        sedes.setTelefono(dto.getTelefono());
        sedes.setCorreoInstitucional(dto.getCorreoInstitucional());

        Institucion institucion = repoInstitucion
            .findById(dto.getIdInstitucion())
            .orElse(null);

        sedes.setIdInstitucion(institucion);

        return ResponseEntity.ok(serviceSedes.modificar(sedes));
    }
    @GetMapping("/sedes/{id}")
    public Optional<Sedes> buscarId(@PathVariable("id") Long id){ 
        return serviceSedes.buscarId(id); 
    }
    @DeleteMapping("/sedes/{id}")
    public String eliminar(@PathVariable Long id){
        serviceSedes.eliminar(id);
        return "Sede eliminada correctamente";
    }   
}