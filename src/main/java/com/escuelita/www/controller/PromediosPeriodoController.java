package com.escuelita.www.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.escuelita.www.entity.PromediosPeriodo;
import com.escuelita.www.service.IPromediosPeriodoService;

@RestController
@RequestMapping("/primaria_bd_real")
public class PromediosPeriodoController {

    @Autowired
    private IPromediosPeriodoService servicePromedios;

    @GetMapping("/promediosperiodo")
    public List<PromediosPeriodo> buscarTodos() {
        return servicePromedios.buscarTodos();
    }

    @PostMapping("/promediosperiodo")
    public PromediosPeriodo guardar(@RequestBody PromediosPeriodo promedio) {
        servicePromedios.guardar(promedio);
        return promedio;
    }

    @PutMapping("/promediosperiodo")
    public PromediosPeriodo modificar(@RequestBody PromediosPeriodo promedio) {
        servicePromedios.modificar(promedio);
        return promedio;
    }

    @GetMapping("/promediosperiodo/{id}")
    public Optional<PromediosPeriodo> buscarId(@PathVariable("id") Long id) {
        return servicePromedios.buscarId(id);
    }

    @DeleteMapping("/promediosperiodo/{id}")
    public String eliminar(@PathVariable Long id) {
        servicePromedios.eliminar(id);
        return "Promedio de periodo eliminado correctamente";
    }
}