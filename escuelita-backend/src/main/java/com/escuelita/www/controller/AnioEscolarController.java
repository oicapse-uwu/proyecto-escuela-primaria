// Revisado
package com.escuelita.www.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.escuelita.www.entity.AnioEscolar;
import com.escuelita.www.entity.AnioEscolarDTO;
import com.escuelita.www.entity.Sedes;

import com.escuelita.www.repository.SedesRepository;

import com.escuelita.www.service.IAnioEscolarService;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/restful")
public class AnioEscolarController {

    @Autowired
    private IAnioEscolarService serviceAnioEscolar;

    @Autowired
    private SedesRepository repoSedes;

    @GetMapping("/anioescolar")
    public List<AnioEscolar> buscarTodos() {
        return serviceAnioEscolar.buscarTodos(); 
    }

    @PostMapping("/anioescolar")
    public ResponseEntity<?> guardar(@RequestBody AnioEscolarDTO dto) {
        AnioEscolar anioescolar = new AnioEscolar();
        anioescolar.setNombreAnio(dto.getNombreAnio());
        anioescolar.setActivo(dto.getActivo());

        Sedes sede = repoSedes
            .findById(dto.getIdSede())
            .orElse(null);
        
        anioescolar.setIdSede(sede);

        return ResponseEntity.ok(serviceAnioEscolar.guardar(anioescolar));
    }

    @PutMapping("/anioescolar")
    public ResponseEntity<?> modificar(@RequestBody AnioEscolarDTO dto) {
        if(dto.getIdAnioEscolar() == null){
            return ResponseEntity.badRequest()
            .body("ID de año escolar es requerido");
        }
        AnioEscolar anioescolar = new AnioEscolar();
        anioescolar.setIdAnioEscolar(dto.getIdAnioEscolar());
        anioescolar.setNombreAnio(dto.getNombreAnio());
        anioescolar.setActivo(dto.getActivo());

        anioescolar.setIdSede(new Sedes(dto.getIdSede()));

        return ResponseEntity.ok(serviceAnioEscolar.modificar(anioescolar));
    }

    @GetMapping("/anioescolar/{id}")
    public Optional<AnioEscolar> buscarId(@PathVariable("id") Long id){ 
        return serviceAnioEscolar.buscarId(id);
    }
    @DeleteMapping("/anioescolar/{id}")
    public String eliminar(@PathVariable Long id){
        serviceAnioEscolar.eliminar(id);
        return "Año escolar eliminado";
    }   
}