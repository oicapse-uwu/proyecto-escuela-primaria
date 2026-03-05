/*
    Este controlador maneja las relaciones entre Roles, Módulos y Permisos, 
    incluyendo la obtención y actualización de la matriz completa 
    de asignaciones para un rol específico. 
    Se implementa una estrategia de "soft delete" para evitar 
    conflictos de duplicados al actualizar en lote. 
    Además, se agregan logs detallados para facilitar 
    la depuración y seguimiento de las operaciones.
*/
package com.escuelita.www.controller;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.Map;
import java.util.LinkedHashMap;

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
import com.escuelita.www.entity.MatrizRolDTO;
import com.escuelita.www.entity.MatrizModuloDTO;
import com.escuelita.www.entity.PermisoAsignadoDTO;
import com.escuelita.www.entity.ActualizarMatrizRolDTO;
import com.escuelita.www.entity.ModuloPermisosActualizarDTO;
import com.escuelita.www.repository.ModulosRepository;
import com.escuelita.www.repository.PermisosRepository;
import com.escuelita.www.repository.RolesRepository;
import com.escuelita.www.repository.RolModuloPermisoRepository;
import com.escuelita.www.repository.UsuariosRepository;
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
    @Autowired
    private UsuariosRepository repoUsuarios;
    @Autowired
    private RolModuloPermisoRepository repoRolModuloPermiso;

    @GetMapping("/rolmodulopermiso")
    public List<RolModuloPermiso> buscarTodos() {
        return serviceRmp.buscarTodos();
    }
    @GetMapping("/rolmodulopermiso/sede/{idSede}")
    public List<RolModuloPermiso> buscarPorSede(@PathVariable Long idSede) {
        List<Long> roleIds = repoUsuarios.findByIdSedeIdSede(idSede).stream()
            .map(usuario -> usuario.getIdRol())
            .filter(rol -> rol != null)
            .map(rol -> rol.getIdRol())
            .distinct()
            .collect(Collectors.toList());

        if (roleIds.isEmpty()) {
            return java.util.Collections.emptyList();
        }

        return serviceRmp.buscarPorRoles(roleIds);
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

    // FASE 2: SuperAdmin obtiene la MATRIZ COMPLETA de un rol específico

    // Retorna todos los módulos con todos los permisos + estado de asignación
    @GetMapping("/roles/{idRol}/matriz-completa")
    public ResponseEntity<?> obtenerMatrizCompleta(@PathVariable Long idRol) {
        System.out.println("\n========== OBTENER MATRIZ COMPLETA ==========");
        System.out.println("📥 Solicitada matriz para rol ID: " + idRol);
        
        Optional<Roles> rolOpt = repoRoles.findById(idRol);
        if (rolOpt.isEmpty()) {
            System.out.println("❌ Rol no encontrado: " + idRol);
            return ResponseEntity.badRequest().body("Rol no encontrado");
        }

        Roles rol = rolOpt.get();
        System.out.println("✓ Rol encontrado: " + rol.getNombre());
        
        List<Modulos> modulos = repoModulos.findAll();
        System.out.println("📊 Total módulos en BD: " + modulos.size());
        
        // Obtener TODAS las asignaciones (activas e inactivas) para mostrar el estado actual
        List<RolModuloPermiso> asignaciones = repoRolModuloPermiso.findByIdRolActivos(idRol);
        // Filtrar solo las activas (estado=1) para mostrar
        List<RolModuloPermiso> asignacionesActivas = asignaciones.stream()
            .filter(a -> a.getEstado() == 1)
            .collect(java.util.stream.Collectors.toList());
        System.out.println("🔍 Asignaciones ACTIVAS encontradas para rol " + idRol + ": " + asignacionesActivas.size() + " (Total registros: " + asignaciones.size() + ")");
        
        // Imprimir cada asignación activa encontrada
        for (RolModuloPermiso rmp : asignacionesActivas) {
            System.out.println("  ✓ Módulo " + rmp.getIdModulo().getNombre() + " -> Permiso " + rmp.getIdPermiso().getNombre());
        }

        // Crear mapa de permisos asignados: modulo_id -> permiso_id
        Map<Long, Map<Long, Boolean>> permisosAsignados = new LinkedHashMap<>();
        for (RolModuloPermiso rmp : asignaciones) {
            Long idModulo = rmp.getIdModulo().getIdModulo();
            Long idPermiso = rmp.getIdPermiso().getIdPermiso();
            
            if (!permisosAsignados.containsKey(idModulo)) {
                permisosAsignados.put(idModulo, new LinkedHashMap<>());
            }
            permisosAsignados.get(idModulo).put(idPermiso, true);
        }

        // Construir DTOs
        List<MatrizModuloDTO> modulosDTO = new java.util.ArrayList<>();
        
        for (Modulos modulo : modulos) {
            List<Permisos> permisosModulo = repoPermisos.findByIdModulo_IdModulo(modulo.getIdModulo());
            List<PermisoAsignadoDTO> permisosDTOList = new java.util.ArrayList<>();

            for (Permisos permiso : permisosModulo) {
                Boolean asignado = permisosAsignados.getOrDefault(modulo.getIdModulo(), new LinkedHashMap<>())
                        .getOrDefault(permiso.getIdPermiso(), false);
                
                permisosDTOList.add(new PermisoAsignadoDTO(
                    permiso.getIdPermiso(),
                    permiso.getNombre(),
                    permiso.getCodigo(),
                    permiso.getDescripcion(),
                    asignado
                ));
            }

            modulosDTO.add(new MatrizModuloDTO(
                modulo.getIdModulo(),
                modulo.getNombre(),
                modulo.getDescripcion(),
                modulo.getIcono(),
                modulo.getOrden(),
                permisosDTOList
            ));
        }

        MatrizRolDTO respuesta = new MatrizRolDTO(rol.getIdRol(), rol.getNombre(), modulosDTO);
        System.out.println("✅ Retornando matriz con " + modulosDTO.size() + " módulos");
        System.out.println("==============================================\n");
        return ResponseEntity.ok(respuesta);
    }

    // FASE 2: SuperAdmin actualiza la MATRIZ COMPLETA de un rol en LOTE

    // Estrategia: SOFT DELETE (estado=0) los anteriores, luego INSERTAR los nuevos
    // Ignora duplicados en lugar de fallar
    @PostMapping("/roles/{idRol}/matriz-completa")
    public ResponseEntity<?> actualizarMatrizCompleta(@PathVariable Long idRol, 
                                                      @RequestBody(required = false) ActualizarMatrizRolDTO dto) {
        System.out.println("\n========== ACTUALIZAR MATRIZ COMPLETA ==========");
        System.out.println("📥 Rol ID: " + idRol);
        System.out.println("📦 DTO: " + (dto != null ? "Presente" : "NULO"));
        
        if (dto == null) {
            System.out.println("❌ ERROR: DTO es nulo");
            return ResponseEntity.badRequest().body("Error: DTO es nulo");
        }
        
        System.out.println("📋 Módulos en DTO: " + (dto.getModulos() != null ? dto.getModulos().size() : "NULL"));
        
        if (dto.getModulos() == null || dto.getModulos().isEmpty()) {
            System.out.println("⚠️ Sin módulos - se desasignarán todos los permisos");
        }

        Optional<Roles> rolOpt = repoRoles.findById(idRol);
        if (rolOpt.isEmpty()) {
            System.out.println("❌ Rol no encontrado: " + idRol);
            return ResponseEntity.badRequest().body("Error: Rol no encontrado con ID: " + idRol);
        }

        try {
            Roles rol = rolOpt.get();
            System.out.println("✓ Rol encontrado: " + rol.getNombre());
            
            System.out.println("\n🔄 PASO 1: Buscar TODAS las asignaciones previas (activas e inactivas)...");
            List<RolModuloPermiso> asignacionesActuales = repoRolModuloPermiso.findByIdRolActivos(idRol);
            System.out.println("📊 Encontradas: " + asignacionesActuales.size() + " registros (se desactivarán todos)");
            
            // SOFT DELETE: Marcar TODAS como inactivas (incluyendo las que ya lo son)
            for (RolModuloPermiso rmp : asignacionesActuales) {
                if (rmp.getEstado() == 1) {
                    rmp.setEstado(0);
                    serviceRmp.modificar(rmp);
                }
            }
            System.out.println("✅ Desactivadas (ahora se puede reinsertar sin conflictos duplicados)");

            int totalAsignacionesCreadas = 0;
            int totalReactivados = 0;
            
            if (dto.getModulos() != null && !dto.getModulos().isEmpty()) {
                System.out.println("\n🔄 PASO 2: Procesando " + dto.getModulos().size() + " módulos...");
                
                for (ModuloPermisosActualizarDTO moduloDTO : dto.getModulos()) {
                    if (moduloDTO == null || moduloDTO.getIdModulo() == null) {
                        System.out.println("  ⚠️ ModuloDTO nulo, saltando");
                        continue;
                    }
                    
                    Long idModulo = moduloDTO.getIdModulo();
                    List<Long> idPermisos = moduloDTO.getIdPermisos();
                    
                    if (idPermisos == null || idPermisos.isEmpty()) {
                        System.out.println("  ⚠️ Módulo " + idModulo + " sin permisos, saltando");
                        continue;
                    }
                    
                    Optional<Modulos> moduloOpt = repoModulos.findById(idModulo);
                    if (moduloOpt.isEmpty()) {
                        System.out.println("  ❌ Módulo no existe: " + idModulo);
                        continue;
                    }

                    Modulos modulo = moduloOpt.get();
                    System.out.println("  📍 " + modulo.getNombre() + " (" + idPermisos.size() + " permisos)");
                    
                    for (Long idPermiso : idPermisos) {
                        try {
                            Optional<Permisos> permisoOpt = repoPermisos.findById(idPermiso);
                            if (permisoOpt.isEmpty()) {
                                System.out.println("    ⚠️ Permiso no existe: " + idPermiso);
                                continue;
                            }

                            List<RolModuloPermiso> existentes = repoRolModuloPermiso
                                .findByIdRol_IdRolAndIdModulo_IdModuloAndIdPermiso_IdPermiso(
                                    idRol, idModulo, idPermiso);
                            
                            if (!existentes.isEmpty()) {
                                RolModuloPermiso existente = existentes.get(0);
                                if (existente.getEstado() == 0) {
                                    existente.setEstado(1);
                                    serviceRmp.modificar(existente);
                                    totalReactivados++;
                                }
                            } else {
                                RolModuloPermiso rmp = new RolModuloPermiso();
                                rmp.setIdRol(rol);
                                rmp.setIdModulo(modulo);
                                rmp.setIdPermiso(permisoOpt.get());
                                rmp.setEstado(1);
                                serviceRmp.guardar(rmp);
                                totalAsignacionesCreadas++;
                            }
                        } catch (Exception e) {
                            System.out.println("    ❌ Error con permiso " + idPermiso + ": " + e.getMessage());
                        }
                    }
                }
            }

            System.out.println("\n✅ ÉXITO: " + totalAsignacionesCreadas + " nuevos, " + totalReactivados + " reactivados");
            
            Map<String, Object> respuesta = new java.util.HashMap<>();
            respuesta.put("mensaje", "Matriz actualizada");
            respuesta.put("nuevos", totalAsignacionesCreadas);
            respuesta.put("reactivados", totalReactivados);
            
            System.out.println("=============================================\n");
            return ResponseEntity.ok(respuesta);
            
        } catch (Exception e) {
            System.err.println("\n❌ ERROR EN ACTUALIZACIÓN");
            System.err.println("Tipo: " + e.getClass().getSimpleName());
            System.err.println("Mensaje: " + e.getMessage());
            if (e.getCause() != null) {
                System.err.println("Causa: " + e.getCause().getMessage());
            }
            e.printStackTrace();
            System.err.println("=============================================\n");
            
            return ResponseEntity.status(500).body(
                "Error: " + e.getClass().getSimpleName() + " - " + e.getMessage()
            );
        }
    }
}