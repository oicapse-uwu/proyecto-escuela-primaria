// Revisado
package com.escuelita.www.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import com.escuelita.www.entity.Modulos;
import com.escuelita.www.entity.Permisos;
import com.escuelita.www.entity.RolModuloPermiso;
import com.escuelita.www.entity.RolModuloPermisoDTO;
import com.escuelita.www.entity.Roles;

import com.escuelita.www.repository.ModulosRepository;
import com.escuelita.www.repository.PermisosRepository;
import com.escuelita.www.repository.RolesRepository;

import com.escuelita.www.service.IRolModuloPermisoService;

@RestController
@RequestMapping("/restful")
public class RolModuloPermisoController {

    @Autowired
    private IRolModuloPermisoService serviceRmp;
    @Autowired
    private RolesRepository repoRoles;
    @Autowired
    private ModulosRepository repoModulos;
    @Autowired
    private PermisosRepository repoPermisos;

    @GetMapping("/rolmodulopermiso")
    public List<RolModuloPermiso> buscarTodos() {
        return serviceRmp.buscarTodos();
    }
    @PostMapping("/rolmodulopermiso")
    public ResponseEntity<?> guardar(@RequestBody RolModuloPermisoDTO dto) {
        RolModuloPermiso rolModuloPermiso = new RolModuloPermiso();
        
        Roles roles = repoRoles
            .findById(dto.getIdRol())
            .orElse(null);
        Modulos modulos = repoModulos
            .findById(dto.getIdModulo())
            .orElse(null);
        Permisos permisos = repoPermisos
            .findById(dto.getIdPermiso())
            .orElse(null);
        
        rolModuloPermiso.setIdRol(roles);
        rolModuloPermiso.setIdModulo(modulos);
        rolModuloPermiso.setIdPermiso(permisos);

        return ResponseEntity.ok(serviceRmp.guardar(rolModuloPermiso));
    }
    @PutMapping("/rolmodulopermiso")
    public ResponseEntity<?> modificar(@RequestBody RolModuloPermisoDTO dto) {
        if(dto.getIdRmp() == null) {
            return ResponseEntity.badRequest()
                    .body("ID RMP requerido");
        }
        RolModuloPermiso rolModuloPermiso = new RolModuloPermiso();
        rolModuloPermiso.setIdRmp(dto.getIdRmp());
        
        Roles roles = repoRoles
            .findById(dto.getIdRol())
            .orElse(null);
        Modulos modulos = repoModulos
            .findById(dto.getIdModulo())
            .orElse(null);
        Permisos permisos = repoPermisos
            .findById(dto.getIdPermiso())
            .orElse(null);

        rolModuloPermiso.setIdRol(roles);
        rolModuloPermiso.setIdModulo(modulos);
        rolModuloPermiso.setIdPermiso(permisos);

        return ResponseEntity.ok(serviceRmp.modificar(rolModuloPermiso));
    }
    @GetMapping("/rolmodulopermiso/{id}")
    public Optional<RolModuloPermiso> buscarId(@PathVariable("id") Long id){
        return serviceRmp.buscarId(id);
    }
    @DeleteMapping("/rolmodulopermiso/{id}")
    public String eliminar(@PathVariable Long id){
        serviceRmp.eliminar(id);
        return "Relación Rol-Módulo-Permiso eliminada correctamente";
    }
}