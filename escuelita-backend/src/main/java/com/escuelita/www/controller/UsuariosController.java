// Revisado
package com.escuelita.www.controller;

import java.util.List;
import java.util.Optional;
import java.util.Map;
import java.util.LinkedHashMap;
import java.util.stream.Collectors;

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

import com.escuelita.www.entity.Roles;
import com.escuelita.www.entity.Sedes;
import com.escuelita.www.entity.TipoDocumentos;
import com.escuelita.www.entity.Usuarios;
import com.escuelita.www.entity.UsuariosDTO;
import com.escuelita.www.entity.ModulosPermisosUsuarioDTO;
import com.escuelita.www.entity.ModuloAccesoDTO;
import com.escuelita.www.entity.PermisoAccesoDTO;
import com.escuelita.www.repository.RolesRepository;
import com.escuelita.www.repository.SedesRepository;
import com.escuelita.www.repository.TipoDocumentosRepository;
import com.escuelita.www.repository.ModulosRepository;
import com.escuelita.www.repository.PermisosRepository;
import com.escuelita.www.repository.RolModuloPermisoRepository;
import com.escuelita.www.service.IUsuariosService;

@RestController
@RequestMapping("/restful")
public class UsuariosController {

    @Autowired
    private IUsuariosService serviceUsuarios;
    @Autowired
    private RolesRepository repoRoles;
    @Autowired
    private TipoDocumentosRepository repoTipoDocs;
    @Autowired
    private SedesRepository repoSedes;
    @Autowired
    private ModulosRepository repoModulos;
    @Autowired
    private PermisosRepository repoPermisos;
    @Autowired
    private RolModuloPermisoRepository repoRolModuloPermiso; 

    @GetMapping("/usuarios")
    public List<Usuarios> buscarTodos() {
        return serviceUsuarios.buscarTodos();
    }
    @GetMapping("/usuarios/sede/{idSede}")
    public List<Usuarios> buscarPorSede(@PathVariable Long idSede) {
        return serviceUsuarios.buscarPorSede(idSede);
    }
    @PostMapping("/usuarios")
    public ResponseEntity<?> guardar(@RequestBody UsuariosDTO dto) {
        Usuarios usuarios = new Usuarios();
        usuarios.setNumeroDocumento(dto.getNumeroDocumento());
        usuarios.setApellidos(dto.getApellidos());
        usuarios.setNombres(dto.getNombres());
        usuarios.setCorreo(dto.getCorreo());
        usuarios.setUsuario(dto.getUsuario());
        usuarios.setContrasena(dto.getContrasena());
        usuarios.setFotoPerfil(dto.getFotoPerfil());

        Sedes sedes = repoSedes
            .findById(dto.getIdSede())
            .orElse(null);
        Roles roles = repoRoles
            .findById(dto.getIdRol())
            .orElse(null);
        TipoDocumentos tipoDoc = repoTipoDocs
            .findById(dto.getIdTipoDoc())
            .orElse(null);
        
        usuarios.setIdSede(sedes);
        usuarios.setIdRol(roles);
        usuarios.setIdTipoDoc(tipoDoc);

        return ResponseEntity.ok(serviceUsuarios.guardar(usuarios));
    }
    @PutMapping("/usuarios")
    public ResponseEntity<?> modificar(@RequestBody UsuariosDTO dto) {
        if(dto.getIdUsuario() == null) {
            return ResponseEntity.badRequest()
                    .body("ID requerido");
        }

        Optional<Usuarios> usuarioActualOpt = serviceUsuarios.buscarId(dto.getIdUsuario());
        if (usuarioActualOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Usuario no encontrado");
        }

        Usuarios usuarioActual = usuarioActualOpt.get();

        Usuarios usuarios = new Usuarios();
        usuarios.setIdUsuario(dto.getIdUsuario());
        usuarios.setNumeroDocumento(dto.getNumeroDocumento());
        usuarios.setApellidos(dto.getApellidos());
        usuarios.setNombres(dto.getNombres());
        usuarios.setCorreo(dto.getCorreo());
        usuarios.setUsuario(dto.getUsuario());
        String nuevaContrasena = dto.getContrasena();
        if (nuevaContrasena != null && !nuevaContrasena.trim().isEmpty()) {
            usuarios.setContrasena(nuevaContrasena);
        } else {
            usuarios.setContrasena(usuarioActual.getContrasena());
        }
        usuarios.setFotoPerfil(dto.getFotoPerfil());
        
        Sedes sedes = usuarioActual.getIdSede();
        if (dto.getIdSede() != null && dto.getIdSede() > 0) {
            sedes = repoSedes.findById(dto.getIdSede()).orElse(usuarioActual.getIdSede());
        }

        Roles roles = usuarioActual.getIdRol();
        if (dto.getIdRol() != null && dto.getIdRol() > 0) {
            roles = repoRoles.findById(dto.getIdRol()).orElse(usuarioActual.getIdRol());
        }

        TipoDocumentos tipoDocumentos = usuarioActual.getIdTipoDoc();
        if (dto.getIdTipoDoc() != null && dto.getIdTipoDoc() > 0) {
            tipoDocumentos = repoTipoDocs.findById(dto.getIdTipoDoc()).orElse(usuarioActual.getIdTipoDoc());
        }

        usuarios.setIdSede(sedes);
        usuarios.setIdRol(roles);
        usuarios.setIdTipoDoc(tipoDocumentos);

        return ResponseEntity.ok(serviceUsuarios.modificar(usuarios));
    }
    @GetMapping("/usuarios/{id}")
    public Optional<Usuarios> buscarId(@PathVariable Long id) {
        return serviceUsuarios.buscarId(id);
    }
    @DeleteMapping("/usuarios/{id}")
    public String eliminar(@PathVariable Long id) {
        serviceUsuarios.eliminar(id);
        return "Usuario desactivado correctamente";
    }

