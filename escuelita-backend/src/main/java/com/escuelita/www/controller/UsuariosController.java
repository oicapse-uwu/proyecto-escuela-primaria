package com.escuelita.www.controller;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.escuelita.www.entity.*;
import com.escuelita.www.repository.*;
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

    @GetMapping("/usuarios")
    public List<Usuarios> buscarTodos() {
        return serviceUsuarios.buscarTodos();
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
        if(dto.getIdUsuario() == null) {return ResponseEntity.badRequest().body("ID requerido");
       }
        
        Usuarios Usuarios = new Usuarios();
        Usuarios.setIdUsuario(dto.getIdUsuario());
        Usuarios.setNumeroDocumento(dto.getNumeroDocumento());
        Usuarios.setApellidos(dto.getApellidos());
        Usuarios.setNombres(dto.getNombres());
        Usuarios.setCorreo(dto.getCorreo());
        Usuarios.setUsuario(dto.getUsuario());
        Usuarios.setContrasena(dto.getContrasena());
        Usuarios.setFotoPerfil(dto.getFotoPerfil());
        
        Usuarios.setIdSede(new Sedes(dto.getIdSede()));
        Usuarios.setIdRol(new Roles(dto.getIdRol()));
        Usuarios.setIdTipoDoc(new TipoDocumentos(dto.getIdTipoDoc()));

        return ResponseEntity.ok(serviceUsuarios.modificar(Usuarios));
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
}