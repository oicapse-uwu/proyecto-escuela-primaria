package com.escuelita.www.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.escuelita.www.entity.Modulos;
import com.escuelita.www.entity.Permisos;
import com.escuelita.www.entity.Usuarios;
import com.escuelita.www.entity.UsuarioModuloPermiso;
import com.escuelita.www.entity.UsuarioModuloPermisoDTO;
import com.escuelita.www.repository.ModulosRepository;
import com.escuelita.www.repository.PermisosRepository;
import com.escuelita.www.repository.UsuariosRepository;
import com.escuelita.www.repository.UsuarioModuloPermisoRepository;
import com.escuelita.www.service.IUsuarioModuloPermisoService;

@RestController
@RequestMapping("/restful/usuario-modulo-permiso")
public class UsuarioModuloPermisoController {
    @Autowired
    private IUsuarioModuloPermisoService service;
    @Autowired
    private UsuariosRepository repoUsuarios;
    @Autowired
    private ModulosRepository repoModulos;
    @Autowired
    private PermisosRepository repoPermisos;
    @Autowired
    private UsuarioModuloPermisoRepository repo;

    @GetMapping
    public List<UsuarioModuloPermiso> obtenerTodos() {
        return service.buscarTodos();
    }

    @GetMapping("/usuario/{idUsuario}")
    public List<UsuarioModuloPermiso> obtenerPorUsuario(@PathVariable Long idUsuario) {
        return repo.findByIdUsuarioActivos(idUsuario);
    }

    @GetMapping("/{idUmp}")
    public Optional<UsuarioModuloPermiso> obtenerPorId(@PathVariable Long idUmp) {
        return repo.findById(idUmp);
    }

    @PostMapping
    public ResponseEntity<?> crear(@RequestBody UsuarioModuloPermisoDTO dto) {
        Optional<Usuarios> usuarioOpt = repoUsuarios.findById(dto.getIdUsuario());
        Optional<Modulos> moduloOpt = repoModulos.findById(dto.getIdModulo());
        Optional<Permisos> permisoOpt = repoPermisos.findById(dto.getIdPermiso());

        if (usuarioOpt.isEmpty() || moduloOpt.isEmpty() || permisoOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Usuario, módulo o permiso no encontrado");
        }

        UsuarioModuloPermiso ump = new UsuarioModuloPermiso();
        ump.setIdUsuario(usuarioOpt.get());
        ump.setIdModulo(moduloOpt.get());
        ump.setIdPermiso(permisoOpt.get());
        ump.setEstado(1);

        UsuarioModuloPermiso creado = service.guardar(ump);
        return ResponseEntity.ok(creado);
    }

    @DeleteMapping("/{idUmp}")
    public ResponseEntity<?> eliminar(@PathVariable Long idUmp) {
        Optional<UsuarioModuloPermiso> ump = repo.findById(idUmp);
        if (ump.isEmpty()) {
            return ResponseEntity.badRequest().body("Registro no encontrado");
        }

        service.eliminar(idUmp);
        return ResponseEntity.ok("Eliminado correctamente");
    }
}
