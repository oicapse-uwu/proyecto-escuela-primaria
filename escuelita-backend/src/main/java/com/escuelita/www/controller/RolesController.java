// Revisado
package com.escuelita.www.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.escuelita.www.entity.Roles;
import com.escuelita.www.service.IRolesService;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/restful")
public class RolesController {
    @Autowired
    private IRolesService serviceRoles;

    @GetMapping("/roles")
    public List<Roles> buscarTodos() {
        return serviceRoles.buscarTodos(); 
    }
    @PostMapping("/roles")
    public Roles guardar(@RequestBody Roles roles) {
        serviceRoles.guardar(roles);
        return roles;
    }
    @PutMapping("/roles")
    public Roles modificar(@RequestBody Roles roles) {
        serviceRoles.modificar(roles);
        return roles;
    }
    @GetMapping("/roles/{id}")
    public Optional<Roles> buscarId(@PathVariable("id") Long id){
        return serviceRoles.buscarId(id);
    }
    @DeleteMapping("/roles/{id}")
    public String eliminar(@PathVariable Long id){
        serviceRoles.eliminar(id);
        return "Rol eliminado correctamente";
    }
}