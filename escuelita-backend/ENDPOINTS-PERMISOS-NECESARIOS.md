/**
 * ENDPOINTS NECESARIOS PARA GESTIÓN DE PERMISOS EN SUPERADMIN
 * 
 * El frontend está listo, pero necesita estos endpoints en el backend.
 * Implementa estos en PermisosController.java
 */

// ============================================
// 1. GET /restful/modulos/con-permisos
// ============================================
// Propósito: Obtener todos los módulos con sus permisos configurados
// Retorna: Array<ModuloConPermisos>

Respuesta esperada:
[
  {
    "idModulo": 5,
    "nombre": "ALUMNOS",
    "descripcion": "Gestión de alumnos",
    "permisos": [
      {
        "idPermiso": 15,
        "codigo": "VER",
        "nombre": "Ver alumnos",
        "descripcion": "Ver listado y detalles",
        "idModulo": 5,
        "estado": 1
      },
      {
        "idPermiso": 16,
        "codigo": "CREAR",
        "nombre": "Crear alumno",
        "descripcion": "Crear nuevo registro",
        "idModulo": 5,
        "estado": 1
      }
    ],
    "estado": 1
  },
  {
    "idModulo": 7,
    "nombre": "EVALUACIONES Y NOTAS",
    "descripcion": "Gestión de evaluaciones",
    "permisos": [
      {
        "idPermiso": 25,
        "codigo": "VER",
        "nombre": "Ver evaluaciones",
        "descripcion": "Ver listado de evaluaciones",
        "idModulo": 7,
        "estado": 1
      },
      {
        "idPermiso": 26,
        "codigo": "CALIFICAR",
        "nombre": "Ingresar calificaciones",
        "descripcion": "Agregar y modificar calificaciones",
        "idModulo": 7,
        "estado": 1
      }
    ],
    "estado": 1
  }
]

Query SQL:
SELECT 
  m.id_modulo,
  m.nombre,
  m.descripcion,
  m.estado,
  p.id_permiso,
  p.codigo,
  p.nombre as nombre_permiso,
  p.descripcion as descripcion_permiso,
  p.estado as estado_permiso
FROM modulos m
LEFT JOIN permisos p ON m.id_modulo = p.id_modulo AND p.estado = 1
WHERE m.estado = 1
ORDER BY m.orden, p.codigo;

// ============================================
// 2. GET /restful/modulos/{idModulo}/permisos
// ============================================
// Propósito: Obtener SOLO los permisos de un módulo específico
// Parámetro: idModulo (ej: 5)
// Retorna: Array<Permiso>

Respuesta esperada:
[
  {
    "idPermiso": 15,
    "codigo": "VER",
    "nombre": "Ver alumnos",
    "descripcion": "Ver listado y detalles",
    "idModulo": 5,
    "estado": 1
  },
  {
    "idPermiso": 16,
    "codigo": "CREAR",
    "nombre": "Crear alumno",
    "descripcion": "Crear nuevo registro",
    "idModulo": 5,
    "estado": 1
  }
]

Query SQL:
SELECT * FROM permisos WHERE id_modulo = ? AND estado = 1;

// ============================================
// 3. POST /restful/permisos
// ============================================
// Propósito: Crear NUEVO permiso para un módulo
// Body:
{
  "codigo": "EXPORTAR",
  "nombre": "Exportar datos",
  "descripcion": "Exportar alumnos a Excel o PDF",
  "idModulo": 5
}

// Respuesta:
{
  "idPermiso": 30,
  "codigo": "EXPORTAR",
  "nombre": "Exportar datos",
  "descripcion": "Exportar alumnos a Excel o PDF",
  "idModulo": 5,
  "estado": 1
}

Java:
@PostMapping("/permisos")
public ResponseEntity<?> crearPermiso(@RequestBody PermisoDTO dto) {
  // 1. Validar que idModulo existe
  // 2. Validar que codigo no sea duplicado (case-insensitive)
  // 3. Crear nuevo Permiso con estado = 1
  // 4. Guardar en BD
  // 5. Retornar Permiso creado con idPermiso
}

// ============================================
// 4. PUT /restful/permisos/{idPermiso}
// ============================================
// Propósito: Actualizar permiso existente
// Parámetro: idPermiso (ej: 15)
// Body:
{
  "codigo": "VER_ACTUALIZADO",
  "nombre": "Ver alumnos actualizado",
  "descripcion": "Nueva descripción"
}

// Respuesta:
{
  "idPermiso": 15,
  "codigo": "VER_ACTUALIZADO",
  "nombre": "Ver alumnos actualizado",
  "descripcion": "Nueva descripción",
  "idModulo": 5,
  "estado": 1
}

Java:
@PutMapping("/permisos/{idPermiso}")
public ResponseEntity<?> actualizarPermiso(
  @PathVariable Long idPermiso,
  @RequestBody PermisoDTO dto
) {
  // 1. Buscar Permiso por idPermiso
  // 2. Actualizar campos (codigo, nombre, descripcion)
  // 3. Guardar en BD
  // 4. Retornar Permiso actualizado
}

// ============================================
// 5. DELETE /restful/permisos/{idPermiso}
// ============================================
// Propósito: Eliminar (soft delete) permiso
// Parámetro: idPermiso (ej: 15)

Java:
@DeleteMapping("/permisos/{idPermiso}")
public ResponseEntity<?> eliminarPermiso(@PathVariable Long idPermiso) {
  // 1. Buscar Permiso por idPermiso
  // 2. Establecer estado = 0 (soft delete)
  // 3. Guardar en BD
  // 4. Retornar mensaje de éxito
}

Respuesta esperada:
{
  "mensaje": "Permiso eliminado correctamente"
}

// ============================================
// DTOs NECESARIOS
// ============================================

public class PermisoDTO {
  private String codigo;
  private String nombre;
  private String descripcion;
  private Long idModulo;
  
  // getters y setters
}

public class ModuloConPermisosDTO {
  private Long idModulo;
  private String nombre;
  private String descripcion;
  private List<Permiso> permisos;
  private Integer estado;
  
  // getters y setters
}

// ============================================
// CONSIDERACIONES
// ============================================

✅ Usar Soft Delete (estado = 0, no eliminar físicamente)
✅ Códigos de permiso: case-insensitive pero guardar en MAYÚSCULAS
✅ Validar que no haya valores nulos en campos requeridos
✅ Validar que idModulo exista antes de crear permiso
✅ No permitir duplicar (codigo + idModulo) = unique constraint
✅ Retornar 404 si idPermiso o idModulo no existe
✅ Logging de todas las operaciones (crear, actualizar, eliminar)
✅ Usar patrones same del resto del código (Hibernate, repositorios, servicios)

// ============================================
// TABLA permisos (Referencia BD)
// ============================================

CREATE TABLE permisos (
  id_permiso BIGINT PRIMARY KEY AUTO_INCREMENT,
  codigo VARCHAR(50) NOT NULL,                    -- VER, CREAR, EDITAR, etc.
  nombre VARCHAR(100) NOT NULL,                  -- "Ver alumnos"
  descripcion VARCHAR(255),                      -- "Permite ver..."
  id_modulo BIGINT NOT NULL,
  estado TINYINT DEFAULT 1,                      -- 1=activo, 0=eliminado
  CONSTRAINT fk_permiso_modulo FOREIGN KEY (id_modulo) 
    REFERENCES modulos(id_modulo),
  CONSTRAINT unique_codigo_modulo UNIQUE (codigo, id_modulo)
);

// ============================================
