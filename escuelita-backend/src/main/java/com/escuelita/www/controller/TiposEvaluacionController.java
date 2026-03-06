// No modificado
package com.escuelita.www.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.escuelita.www.entity.TiposEvaluacion;
import com.escuelita.www.service.ITiposEvaluacionService;
import com.escuelita.www.security.RequireModulo;

@RestController
@RequestMapping("/restful")
public class TiposEvaluacionController {
    @Autowired
    private ITiposEvaluacionService serviceTiposEvaluacion;
    
    @GetMapping("/tiposevaluacion")
    @RequireModulo(7)  // 7 = Módulo EVALUACIONES Y NOTAS
    public List<TiposEvaluacion> buscarTodos() {
        return serviceTiposEvaluacion.buscarTodos(); 
    }
    @PostMapping("/tiposevaluacion")
    @RequireModulo(7)  // 7 = Módulo EVALUACIONES Y NOTAS
    public TiposEvaluacion guardar(@RequestBody TiposEvaluacion tiposEvaluacion) {
        serviceTiposEvaluacion.guardar(tiposEvaluacion);
        return tiposEvaluacion;
    }
    @PutMapping("/tiposevaluacion")
    @RequireModulo(7)  // 7 = Módulo EVALUACIONES Y NOTAS
    public TiposEvaluacion modificar(@RequestBody TiposEvaluacion tiposEvaluacion) {
        serviceTiposEvaluacion.modificar(tiposEvaluacion);
        return tiposEvaluacion;
    }
    @GetMapping("/tiposevaluacion/{id}")
    @RequireModulo(7)  // 7 = Módulo EVALUACIONES Y NOTAS
    public Optional<TiposEvaluacion> buscarId(@PathVariable("id") Long id){
        return serviceTiposEvaluacion.buscarId(id);
    }
    @DeleteMapping("/tiposevaluacion/{id}")
    @RequireModulo(7)  // 7 = Módulo EVALUACIONES Y NOTAS
    public String eliminar(@PathVariable Long id){
        serviceTiposEvaluacion.eliminar(id);
        return "Tipo de evaluación eliminado correctamente";
    }
}