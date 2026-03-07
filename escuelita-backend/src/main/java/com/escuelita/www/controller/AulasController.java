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

import com.escuelita.www.entity.Aulas;
import com.escuelita.www.entity.AulasDTO;
import com.escuelita.www.entity.Sedes;
import com.escuelita.www.repository.SedesRepository;
import com.escuelita.www.service.IAulasService;
import com.escuelita.www.security.RequireModulo;

@RestController
@RequestMapping("/restful")
public class AulasController {

    @Autowired
    private IAulasService serviceAulas;
    @Autowired
    private SedesRepository repoSedes;

    @GetMapping("/aulas")
    @RequireModulo(3)  // 3 = Módulo INFRAESTRUCTURA
    public List<Aulas> buscarTodos() {
        return serviceAulas.buscarTodos(); 
    }
    @PostMapping("/aulas")
    @RequireModulo(3)  // 3 = Módulo INFRAESTRUCTURA
    public ResponseEntity<?> guardar(@RequestBody AulasDTO dto) {
        Aulas aulas = new Aulas();
        aulas.setNombreAula(dto.getNombreAula());
        aulas.setCapacidad(dto.getCapacidad());

        Sedes sedes = repoSedes
            .findById(dto.getIdSede())
            .orElse(null);
        
        aulas.setIdSede(sedes);

        return ResponseEntity.ok(serviceAulas.guardar(aulas));
    }
    @PutMapping("/aulas")
    @RequireModulo(3)  // 3 = Módulo INFRAESTRUCTURA
    public ResponseEntity<?> modificar(@RequestBody AulasDTO dto) {
        if(dto.getIdAula() == null){
            return ResponseEntity.badRequest()
                    .body("ID de aula es requerido");
        }
        Aulas aulas = new Aulas();
        aulas.setIdAula(dto.getIdAula());
        aulas.setNombreAula(dto.getNombreAula());
        aulas.setCapacidad(dto.getCapacidad());

        Sedes sedes = repoSedes
            .findById(dto.getIdSede())
            .orElse(null);

        aulas.setIdSede(sedes);

        return ResponseEntity.ok(serviceAulas.modificar(aulas));
    }
    @GetMapping("/aulas/{id}")
    public Optional<Aulas> buscarId(@PathVariable("id") Long id){
        return serviceAulas.buscarId(id);
    }
    @DeleteMapping("/aulas/{id}")
    @RequireModulo(3)  // 3 = Módulo INFRAESTRUCTURA
    public String eliminar(@PathVariable Long id){
        serviceAulas.eliminar(id);
        return "Aula eliminada correctamente";
    }   
}