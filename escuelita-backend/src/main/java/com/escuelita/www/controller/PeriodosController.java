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

import com.escuelita.www.entity.AnioEscolar;
import com.escuelita.www.entity.Periodos;
import com.escuelita.www.entity.PeriodosDTO;
import com.escuelita.www.repository.AnioEscolarRepository;
import com.escuelita.www.service.IPeriodosService;
import com.escuelita.www.security.RequireModulo;

@RestController
@RequestMapping("/restful")
public class PeriodosController {

    @Autowired
    private IPeriodosService servicePeriodos;
    @Autowired
    private AnioEscolarRepository repoAnioEscolar;

    @GetMapping("/periodos")
    @RequireModulo(2)  // 2 = Módulo CONFIGURACIÓN
    public List<Periodos> buscarTodos() {
        return servicePeriodos.buscarTodos(); 
    }
    @PostMapping("/periodos")
    @RequireModulo(2)  // 2 = Módulo CONFIGURACIÓN
    public ResponseEntity<?> guardar(@RequestBody PeriodosDTO dto) {
        Periodos periodos = new Periodos();
        periodos.setNombrePeriodo(dto.getNombrePeriodo());
        periodos.setFechaInicio(dto.getFechaInicio());
        periodos.setFechaFin(dto.getFechaFin());

        AnioEscolar anioEscolar = repoAnioEscolar
            .findById(dto.getIdAnio())
            .orElse(null);
        
        periodos.setIdAnio(anioEscolar);

        return ResponseEntity.ok(servicePeriodos.guardar(periodos));
    }
    @PutMapping("/periodos")
    @RequireModulo(2)  // 2 = Módulo CONFIGURACIÓN
    public ResponseEntity<?> modificar(@RequestBody PeriodosDTO dto) {
        if(dto.getIdPeriodo() == null){
            return ResponseEntity.badRequest()
                    .body("ID de periodo es requerido");
        }
        Periodos periodos = new Periodos();
        periodos.setIdPeriodo(dto.getIdPeriodo());
        periodos.setNombrePeriodo(dto.getNombrePeriodo());
        periodos.setFechaInicio(dto.getFechaInicio());
        periodos.setFechaFin(dto.getFechaFin());

        AnioEscolar anioEscolar = repoAnioEscolar
            .findById(dto.getIdAnio())
            .orElse(null);

        periodos.setIdAnio(anioEscolar);

        return ResponseEntity.ok(servicePeriodos.modificar(periodos));
    }
    @GetMapping("/periodos/{id}")
    @RequireModulo(2)  // 2 = Módulo CONFIGURACIÓN
    public Optional<Periodos> buscarId(@PathVariable("id") Long id){
        return servicePeriodos.buscarId(id);
    }
    @DeleteMapping("/periodos/{id}")
    @RequireModulo(2)  // 2 = Módulo CONFIGURACIÓN
    public String eliminar(@PathVariable Long id){
        servicePeriodos.eliminar(id);
        return "Periodo eliminado correctamente";
    }   
}