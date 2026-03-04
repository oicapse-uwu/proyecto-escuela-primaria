# GUÍA RÁPIDA - PERMISOS FUNCIONALES (3 PASOS)

## El Usuario pregunta: "¿Cómo exactamente agrego esos permisos?"

**RESPUESTA:** Son 3 pasos simples:

---

## PASO 1️⃣: BD - Agregar Permisos Reales

**¿QUÉ HAGO?** Ejecuto SQL para crear permisos

**SQL:**
```sql
-- Ver qué módulos tienes
SELECT * FROM modulos WHERE estado = 1;

-- EJEMPLO: Agregar permisos para ALUMNOS (id_modulo = 5)
INSERT INTO permisos (id_modulo, codigo, nombre, descripcion, estado) VALUES
(5, 'VER', 'Ver Alumnos', 'Permite ver listado', 1),
(5, 'CREAR', 'Crear Alumno', 'Permite crear nuevo', 1),
(5, 'EDITAR', 'Editar Alumno', 'Permite editar', 1),
(5, 'ELIMINAR', 'Eliminar Alumno', 'Permite eliminar', 1),
(5, 'EXPORTAR', 'Exportar Datos', 'Permite exportar', 1),
(5, 'REPORTES', 'Ver Reportes', 'Permite reportes', 1);
```

**RESULTADO:** Tabla `permisos` ahora tiene 6 filas para ALUMNOS

---

## PASO 2️⃣: BACKEND - Validar Permisos en Endpoints

**¿QUÉ HAGO?** Agrego 1 línea a cada método en el controlador

**ANTES (sin validación):**
```java
@PostMapping
public ResponseEntity<?> crearAlumno(@RequestBody AlumnoDTO dto) {
    return ResponseEntity.ok(alumnoService.crear(dto));
}
```

**DESPUÉS (con validación):**
```java
@PostMapping
@RequierePermiso(idModulo = 5, codigo = "CREAR")  ← AGREGAR ESTO
public ResponseEntity<?> crearAlumno(@RequestBody AlumnoDTO dto) {
    return ResponseEntity.ok(alumnoService.crear(dto));
}
```

**EN TODOS LOS MÉTODOS:**
```java
@GetMapping                                          //  VER
@RequierePermiso(idModulo = 5, codigo = "VER")
public ResponseEntity<?> obtener() { }

@PostMapping                                         // CREAR
@RequierePermiso(idModulo = 5, codigo = "CREAR")
public ResponseEntity<?> crear(@RequestBody DTO d) { }

@PutMapping("/{id}")                                // EDITAR
@RequierePermiso(idModulo = 5, codigo = "EDITAR")
public ResponseEntity<?> editar(@PathVariable Id, @RequestBody DTO d) { }

@DeleteMapping("/{id}")                             // ELIMINAR
@RequierePermiso(idModulo = 5, codigo = "ELIMINAR")
public ResponseEntity<?> eliminar(@PathVariable Long id) { }

@PostMapping("/exportar")                           // EXPORTAR
@RequierePermiso(idModulo = 5, codigo = "EXPORTAR")
public ResponseEntity<?> exportar() { }
```

**RESULTADO:** Backend valida permisos ANTES de ejecutar

---

## PASO 3️⃣: FRONTEND - Mostrar/Ocultar Botones

**¿QUÉ HAGO?** Uso hook `usePermisoModulo` que YA EXISTE

```tsx
import { usePermisoModulo } from '@/hooks/usePermisoModulo';

function AlumnosPage() {
  // ✅ Verificar permisos (1 línea por permiso)
  const puedeCrear = usePermisoModulo(5, 'CREAR');
  const puedeEditar = usePermisoModulo(5, 'EDITAR');
  const puedeEliminar = usePermisoModulo(5, 'ELIMINAR');

  return (
    <div>
      <h1>Alumnos</h1>
      
      {/* Botones aparecen solo si tiene permiso */}
      {puedeCrear && <button>Nuevo Alumno</button>}
      {puedeEditar && <button>Editar</button>}
      {puedeEliminar && <button>Eliminar</button>}
      
      {/* Tabla */}
      <table><tbody>{/* ... */}</tbody></table>
    </div>
  );
}
```

**RESULTADO:** Botones se muestran/ocultan según permisos

---

## CÓMO SE ASIGNAN LOS PERMISOS

1. **IE Admin** va a: **Configuración → Permisos**
2. Selecciona un **Rol** (ej: PROFESOR)
3. Ve los **Módulos** expandibles (ALUMNOS, MATRICULAS, etc.)
4. Entra al **Módulo** (ej: ALUMNOS)
5. Marca/desmarca los **Permisos** (VER, CREAR, EDITAR, etc.)
6. Cambios se guardan **automáticamente** ✅

---

## QUÉ PASA CUANDO USUARIO INTENTA ALGO

### ✅ CASO 1: Usuario TIENE permiso
```
Frontend: Usuario clickea "Nuevo Alumno"
         ↓
Backend: POST /restful/alumnos
         ↓
@RequierePermiso(idModulo=5, codigo="CREAR")
         ↓
Valida: ¿Rol PROFESOR tiene CREAR en ALUMNOS? → ✅ SÍ
         ↓
Resultado: Alumno creado → 200 OK ✅
```

