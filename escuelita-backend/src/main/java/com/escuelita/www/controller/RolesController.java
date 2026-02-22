package com.escuelita.www.controller;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.escuelita.www.entity.Roles;
import com.escuelita.www.service.IRolesService;

@RestController
@RequestMapping("/primaria_bd_real")
public class RolesController {

    @Autowired
    private IRolesService serviceRoles;

    @GetMapping("/roles")
    public List<Roles> buscartodos() {
        return serviceRoles.buscarTodos();
    }

    @PostMapping("/roles")
    public Roles guardar(@RequestBody Roles rol) {
        serviceRoles.guardar(rol);
        return rol;
    }

    @PutMapping("/roles")
    public Roles modificar(@RequestBody Roles rol) {
        serviceRoles.modificar(rol);
        return rol;
    }

    @GetMapping("/roles/{id}")
    public Optional<Roles> buscarId(@PathVariable("id") Long id) {
        return serviceRoles.buscarId(id);
    }

    @DeleteMapping("/roles/{id}")
    public String eliminar(@PathVariable Long id) {
        serviceRoles.eliminar(id);
        return "Rol eliminado correctamente";
    }
}
