# PERMISOS FUNCIONALES - GUÍA COMPLETA

## EL PROBLEMA
Los permisos tenían que ser SOLO en UI (mostrar/ocultar botones).
Ahora necesitan ser FUNCIONALES (validar en backend).

---

## SOLUCIÓN = 3 PARTES

### PARTE 1️⃣: BD - Agregar Permisos Reales

```sql
-- 1. Verificar módulos y sus IDs
SELECT id_modulo, nombre FROM modulos WHERE estado = 1;
-- Resultado esperado:
-- id_modulo | nombre
-- 5         | ALUMNOS
-- 6         | MATRICULAS  
-- 7         | EVALUACIONES Y NOTAS
-- etc.

-- 2. Agregar permisos para cada módulo
-- ALUMNOS
INSERT INTO permisos (id_modulo, codigo, nombre, descripcion, estado) VALUES
(5, 'VER', 'Ver Alumnos', 'Puede ver listado de alumnos', 1),
(5, 'CREAR', 'Crear Alumno', 'Puede crear nuevo alumno', 1),
(5, 'EDITAR', 'Editar Alumno', 'Puede editar datos del alumno', 1),
(5, 'ELIMINAR', 'Eliminar Alumno', 'Puede eliminar alumno', 1),
(5, 'EXPORTAR', 'Exportar Alumnos', 'Puede exportar datos', 1),
(5, 'REPORTES', 'Ver Reportes', 'Puede ver reportes', 1);

-- MATRICULAS
INSERT INTO permisos (id_modulo, codigo, nombre, descripcion, estado) VALUES
(6, 'VER', 'Ver Matrículas', 'Puede ver matrículas', 1),
(6, 'CREAR', 'Crear Matrícula', 'Puede crear nueva matrícula', 1),
(6, 'EDITAR', 'Editar Matrícula', 'Puede editar matrícula', 1),
(6, 'ELIMINAR', 'Eliminar Matrícula', 'Puede eliminar matrícula', 1);

-- EVALUACIONES Y NOTAS
INSERT INTO permisos (id_modulo, codigo, nombre, descripcion, estado) VALUES
(7, 'VER', 'Ver Evaluaciones', 'Puede ver evaluaciones', 1),
(7, 'CALIFICAR', 'Calificar', 'Puede ingresar calificaciones', 1),
(7, 'EDITAR', 'Editar Calificación', 'Puede editar calificaciones', 1),
(7, 'REVISAR', 'Revisar Calificaciones', 'Puede revisar calificaciones', 1);

-- 3. Asignar permisos a roles
-- Profesor puede VER, CREAR, EDITAR (pero NO ELIMINAR ni EXPORTAR)
INSERT INTO rol_modulo_permiso (id_rol, id_modulo, id_permiso, estado) VALUES
(2, 5, 1, 1),  -- PROFESOR - VER alumnos
(2, 5, 2, 1),  -- PROFESOR - CREAR alumnos
(2, 5, 3, 1);  -- PROFESOR - EDITAR alumnos
-- (2, 5, 4, 0) - NO ELIMINAR
-- (2, 5, 5, 0) - NO EXPORTAR
-- (2, 5, 6, 0) - NO REPORTES

-- Verificar asignaciones
SELECT r.nombre as Rol, m.nombre as Modulo, p.codigo as Permiso, rmp.estado
FROM rol_modulo_permiso rmp
JOIN roles r ON rmp.id_rol = r.id_rol
JOIN modulos m ON rmp.id_modulo = m.id_modulo
JOIN permisos p ON rmp.id_permiso = p.id_permiso
WHERE r.nombre = 'PROFESOR' AND m.nombre = 'ALUMNOS'
ORDER BY p.codigo;
```

---

### PARTE 2️⃣: BACKEND - Validación Funcional

#### A) Anotación @RequierePermiso (Ya creada)
```java
@RequierePermiso(idModulo = 5, codigo = "CREAR")
```

#### B) En cada controlador, agregar la anotación:

```java
@RestController
@RequestMapping("/restful/alumnos")
public class AlumnosController {

    // ✅ Ver alumnos
    @GetMapping
    @RequierePermiso(idModulo = 5, codigo = "VER")
    public ResponseEntity<?> obtenerAlumnos() {
        return ResponseEntity.ok(alumnoService.obtenerTodos());
    }

    // ✅ Crear alumno
    @PostMapping
    @RequierePermiso(idModulo = 5, codigo = "CREAR")
    public ResponseEntity<?> crearAlumno(@RequestBody AlumnoDTO dto) {
        return ResponseEntity.ok(alumnoService.crear(dto));
    }

    // ✅ Editar alumno
    @PutMapping("/{id}")
    @RequierePermiso(idModulo = 5, codigo = "EDITAR")
    public ResponseEntity<?> editarAlumno(@PathVariable Long id, @RequestBody AlumnoDTO dto) {
        return ResponseEntity.ok(alumnoService.actualizar(id, dto));
    }

    // ✅ Eliminar alumno
    @DeleteMapping("/{id}")
    @RequierePermiso(idModulo = 5, codigo = "ELIMINAR")
    public ResponseEntity<?> eliminarAlumno(@PathVariable Long id) {
        alumnoService.eliminar(id);
        return ResponseEntity.ok("Eliminado");
    }

    // ✅ Exportar
    @PostMapping("/exportar")
    @RequierePermiso(idModulo = 5, codigo = "EXPORTAR")
    public ResponseEntity<?> exportarAlumnos() {
        return ResponseEntity.ok(alumnoService.exportarACSV());
    }
}
```