    /**
     * FASE 2: Usuario obtiene sus módulos y permisos según su rol
     * Este endpoint es llamado por el FRONTEND al cargar la aplicación
     * para determinar qué módulos y acciones el usuario puede hacer
     */
    @GetMapping("/usuarios/{idUsuario}/modulos-permisos")
    public ResponseEntity<?> obtenerModulosPermisosUsuario(@PathVariable Long idUsuario) {
        Optional<Usuarios> usuarioOpt = serviceUsuarios.buscarId(idUsuario);
        if (usuarioOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Usuario no encontrado");
        }

        Usuarios usuario = usuarioOpt.get();
        Roles rol = usuario.getIdRol();
        
        if (rol == null) {
            return ResponseEntity.badRequest().body("Usuario no tiene rol asignado");
        }

        // Obtener todas las asignaciones de rol-módulo-permiso del usuario
        List<com.escuelita.www.entity.RolModuloPermiso> asignaciones = 
            repoRolModuloPermiso.findByIdRol_IdRol(rol.getIdRol());

        // Agrupar por módulo
        Map<Long, List<com.escuelita.www.entity.RolModuloPermiso>> permisoPorModulo = 
            asignaciones.stream()
                .collect(Collectors.groupingBy(rmp -> rmp.getIdModulo().getIdModulo()));

        // Construir lista de módulos con sus permisos
        List<ModuloAccesoDTO> modulosDTO = new java.util.ArrayList<>();
        
        for (Long idModulo : permisoPorModulo.keySet()) {
            Optional<com.escuelita.www.entity.Modulos> moduloOpt = repoModulos.findById(idModulo);
            if (moduloOpt.isEmpty()) continue;

            com.escuelita.www.entity.Modulos modulo = moduloOpt.get();
            List<com.escuelita.www.entity.RolModuloPermiso> permisosModulo = permisoPorModulo.get(idModulo);
            
            List<PermisoAccesoDTO> permisosDTO = permisosModulo.stream()
                .map(rmp -> new PermisoAccesoDTO(
                    rmp.getIdPermiso().getIdPermiso(),
                    rmp.getIdPermiso().getNombre(),
                    rmp.getIdPermiso().getCodigo(),
                    rmp.getIdPermiso().getDescripcion()
                ))
                .collect(Collectors.toList());

            modulosDTO.add(new ModuloAccesoDTO(
                modulo.getIdModulo(),
                modulo.getNombre(),
                modulo.getDescripcion(),
                modulo.getIcono(),
                modulo.getOrden(),
                permisosDTO
            ));
        }

        // Ordenar módulos por orden
        modulosDTO.sort((m1, m2) -> Integer.compare(
            m1.getOrden() != null ? m1.getOrden() : 999,
            m2.getOrden() != null ? m2.getOrden() : 999
        ));

        ModulosPermisosUsuarioDTO respuesta = new ModulosPermisosUsuarioDTO(
            usuario.getIdUsuario(),
            usuario.getNombres() + " " + usuario.getApellidos(),
            rol.getIdRol(),
            rol.getNombre(),
            modulosDTO
        );

        return ResponseEntity.ok(respuesta);
    }
}