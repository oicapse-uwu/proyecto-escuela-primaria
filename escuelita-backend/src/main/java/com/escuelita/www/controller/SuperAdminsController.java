package com.escuelita.www.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;

import com.escuelita.www.entity.SuperAdmins;
import com.escuelita.www.service.ISuperAdminsService;

@RestController
@RequestMapping("/primaria_bd_real")
public class SuperAdminsController {

    @Autowired
    private ISuperAdminsService serviceSuperAdmins;

    @GetMapping("/superadmins")
    public List<SuperAdmins> buscartodos() {
        return serviceSuperAdmins.buscarTodos(); 
    }

    @PostMapping("/superadmins")
    public SuperAdmins guardar(@RequestBody SuperAdmins superAdmin) {
        serviceSuperAdmins.guardar(superAdmin);
        return superAdmin;
    }

    @PutMapping("/superadmins")
    public SuperAdmins modificar(@RequestBody SuperAdmins superAdmin) {
        serviceSuperAdmins.modificar(superAdmin);
        return superAdmin;
    }

    @GetMapping("/superadmins/{id}")
    public Optional<SuperAdmins> buscarId(@PathVariable Long id){
        return serviceSuperAdmins.buscarId(id);
    }

    @DeleteMapping("/superadmins/{id}")
    public String eliminar(@PathVariable Long id){
        serviceSuperAdmins.eliminar(id);
        return "Administrador eliminado correctamente";
    }   
}
