package com.escuelita.www.controller;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.escuelita.www.entity.*;
import com.escuelita.www.repository.*;
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
    public List<RolModuloPermiso> buscartodos() {
        return serviceRmp.buscarTodos();
    }

    @PostMapping("/rolmodulopermiso")
    public ResponseEntity<?> guardar(@RequestBody RolModuloPermisoDTO dto) {
        RolModuloPermiso rmp = new RolModuloPermiso();
        
        rmp.setIdRol(repoRoles.findById(dto.getIdRol()).orElse(null));
        rmp.setIdModulo(repoModulos.findById(dto.getIdModulo()).orElse(null));
        rmp.setIdPermiso(repoPermisos.findById(dto.getIdPermiso()).orElse(null));

        return ResponseEntity.ok(serviceRmp.guardar(rmp));
    }

    @PutMapping("/rolmodulopermiso")
    public ResponseEntity<?> modificar(@RequestBody RolModuloPermisoDTO dto) {
        if(dto.getIdRmp() == null) return ResponseEntity.badRequest().body("ID RMP requerido");
        
        RolModuloPermiso rmp = new RolModuloPermiso();
        rmp.setIdRmp(dto.getIdRmp());
        rmp.setIdRol(new Roles(dto.getIdRol()));
        rmp.setIdModulo(new Modulos(dto.getIdModulo()));
        rmp.setIdPermiso(new Permisos(dto.getIdPermiso()));

        return ResponseEntity.ok(serviceRmp.modificar(rmp));
    }

    @GetMapping("/rolmodulopermiso/{id}")
    public Optional<RolModuloPermiso> buscarId(@PathVariable Long id) {
        return serviceRmp.buscarId(id);
    }

    @DeleteMapping("/rolmodulopermiso/{id}")
    public String eliminar(@PathVariable Long id) {
        serviceRmp.eliminar(id);
        return "Relación Rol-Módulo-Permiso eliminada";
    }
}