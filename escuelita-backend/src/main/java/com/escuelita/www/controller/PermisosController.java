package com.escuelita.www.controller;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.escuelita.www.entity.Permisos;
import com.escuelita.www.service.IPermisosService;

@RestController
@RequestMapping("/primaria_bd_real")
public class PermisosController {

    @Autowired
    private IPermisosService servicePermisos;

    @GetMapping("/permisos")
    public List<Permisos> buscartodos() {
        return servicePermisos.buscarTodos();
    }

    @PostMapping("/permisos")
    public Permisos guardar(@RequestBody Permisos permiso) {
        servicePermisos.guardar(permiso);
        return permiso;
    }

    @PutMapping("/permisos")
    public Permisos modificar(@RequestBody Permisos permiso) {
        servicePermisos.modificar(permiso);
        return permiso;
    }

    @GetMapping("/permisos/{id}")
    public Optional<Permisos> buscarId(@PathVariable("id") Long id) {
        return servicePermisos.buscarId(id);
    }

    @DeleteMapping("/permisos/{id}")
    public String eliminar(@PathVariable Long id) {
        servicePermisos.eliminar(id);
        return "Permiso eliminado correctamente";
    }
}