// Revisado
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

    /**
     * FASE 2: SuperAdmin obtiene la MATRIZ COMPLETA de un rol específico
     * Retorna todos los módulos con todos los permisos + estado de asignación
     */
    @GetMapping("/roles/{idRol}/matriz-completa")
    public ResponseEntity<?> obtenerMatrizCompleta(@PathVariable Long idRol) {
        Optional<Roles> rolOpt = repoRoles.findById(idRol);
        if (rolOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Rol no encontrado");
        }

        Roles rol = rolOpt.get();
        List<Modulos> modulos = repoModulos.findAll();
        // 🔴 IMPORTANTE: Usar findByIdRolActivos que SOLO obtiene estado=1
        List<RolModuloPermiso> asignaciones = repoRolModuloPermiso.findByIdRolActivos(idRol);

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
        return ResponseEntity.ok(respuesta);
    }

    /**
     * FASE 2: SuperAdmin actualiza la MATRIZ COMPLETA de un rol en LOTE
     * Estrategia: SOFT DELETE (estado=0) los anteriores, luego INSERTAR los nuevos
     * Ignora duplicados en lugar de fallar
     */
    @PostMapping("/roles/{idRol}/matriz-completa")
    public ResponseEntity<?> actualizarMatrizCompleta(@PathVariable Long idRol, 
                                                      @RequestBody ActualizarMatrizRolDTO dto) {
        System.out.println("📥 Recibiendo actualización de matriz para rol: " + idRol);
        System.out.println("📦 DTO recibido: " + (dto != null ? "presente" : "nulo"));
        
        if (dto == null) {
            return ResponseEntity.badRequest().body("Error: DTO es nulo");
        }
        
        if (dto.getModulos() == null) {
            return ResponseEntity.badRequest().body("Error: Lista de módulos es nula");
        }

        Optional<Roles> rolOpt = repoRoles.findById(idRol);
        if (rolOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Error: Rol no encontrado con ID: " + idRol);
        }

        try {
            System.out.println("🔄 PASO 1: Limpiando registros con estado=0 (hard delete para no bloquear constraint)...");
            // Eliminar FÍSICAMENTE los registros borrados lógicamente (estado=0)
            // para no bloquear el constraint UNIQUE al insertar nuevos
            repoRolModuloPermiso.deleteByIdRol_IdRolAndEstadoCero(idRol);
            System.out.println("✅ Registros borrados lógicamente limpiados");

            System.out.println("🔄 PASO 2: Marcando asignaciones ACTIVAS como eliminadas (soft delete)...");
            // PASO 2: Obtener SOLO asignaciones ACTIVAS (estado=1)
            List<RolModuloPermiso> asignacionesActuales = repoRolModuloPermiso.findByIdRolActivos(idRol);
            System.out.println("📊 Asignaciones ACTIVAS encontradas: " + asignacionesActuales.size());
            
            // Soft delete - marcar como estado=0
            for (RolModuloPermiso rmp : asignacionesActuales) {
                rmp.setEstado(0);  
                serviceRmp.modificar(rmp);
            }
            System.out.println("✅ Asignaciones activas marcadas como eliminadas");

            // PASO 3: Crear nuevas asignaciones basadas en la solicitud
            Roles rol = rolOpt.get();
            System.out.println("✅ Creando nuevas asignaciones. Módulos a procesar: " + dto.getModulos().size());
            
            int totalAsignacionesCreadas = 0;
            
            for (ModuloPermisosActualizarDTO moduloDTO : dto.getModulos()) {
                if (moduloDTO.getIdModulo() == null || moduloDTO.getIdPermisos() == null) {
                    System.out.println("⚠️ Módulo o permisos nulos, saltando...");
                    continue;
                }
                
                Optional<Modulos> moduloOpt = repoModulos.findById(moduloDTO.getIdModulo());
                if (moduloOpt.isEmpty()) {
                    System.out.println("⚠️ Módulo no encontrado: " + moduloDTO.getIdModulo());
                    continue;
                }

                Modulos modulo = moduloOpt.get();
                System.out.println("📝 Procesando módulo: " + modulo.getNombre() + " con " + moduloDTO.getIdPermisos().size() + " permisos");
                
                for (Long idPermiso : moduloDTO.getIdPermisos()) {
                    Optional<Permisos> permisoOpt = repoPermisos.findById(idPermiso);
                    if (permisoOpt.isEmpty()) {
                        System.out.println("⚠️ Permiso no encontrado: " + idPermiso);
                        continue;
                    }

                    RolModuloPermiso rmp = new RolModuloPermiso();
                    rmp.setIdRol(rol);
                    rmp.setIdModulo(modulo);
                    rmp.setIdPermiso(permisoOpt.get());
                    rmp.setEstado(1);
                    serviceRmp.guardar(rmp);
                    System.out.println("✨ Nuevo: rol=" + idRol + ", mod=" + moduloDTO.getIdModulo() + ", perm=" + idPermiso);
                    totalAsignacionesCreadas++;
                }
            }

            System.out.println("✅ Actualización completada. Total asignaciones nuevas: " + totalAsignacionesCreadas);
            return ResponseEntity.ok("{\"mensaje\": \"Matriz del rol actualizada correctamente\", \"actualizadas\": " + totalAsignacionesCreadas + "}");
        } catch (Exception e) {
            System.err.println("❌ Error al actualizar matriz: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error interno: " + e.getClass().getSimpleName() + " - " + e.getMessage());
        }
    }
}