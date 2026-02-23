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

import com.escuelita.www.entity.AnioEscolar;
import com.escuelita.www.entity.Periodos;
import com.escuelita.www.entity.PeriodosDTO;
import com.escuelita.www.repository.AnioEscolarRepository;
import com.escuelita.www.service.IPeriodosService;

@RestController
@RequestMapping("/restful")
public class PeriodosController {

    @Autowired
    private IPeriodosService servicePeriodos;

    @Autowired
    private AnioEscolarRepository repoAnioEscolar;

    @GetMapping("/periodos")
    public List<Periodos> buscartodos() {
        return servicePeriodos.buscarTodos(); 
    }
    @PostMapping("/periodos")
    public ResponseEntity<?> guardar(@RequestBody PeriodosDTO dto) {
        Periodos periodo = new Periodos();
        periodo.setNombrePeriodo(dto.getNombrePeriodo());
        periodo.setFechaInicio(dto.getFechaInicio());
        periodo.setFechaFin(dto.getFechaFin());

        AnioEscolar anioEscolar = repoAnioEscolar
            .findById(dto.getIdAnio())
            .orElse(null);
        
        periodo.setIdAnio(anioEscolar);

        return ResponseEntity.ok(servicePeriodos.guardar(periodo));
    }
    @PutMapping("/periodos")
    public ResponseEntity<?> modificar(@RequestBody PeriodosDTO dto) {
        if(dto.getIdPeriodo() == null){
            return ResponseEntity.badRequest()
                    .body("ID de periodo es requerido");
        }
        Periodos periodo = new Periodos();
        periodo.setIdPeriodo(dto.getIdPeriodo());
        periodo.setNombrePeriodo(dto.getNombrePeriodo());
        periodo.setFechaInicio(dto.getFechaInicio());
        periodo.setFechaFin(dto.getFechaFin());

        periodo.setIdAnio(new AnioEscolar(dto.getIdAnio()));

        return ResponseEntity.ok(servicePeriodos.modificar(periodo));
    }
    @GetMapping("/periodos/{id}")
    public Optional<Periodos> buscarId(@PathVariable("id") Long id){
        return servicePeriodos.buscarId(id);
    }
    @DeleteMapping("/periodos/{id}")
    public String eliminar(@PathVariable Long id){
        servicePeriodos.eliminar(id);
        return "Periodo eliminado";
    }   
}