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

    // Suponiendo que ya creaste el repositorio de Sedes
    @Autowired
    private SedesRepository repoSedes; 

    @GetMapping("/usuarios")
    public List<Usuarios> buscartodos() {
        return serviceUsuarios.buscarTodos();
    }

    @PostMapping("/usuarios")
    public ResponseEntity<?> guardar(@RequestBody UsuariosDTO dto) {
        Usuarios user = new Usuarios();
        mapearDtoAEntidad(user, dto);
        
        user.setIdSede(repoSedes.findById(dto.getIdSede()).orElse(null));
        user.setIdRol(repoRoles.findById(dto.getIdRol()).orElse(null));
        user.setIdTipoDoc(repoTipoDocs.findById(dto.getIdTipoDoc()).orElse(null));

        return ResponseEntity.ok(serviceUsuarios.guardar(user));
    }

    @PutMapping("/usuarios")
    public ResponseEntity<?> modificar(@RequestBody UsuariosDTO dto) {
        if(dto.getIdUsuario() == null) return ResponseEntity.badRequest().body("ID requerido");
        
        Usuarios user = new Usuarios();
        user.setIdUsuario(dto.getIdUsuario());
        mapearDtoAEntidad(user, dto);
        
        // Carga rápida para modificar
        user.setIdSede(new Sedes(dto.getIdSede()));
        user.setIdRol(new Roles(dto.getIdRol()));
        user.setIdTipoDoc(new TipoDocumentos(dto.getIdTipoDoc()));

        return ResponseEntity.ok(serviceUsuarios.modificar(user));
    }

    private void mapearDtoAEntidad(Usuarios user, UsuariosDTO dto) {
        user.setNumeroDocumento(dto.getNumeroDocumento());
        user.setApellidos(dto.getApellidos());
        user.setNombres(dto.getNombres());
        user.setCorreo(dto.getCorreo());
        user.setUsuario(dto.getUsuario());
        user.setContrasena(dto.getContrasena());
        user.setFotoPerfil(dto.getFotoPerfil());
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