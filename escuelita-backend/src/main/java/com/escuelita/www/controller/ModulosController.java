package com.escuelita.www.controller;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.escuelita.www.entity.Modulos;
import com.escuelita.www.service.IModulosService;

@RestController
@RequestMapping("/primaria_bd_real")
public class ModulosController {

    @Autowired
    private IModulosService serviceModulos;

    @GetMapping("/modulos")
    public List<Modulos> buscartodos() {
        return serviceModulos.buscarTodos();
    }

    @PostMapping("/modulos")
    public Modulos guardar(@RequestBody Modulos modulo) {
        serviceModulos.guardar(modulo);
        return modulo;
    }

    @PutMapping("/modulos")
    public Modulos modificar(@RequestBody Modulos modulo) {
        serviceModulos.modificar(modulo);
        return modulo;
    }

    @GetMapping("/modulos/{id}")
    public Optional<Modulos> buscarId(@PathVariable("id") Long id) {
        return serviceModulos.buscarId(id);
    }

    @DeleteMapping("/modulos/{id}")
    public String eliminar(@PathVariable Long id) {
        serviceModulos.eliminar(id);
        return "Módulo eliminado correctamente";
    }
}