// Sin tocar
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

import com.escuelita.www.entity.EstadosSuscripcion;
import com.escuelita.www.service.IEstadosSuscripcionService;

@RestController
@RequestMapping("/restful")
public class EstadosSuscripcionController {
    @Autowired
    private IEstadosSuscripcionService serviceEstadosSuscripcion;

    @GetMapping("/estadossuscripcion")
    public List<EstadosSuscripcion> buscarTodos() {
        return serviceEstadosSuscripcion.buscarTodos(); 
    }
    @PostMapping("/estadossuscripcion")
    public EstadosSuscripcion guardar(@RequestBody EstadosSuscripcion estadosSuscripcion) {
        serviceEstadosSuscripcion.guardar(estadosSuscripcion);
        return estadosSuscripcion;
    }
    @PutMapping("/estadossuscripcion")
    public EstadosSuscripcion modificar(@RequestBody EstadosSuscripcion estadosSuscripcion) {
        serviceEstadosSuscripcion.modificar(estadosSuscripcion);
        return estadosSuscripcion;
    }
    @GetMapping("/estadossuscripcion/{id}")
    public Optional<EstadosSuscripcion> buscarId(@PathVariable("id") Long id){
        return serviceEstadosSuscripcion.buscarId(id);
    }
    @DeleteMapping("/estadossuscripcion/{id}")
    public String eliminar(@PathVariable Long id){
        serviceEstadosSuscripcion.eliminar(id);
        return "Estado de suscripción eliminado correctamente";
    }
}