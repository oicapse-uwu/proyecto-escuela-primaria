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

import com.escuelita.www.entity.TiposNota;
import com.escuelita.www.service.ITiposNotaService;
import com.escuelita.www.security.RequireModulo;

@RestController
@RequestMapping("/restful")
public class TiposNotaController {
    @Autowired
    private ITiposNotaService serviceTiposNota;

    @GetMapping("/tiposnota")
    @RequireModulo(7)  // 7 = Módulo EVALUACIONES Y NOTAS
    public List<TiposNota> buscarTodos() { 
        return serviceTiposNota.buscarTodos(); 
    }
    @PostMapping("/tiposnota")
    @RequireModulo(7)  // 7 = Módulo EVALUACIONES Y NOTAS
    public TiposNota guardar(@RequestBody TiposNota tiposNota) {
        serviceTiposNota.guardar(tiposNota);
        return tiposNota;
    }
    @PutMapping("/tiposnota")
    @RequireModulo(7)  // 7 = Módulo EVALUACIONES Y NOTAS
    public TiposNota modificar(@RequestBody TiposNota tiposNota) {
        serviceTiposNota.modificar(tiposNota);
        return tiposNota;
    }
    @GetMapping("/tiposnota/{id}")
    @RequireModulo(7)  // 7 = Módulo EVALUACIONES Y NOTAS
    public Optional<TiposNota> buscarId(@PathVariable("id") Long id){
        return serviceTiposNota.buscarId(id);
    }
    @DeleteMapping("/tiposnota/{id}")
    @RequireModulo(7)  // 7 = Módulo EVALUACIONES Y NOTAS
    public String eliminar(@PathVariable Long id){
        serviceTiposNota.eliminar(id);
        return "Tipo de nota eliminado correctamente";
    }
}