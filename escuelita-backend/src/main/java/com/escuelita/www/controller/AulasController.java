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

import com.escuelita.www.entity.Aulas;
import com.escuelita.www.entity.AulasDTO;
import com.escuelita.www.entity.Sedes;
import com.escuelita.www.repository.SedesRepository;
import com.escuelita.www.service.IAulasService;

@RestController
@RequestMapping("/restful")
public class AulasController {

    @Autowired
    private IAulasService serviceAulas;

    @Autowired
    private SedesRepository repoSedes;

    @GetMapping("/aulas")
    public List<Aulas> buscarTodos() {
        return serviceAulas.buscarTodos(); 
    }
    @PostMapping("/aulas")
    public ResponseEntity<?> guardar(@RequestBody AulasDTO dto) {
        Aulas aula = new Aulas();
        aula.setNombreAula(dto.getNombreAula());
        aula.setCapacidad(dto.getCapacidad());

        Sedes sede = repoSedes
            .findById(dto.getIdSede())
            .orElse(null);
        
        aula.setIdSede(sede);

        return ResponseEntity.ok(serviceAulas.guardar(aula));
    }
    @PutMapping("/aulas")
    public ResponseEntity<?> modificar(@RequestBody AulasDTO dto) {
        if(dto.getIdAula() == null){
            return ResponseEntity.badRequest()
                    .body("ID de aula es requerido");
        }
        Aulas aula = new Aulas();
        aula.setIdAula(dto.getIdAula());
        aula.setNombreAula(dto.getNombreAula());
        aula.setCapacidad(dto.getCapacidad());

        aula.setIdSede(new Sedes(dto.getIdSede()));

        return ResponseEntity.ok(serviceAulas.modificar(aula));
    }
    @GetMapping("/aulas/{id}")
    public Optional<Aulas> buscarId(@PathVariable("id") Long id){
        return serviceAulas.buscarId(id);
    }
    @DeleteMapping("/aulas/{id}")
    public String eliminar(@PathVariable Long id){
        serviceAulas.eliminar(id);
        return "Aula eliminada";
    }   
}