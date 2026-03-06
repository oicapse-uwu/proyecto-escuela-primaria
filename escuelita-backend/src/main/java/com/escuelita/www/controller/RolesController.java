// MODIFICADO / Tiene filtro de búsqueda por sede
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
import com.escuelita.www.entity.RolModulosDTO;
import com.escuelita.www.entity.RolModulo;
import com.escuelita.www.entity.Modulos;
import com.escuelita.www.repository.UsuariosRepository;
import com.escuelita.www.repository.ModuloAccesoRepository;
import com.escuelita.www.repository.ModulosRepository;
import com.escuelita.www.service.IRolesService;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/restful")
public class RolesController {
    @Autowired
    private IRolesService serviceRoles;
    @Autowired
    private UsuariosRepository repoUsuarios;
    @Autowired
    private ModuloAccesoRepository repoRolModulo;
    @Autowired
    private ModulosRepository repoModulos;

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

    /**
     * NUEVO: Obtiene los módulos asignados a un rol
     * Arquitectura simplificada: solo módulos, sin permisos granulares
     */
    @GetMapping("/roles/{idRol}/modulos")
    public ResponseEntity<RolModulosDTO> obtenerModulosRol(@PathVariable Long idRol) {
        System.out.println("📥 Obteniendo módulos para rol: " + idRol);
        
        // Verificar que el rol existe
        Optional<Roles> rolOpt = serviceRoles.buscarId(idRol);
        if (rolOpt.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        // Obtener todos los módulos asignados al rol
        List<Long> modulosAsignados = repoRolModulo.findAll()
            .stream()
            .filter(rm -> rm.getIdRol().getIdRol().equals(idRol) && rm.getEstado() == 1)
            .map(rm -> rm.getIdModulo().getIdModulo())
            .collect(Collectors.toList());

        System.out.println("✅ Módulos encontrados: " + modulosAsignados.size());
        RolModulosDTO resultado = new RolModulosDTO(idRol, modulosAsignados);
        return ResponseEntity.ok(resultado);
    }

    /**
     * NUEVO: Asigna módulos a un rol (reemplaza los anteriores)
     * Arquitectura simplificada: solo módulos, sin permisos granulares
     */
    @PostMapping("/roles/{idRol}/modulos")
    public ResponseEntity<?> asignarModulosRol(
        @PathVariable Long idRol,
        @RequestBody RolModulosDTO request
    ) {
        System.out.println("📤 Asignando módulos al rol " + idRol + ": " + request.getModulosAsignados());
        
        // Verificar que el rol existe
        Optional<Roles> rolOpt = serviceRoles.buscarId(idRol);
        if (rolOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Rol no encontrado");
        }

        Roles rol = rolOpt.get();

        // Eliminar asignaciones previas de este rol
        List<RolModulo> asignacionesActuales = repoRolModulo.findAll()
            .stream()
            .filter(rm -> rm.getIdRol().getIdRol().equals(idRol))
            .collect(Collectors.toList());
        
        for (RolModulo asignacion : asignacionesActuales) {
            repoRolModulo.deleteById(asignacion.getIdRolModulo());
        }
        System.out.println("🗑️ Eliminadas " + asignacionesActuales.size() + " asignaciones previas");

        // Crear nuevas asignaciones para los módulos solicitados
        if (request.getModulosAsignados() != null && !request.getModulosAsignados().isEmpty()) {
            for (Long idModulo : request.getModulosAsignados()) {
                // Verificar que el módulo existe
                Optional<Modulos> moduloOpt = repoModulos.findById(idModulo);
                if (moduloOpt.isEmpty()) {
                    System.err.println("⚠️ Módulo no encontrado: " + idModulo);
                    continue;
                }

                RolModulo nuevaAsignacion = new RolModulo();
                nuevaAsignacion.setIdRol(rol);
                nuevaAsignacion.setIdModulo(moduloOpt.get());
                nuevaAsignacion.setEstado(1);
                
                repoRolModulo.save(nuevaAsignacion);
                System.out.println("✅ Módulo " + idModulo + " asignado al rol " + idRol);
            }
        }

        return ResponseEntity.ok(new java.util.HashMap<String, String>() {{
            put("mensaje", "Módulos asignados correctamente al rol");
        }});
    }
}