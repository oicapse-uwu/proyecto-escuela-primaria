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

import com.escuelita.www.entity.Grados;
import com.escuelita.www.entity.GradosDTO;
import com.escuelita.www.entity.Sedes;
import com.escuelita.www.repository.SedesRepository;
import com.escuelita.www.service.IGradosService;

@RestController
@RequestMapping("/restful")
public class GradosController {

    @Autowired
    private IGradosService serviceGrados;

    @Autowired
    private SedesRepository repoSedes;

    @GetMapping("/grados")
    public List<Grados> buscarTodos() {
        return serviceGrados.buscarTodos(); 
    }
    @PostMapping("/grados")
    public ResponseEntity<?> guardar(@RequestBody GradosDTO dto) {
        Grados grado = new Grados();
        grado.setNombreGrado(dto.getNombreGrado());

        Sedes sede = repoSedes
            .findById(dto.getIdSede())
            .orElse(null);
        
        grado.setIdSede(sede);

        return ResponseEntity.ok(serviceGrados.guardar(grado));
    }
    @PutMapping("/grados")
    public ResponseEntity<?> modificar(@RequestBody GradosDTO dto) {
        if(dto.getIdGrado() == null){
            return ResponseEntity.badRequest()
                    .body("ID de grado es requerido");
        }
        Grados grado = new Grados();
        grado.setIdGrado(dto.getIdGrado());
        grado.setNombreGrado(dto.getNombreGrado());

        grado.setIdSede(new Sedes(dto.getIdSede()));

        return ResponseEntity.ok(serviceGrados.modificar(grado));
    }
    @GetMapping("/grados/{id}")
    public Optional<Grados> buscarId(@PathVariable("id") Long id){
        return serviceGrados.buscarId(id);
    }
    @DeleteMapping("/grados/{id}")
    public String eliminar(@PathVariable Long id){
        serviceGrados.eliminar(id);
        return "Grado eliminado";
    }   
}