### ❌ CASO 2: Usuario NO tiene permiso
```
Frontend: Usuario (¿O manipuló?) intenta DELETE
         ↓
Backend: DELETE /restful/alumnos/1
         ↓
@RequierePermiso(idModulo=5, codigo="ELIMINAR")
         ↓
Valida: ¿Rol PROFESOR tiene ELIMINAR en ALUMNOS? → ❌ NO
         ↓
Resultado: 403 FORBIDDEN - "No tienes permiso para: ELIMINAR"
```

---

## TABLA RÁPIDA: MÓDULOS Y PERMISOS

```
MÓDULO                ID   PERMISOS SUGERIDOS
──────────────────────────────────────────────────
ALUMNOS               5    VER, CREAR, EDITAR, ELIMINAR, EXPORTAR, REPORTES
MATRICULAS            6    VER, CREAR, EDITAR, ELIMINAR
EVALUACIONES Y NOTAS  7    VER, CALIFICAR, EDITAR, REVISAR
PAGOS Y PENSIONES     8    VER, CREAR, EDITAR, ELIMINAR, REPORTES
INFRAESTRUCTURA       9    VER, CREAR, EDITAR, ELIMINAR
GESTION ACADEMICA     10   VER, CREAR, EDITAR, ELIMINAR
```

---

## ARCHIVOS YA CREADOS PARA TI

```
✅ Backend:
   - /security/RequierePermiso.java (Anotación)
   - /security/PermisosAspect.java (Validador AOP)
   - /security/PermisosSecurityFilter.java (Filtro)
   - RolModuloPermisoRepository.java (Método de validación)

✅ Frontend:
   - /hooks/usePermisoModulo.ts (Hook para verificar)
   - /components/AccionesBotones.tsx (Botones inteligentes)
   - /features/backoffice/usuarios/pages/PermisosPage.tsx (UI Configuración)

✅ Documentación:
   - GUIA-PERMISOS-FUNCIONALES.md (Esta guía)
```

---

## QUÉ TIENES QUE HACER

### 👨‍💻 SOLO PARA BACKEND (30 minutos):
1. [ ] Ejecutar SQL para agregar permisos en BD
2. [ ] Abrir cada Controlador (Alumno, Matricula, Evaluaciones, etc.)
3. [ ] Agregar `@RequierePermiso` a cada método
4. [ ] Compilar: `mvnw clean package`
5. [ ] Probar en Postman con diferentes roles

### 🎨 SOLO PARA FRONTEND (5 minutos POR MÓDULO):
1. [ ] Importar `usePermisoModulo` hook
2. [ ] Agregar: `const puedeCrear = usePermisoModulo(5, 'CREAR');`
3. [ ] Envolver botones: `{puedeCrear && <button>...</button>}`
4. [ ] Compilar: `npm run build`

### 👨‍💼 PARA IE ADMIN (2 minutos):
1. [ ] Ir a: Configuración → Permisos
2. [ ] Seleccionar Rol (ej: PROFESOR)
3. [ ] Seleccionar Permisos para cada módulo
4. [ ] ¡Listo! Ya funciona

---

## VALIDACIÓN FINAL

Cuando todo esté listo:
```bash
# Backend
curl -H "Authorization: Bearer TOKEN_PROFESOR" \
     -X DELETE http://localhost:8080/restful/alumnos/1

# Respuesta si tiene permiso:
# ✅ 200 OK { ... }

# Respuesta si NO tiene permiso:
# ❌ 403 FORBIDDEN { "error": "No tienes permiso para: ELIMINAR" }
```

---

## ¿PREGUNTAS FRECUENTES?

**P: ¿Qué pasa si olvido agregar la anotación?**
R: El endpoint sigue funcionando para TODOS (sin validar)

**P: ¿Si manipulan localStorage, no bypass?**
R: NO, porque el backend siempre valida en la BD

**P: ¿Puedo cambiar permisos sin recompilar?**
R: ✅ SÍ, usando la UI Configuración → Permisos

**P: ¿Se usan en TODOS los controllers?**
R: ✅ SÍ, en cada método que haga cambios (POST/PUT/DELETE/GET)

---

## 🎯 FLUJO COMPLETO VISUAL

```
┌─────────────────────────────────────────────────────────────┐
│  IE Admin en Configuración → Permisos                         │
│  Checkbox: PROFESOR → ALUMNOS → [✓VER ✓CREAR ✗ELIMINAR]   │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ↓
        ┌────────────────────────┐
        │  Tabla BD:             │
        │  rol_modulo_permiso    │
        │  rol_id=2 (PROFESOR)   │
        │  modulo_id=5 (ALUMNOS) │
        │  permiso_id=1 (VER)    │
        └────────────┬───────────┘
                     │
         ┌───────────┴─────────────┐
         │                         │
         ↓                         ↓
   Frontend:                Backend (Postman):
   const puedeCrear =       POST /restful/alumnos
   usePermisoModulo(5,      @RequierePermiso
   'CREAR')                 (idModulo=5,
                            codigo="CREAR")
         │                         │
         ↓                         ↓
   Botón "Nuevo"             Valida BD:
   aparece/desaparece        ¿PROFESOR tiene
   según permiso             CREAR? ✅ SÍ
                             
                             ↓
                             Ejecuta
                             200 OK ✅
```

---

**✅ LISTO! Ahora tienes permisos FUNCIONALES y SEGUROS en tu sistema.**
