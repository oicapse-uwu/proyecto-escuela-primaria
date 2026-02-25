package com.escuelita.www.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
        
        rolModuloPermiso.setIdRol(repoRoles.findById(dto.getIdRol()).orElse(null));
        rolModuloPermiso.setIdModulo(repoModulos.findById(dto.getIdModulo()).orElse(null));
        rolModuloPermiso.setIdPermiso(repoPermisos.findById(dto.getIdPermiso()).orElse(null));

        Modulos modulos = repoModulos
                   .findById(dto.getIdModulo())
                   .orElse(null);

        Roles roles = repoRoles
                   .findById(dto.getIdRol())
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
        if(dto.getIdRmp() == null) return ResponseEntity.badRequest().body("ID RMP requerido");
        
        RolModuloPermiso rolModuloPermiso = new RolModuloPermiso();
        rolModuloPermiso.setIdRmp(dto.getIdRmp());
        
        rolModuloPermiso.setIdRol(new Roles(dto.getIdRol()));
        rolModuloPermiso.setIdModulo(new Modulos(dto.getIdModulo()));
        rolModuloPermiso.setIdPermiso(new Permisos(dto.getIdPermiso()));

        return ResponseEntity.ok(serviceRmp.modificar(rolModuloPermiso));
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