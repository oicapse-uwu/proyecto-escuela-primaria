package com.escuelita.www.security;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * ANOTACIÓN PARA VALIDAR PERMISOS
 * 
 * Usa en todo controlador que necesite validar permiso
 * 
 * Ejemplos:
 * 
 *   @PostMapping
 *   @RequierePermiso(idModulo = 5, codigo = "CREAR")
 *   public void crearAlumno(AlumnoDTO dto) { }
 * 
 *   @PutMapping("/{id}")
 *   @RequierePermiso(idModulo = 5, codigo = "EDITAR")
 *   public void editarAlumno(@PathVariable Long id, AlumnoDTO dto) { }
 * 
 *   @DeleteMapping("/{id}")
 *   @RequierePermiso(idModulo = 5, codigo = "ELIMINAR")
 *   public void eliminarAlumno(@PathVariable Long id) { }
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface RequierePermiso {
    
    /**
     * ID del módulo (ej: 5 para ALUMNOS, 6 para MATRICULAS)
     */
    int idModulo();
    
    /**
     * Código del permiso (ej: VER, CREAR, EDITAR, ELIMINAR, EXPORTAR)
     */
    String codigo();
}
