package com.escuelita.www.controller;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.escuelita.www.entity.EstadosSuscripcion;
import com.escuelita.www.service.IEstadosSuscripcionService;

@RestController
@RequestMapping("/primaria_bd_real")
public class EstadosSuscripcionController {

    @Autowired
    private IEstadosSuscripcionService serviceEstados;

    @GetMapping("/estadossuscripcion")
    public List<EstadosSuscripcion> buscartodos() {
        return serviceEstados.buscarTodos();
    }

    @PostMapping("/estadossuscripcion")
    public EstadosSuscripcion guardar(@RequestBody EstadosSuscripcion estadoSuscripcion) {
        serviceEstados.guardar(estadoSuscripcion);
        return estadoSuscripcion;
    }

    @PutMapping("/estadossuscripcion")
    public EstadosSuscripcion modificar(@RequestBody EstadosSuscripcion estadoSuscripcion) {
        serviceEstados.modificar(estadoSuscripcion);
        return estadoSuscripcion;
    }

    @GetMapping("/estadossuscripcion/{id}")
    public Optional<EstadosSuscripcion> buscarId(@PathVariable("id") Long id) {
        return serviceEstados.buscarId(id);
    }

    @DeleteMapping("/estadossuscripcion/{id}")
    public String eliminar(@PathVariable Long id) {
        serviceEstados.eliminar(id);
        return "Estado de suscripción eliminado correctamente";
    }
}
