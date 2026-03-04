// Revisado
package com.escuelita.www.controller;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.escuelita.www.entity.Roles;
import com.escuelita.www.repository.UsuariosRepository;
import com.escuelita.www.service.IRolesService;

@RestController
@RequestMapping("/restful")
public class RolesController {
    @Autowired
    private IRolesService serviceRoles;
    @Autowired
    private UsuariosRepository repoUsuarios;

    @GetMapping("/roles")
    public List<Roles> buscarTodos() {
        return serviceRoles.buscarTodos(); 
    }
    @GetMapping("/roles/sede/{idSede}")
    public List<Roles> buscarPorSede(@PathVariable Long idSede) {
        return repoUsuarios.findByIdSedeIdSede(idSede).stream()
            .map(usuario -> usuario.getIdRol())
            .filter(rol -> rol != null)
            .collect(Collectors.toMap(Roles::getIdRol, rol -> rol, (a, b) -> a))
            .values()
            .stream()
            .collect(Collectors.toList());
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