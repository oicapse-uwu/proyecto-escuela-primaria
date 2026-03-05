// No modificado
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
import com.escuelita.www.entity.Secciones;
import com.escuelita.www.entity.SeccionesDTO;
import com.escuelita.www.entity.Sedes;
import com.escuelita.www.repository.GradosRepository;
import com.escuelita.www.repository.SedesRepository;
import com.escuelita.www.service.ISeccionesService;

@RestController
@RequestMapping("/restful")
public class SeccionesController {

    @Autowired
    private ISeccionesService serviceSecciones;
    @Autowired
    private GradosRepository repoGrados;
    @Autowired
    private SedesRepository repoSedes;

    @GetMapping("/secciones")
    public List<Secciones> buscarTodos() {
        return serviceSecciones.buscarTodos(); 
    }
    @PostMapping("/secciones")
    public ResponseEntity<?> guardar(@RequestBody SeccionesDTO dto) {
        Secciones secciones = new Secciones();
        secciones.setNombreSeccion(dto.getNombreSeccion());
        secciones.setVacantes(dto.getVacantes());

        Grados grados = repoGrados
            .findById(dto.getIdGrado())
            .orElse(null);
        Sedes sedes = repoSedes
            .findById(dto.getIdSede())
            .orElse(null);
        
        secciones.setIdGrado(grados);
        secciones.setIdSede(sedes);

        return ResponseEntity.ok(serviceSecciones.guardar(secciones));
    }
    @PutMapping("/secciones")
    public ResponseEntity<?> modificar(@RequestBody SeccionesDTO dto) {
        if(dto.getIdSeccion() == null){
            return ResponseEntity.badRequest()
                    .body("ID de seccion es requerido");
        }
        Secciones secciones = new Secciones();
        secciones.setIdSeccion(dto.getIdSeccion());
        secciones.setNombreSeccion(dto.getNombreSeccion());
        secciones.setVacantes(dto.getVacantes());

        Grados grados = repoGrados
            .findById(dto.getIdGrado())
            .orElse(null);
        Sedes sedes = repoSedes
            .findById(dto.getIdSede())
            .orElse(null);

        secciones.setIdGrado(grados);
        secciones.setIdSede(sedes);

        return ResponseEntity.ok(serviceSecciones.modificar(secciones));
    }
    @GetMapping("/secciones/{id}")
    public Optional<Secciones> buscarId(@PathVariable("id") Long id){
        return serviceSecciones.buscarId(id);
    }
    @DeleteMapping("/secciones/{id}")
    public String eliminar(@PathVariable Long id){
        serviceSecciones.eliminar(id);
        return "Sección eliminada correctamente";
    }   
}