#### Tabla de IDs de Módulos
```
id_modulo | nombre
5         | ALUMNOS
6         | MATRICULAS
7         | EVALUACIONES Y NOTAS
8         | PAGOS Y PENSIONES
... (agregar según tus módulos)
```

---

### PARTE 3️⃣: FRONTEND - Mostrar/Ocultar Botones

Usa el hook `usePermisoModulo` que ya creamos:

```tsx
import { usePermisoModulo } from '@/hooks/usePermisoModulo';

function AlumnosPage() {
  const puedeVer = usePermisoModulo(5, 'VER');
  const puedeCrear = usePermisoModulo(5, 'CREAR');
  const puedeEditar = usePermisoModulo(5, 'EDITAR');
  const puedeEliminar = usePermisoModulo(5, 'ELIMINAR');
  const puedeExportar = usePermisoModulo(5, 'EXPORTAR');

  if (!puedeVer) {
    return <div>No tienes permiso para ver alumnos</div>;
  }

  return (
    <div>
      <h1>Alumnos</h1>

      {/* Botones aparecen/desaparecen según permisos */}
      {puedeCrear && (
        <button onClick={handleNuevo}>✏️ Nuevo</button>
      )}
      {puedeEditar && (
        <button onClick={handleEditar}>✏️ Editar</button>
      )}
      {puedeEliminar && (
        <button onClick={handleEliminar} className="danger">🗑️ Eliminar</button>
      )}
      {puedeExportar && (
        <button onClick={handleExportar}>📊 Exportar</button>
      )}

      {/* Tabla de alumnos */}
      <table>
        {/* ... */}
      </table>
    </div>
  );
}
```

---

## CÓMO FUNCIONA AHORA

### Escenario 1: Usuario con permiso
```
1. PROFESOR se loguea
2. Profesor intenta POST /restful/alumnos (crear)
3. Backend:
   ✓ AOP intercepta @RequierePermiso(idModulo=5, codigo="CREAR")
   ✓ Valida rol_modulo_permiso: PROFESOR tiene CREAR en ALUMNOS? ✅ SÍ
   ✓ Permite la request
   ✓ Alumno se crea exitosamente
4. Response: ✅ 200 OK { idAlumno: 123, nombre: "Juan" }
```

### Escenario 2: Usuario SIN permiso
```
1. PROFESOR se loguea
2. Profesor intenta DELETE /restful/alumnos/1 (eliminar)
3. Backend:
   ✓ AOP intercepta @RequierePermiso(idModulo=5, codigo="ELIMINAR")
   ✓ Valida rol_modulo_permiso: PROFESOR tiene ELIMINAR en ALUMNOS? ❌ NO
   ✗ BLOQUEA LA REQUEST
4. Response: ❌ 403 FORBIDDEN { error: "No tienes permiso para: ELIMINAR" }
```

### Escenario 3: Manipulación de localStorage (NO funciona)
```
1. Usuario manipula Frontend para "ver" el botón ELIMINAR
   (modificando localStorage o debugger)
2. Usuario hace click en botón ELIMINAR (aunque no debería verlo)
3. Backend:
   ✗ AOP válida: ¿tiene ELIMINAR? NO
   ✗ BLOQUEA la request
4. Response: ❌ 403 FORBIDDEN

CONCLUSIÓN: Incluso si usuario manipula el frontend,
el backend siempre valida los permisos reales de la BD.
```

---

## PASO A PASO PARA IMPLEMENTAR

### Para Alumnos (id_modulo = 5):
1. ✅ Insertar permisos en BD (SQL arriba)
2. ✅ Agregar `@RequierePermiso` a cada endpoint en AlumnosController
3. ✅ Ya existe `usePermisoModulo` hook en frontend
4. ✅ Ya existe UI con permisos (PermisosPage)
5. ✅ IE Admin asigna permisos a roles en Configuración → Permisos

### Para Matriculas (id_modulo = 6):
1. Insertar permisos en BD (igual patrón)
2. Agregar `@RequierePermiso` a MatriculasController
3. Usar `usePermisoModulo(6, 'CREAR')` en frontend
4. Listo

### Para Evaluaciones (id_modulo = 7):
1. Insertar permisos en BD
2. Agregar `@RequierePermiso` a EvaluacionesController
3. Usar `usePermisoModulo(7, 'CALIFICAR')` en frontend
4. Listo

---

## VENTAJAS AHORA

✅ **Permisos FUNCIONALES** - Backend valida, no solo UI
✅ **Seguro** - Aunque manipulen frontend, backend siempre valida
✅ **Dinámico** - Agregar/cambiar permisos sin recompilar
✅ **Reutilizable** - Mismo patrón para todos los módulos
✅ **Auditable** - BD registra todos los cambios de permisos
✅ **Escalable** - Agregar nuevos permisos en minutos

---

## CHECKLIST DE IMPLEMENTACIÓN

- [ ] Insertar permisos en BD (SQL)
- [ ] Agregar `@RequierePermiso` a AlumnosController
- [ ] Agregar `@RequierePermiso` a MatriculasController
- [ ] Agregar `@RequierePermiso` a EvaluacionesController
- [ ] Agregar `@RequierePermiso` a PagosController
- [ ] Agregar `@RequierePermiso` a otros controllers según necesites
- [ ] IE Admin usa Configuración → Permisos para asignar
- [ ] Compilar backend: `mvnw clean package`
- [ ] Testear en Postman con diferentes roles
