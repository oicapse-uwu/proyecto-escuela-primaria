# Guía de Implementación de Módulos - Frontend

## 📋 Resumen
Todos los módulos del portal ya cuentan con protección mediante `ModuloGuard` en sus rutas. **NO necesitas crear nuevas carpetas**. Solo implementa la estructura en tu módulo existente.

---

## 🏗️ Estructura que debe tener cada módulo

Cada módulo en `/src/features/portal/[moduloNombre]/` debe tener:

```
moduloNombre/
├── api/                          # Llamadas HTTP a la API
│   └── [moduloNombre]Api.ts
├── components/                   # Componentes reutilizables del módulo
│   └── [ComponentName].tsx
├── hooks/                        # Custom hooks del módulo
│   ├── use[ModuloNombre].ts
│   └── index.ts
├── pages/                        # Páginas principales
│   ├── [PaginaNombre]Page.tsx
│   └── index.ts (opcional)
├── routes/                       # IMPORTANTE: Aquí va el ModuloGuard
│   └── [ModuloNombre]Routes.tsx  
├── types/                        # Tipos TypeScript
│   └── index.ts
└── index.ts                      # Barrel export
```

---

## 🔐 Paso Crítico: Archivo de Rutas (routes/[ModuloNombre]Routes.tsx)

**Este es el archivo CLAVE que TODOS deben implementar.**

### Estructura Base:

```typescript
import { Route, Routes, Navigate } from 'react-router-dom';
import ModuloGuard from '../../../../hooks/ModuloGuard';
import { escuelaAuthService } from '../../../../services/escuelaAuth.service';

// Importa tus páginas
import [TuPaginaNombre]Page from '../pages/[TuPaginaNombre]Page';

/**
 * Rutas del módulo [TuModulo]
 * 
 * IMPORTANTE: El ModuloGuard protege TODAS las rutas del módulo
 * Si el usuario no tiene acceso al módulo, será redirigido a /escuela/dashboard
 */
const [TuModulo]Routes = () => {
  // Obtén el usuario actual del contexto
  const currentUser = escuelaAuthService.getCurrentUser();
  
  return (
    <ModuloGuard 
      requiereModulo={NUMERO_MODULO}        // ← REEMPLAZA CON TU MÓDULO (ver tabla abajo)
      idUsuario={currentUser?.idUsuario ?? null}
      fallback={<Navigate to="/escuela/dashboard" replace />}
    >
      <Routes>
        <Route path="/" element={<[TuPaginaNombre]Page />} />
        {/* Agrega más rutas según necesites */}
      </Routes>
    </ModuloGuard>
  );
};

export default [TuModulo]Routes;
```

---

## 📊 Tabla de Módulos y sus IDs

| # | Módulo | ID | Ruta en App.tsx | Controladores Backend |
|---|--------|-----|-----------------|----------------------|
| 1 | DASHBOARD | 1 | `/escuela/dashboard` | - |
| 2 | CONFIGURACIÓN | 2 | `/escuela/configuracion/usuarios/*` | InstitucionController, UsuariosController, RolesController, TipoDocumentosController, SedesController, AnioEscolarController, PeriodosController |
| 3 | INFRAESTRUCTURA | 3 | `/escuela/infraestructura/*` | AulasController, GradosController, SeccionesController |
| 4 | GESTIÓN ACADÉMICA | 4 | `/escuela/academica/*` | AreasController, CursosController, HorariosController, AsignacionDocenteController, PerfilDocenteController, MallaCurricularController, EspecialidadesController |
| 5 | ALUMNOS | 5 | `/escuela/alumnos/*`, `/escuela/apoderados/*` | AlumnosController, ApoderadosController, AlumnoApoderadoController |
| 6 | MATRÍCULAS | 6 | `/escuela/matriculas/*` | MatriculasController, DocumentosAlumnoController, RequisitosDocumentosController |
| 7 | EVALUACIONES Y NOTAS | 7 | `/escuela/evaluaciones/*` | CalificacionesController, PromediosPeriodoController, AsistenciasController, TiposNotaController, EvaluacionesController, TiposEvaluacionController |
| 8 | PAGOS Y PENSIONES | 8 | `/escuela/pagos/*` | PagosCajaController, PagoDetalleController, DeudasAlumnoController, ConceptosPagoController, MetodosPagoController |

---

## ✅ Módulos Actualmente Implementados

✅ **Módulo 1 - DASHBOARD**: Dashboard principal en `/escuela/dashboard`

✅ **Módulo 2 - CONFIGURACIÓN**: `/escuela/configuracion/usuarios/*` (usuarios, roles, permisos)

✅ **Módulo 3 - INFRAESTRUCTURA**: `/escuela/infraestructura/*` (aulas, grados, secciones)

✅ **Módulo 4 - GESTIÓN ACADÉMICA**: `/escuela/academica/areas-cursos/*` y `especialidades/*` (áreas, cursos)

✅ **Módulo 5 - ALUMNOS**: `/escuela/alumnos/*` y `/escuela/apoderados/*` (alumnos, apoderados)

✅ **Módulo 6 - MATRÍCULAS**: `/escuela/matriculas/*` (matrículas, requisitos)

---

## 🚀 Módulos Pendientes a Implementar

❌ **Módulo 7 - EVALUACIONES Y NOTAS** 
- Ruta: `/escuela/evaluaciones/*`
- Componentes: Asistencias, Evaluaciones, Calificaciones, Promedios, Tipos de Nota
- ID Módulo: **7**

❌ **Módulo 8 - PAGOS Y PENSIONES**
- Ruta: `/escuela/pagos/*`
- Componentes: Pagos Caja, Deudas, Conceptos de Pago, Métodos de Pago
- ID Módulo: **8**

---

## � ¿Cómo Funciona el Sistema de Permisos de Punta a Punta?

### 1️⃣ **SuperAdmin asigna módulos a roles** (en `/admin`)
   - SuperAdmin entra a `/admin/institucion` → Ve tabla de roles (PROFESOR, etc)
   - Hace click en un rol → Ve lista de módulos
   - Asigna módulos (ej: PROFESOR puede acceder a ALUMNOS, MATRÍCULAS, EVALUACIONES)
   - Guarda en BD: tabla `rol_modulos` (idRol=2, idModulo=5,6,7)

### 2️⃣ **Backend protege endpoints** (ya está hecho ✅)
   - Todos los controladores tienen `@RequireModulo(X)`:
   ```java
   @GetMapping
   @RequireModulo(5)  // Solo si usuario tiene acceso a ALUMNOS
   public List<Alumno> buscar() { ... }
   ```
   - Si usuario intenta acceder sin permiso → **403 Forbidden**
   - API consulta stored procedure: `validarAccesoModuloUsuario(idUsuario, idModulo)`

### 3️⃣ **Frontend carga módulos disponibles** (Hook: `useModulosPermisos`)
   - Usuario entra a `/escuela` → Se ejecuta `useModulosPermisos(idUsuario)`
   - Hook hace petición a: `GET /restful/usuarios/{idUsuario}/modulos-permisos`
   - Backend retorna JSON con módulos asignados:
   ```json
   {
     "idUsuario": 30,
     "nombreRol": "PROFESOR",
     "modulos": [
       { "idModulo": 5, "nombre": "ALUMNOS" },
       { "idModulo": 6, "nombre": "MATRÍCULAS" },
       { "idModulo": 7, "nombre": "EVALUACIONES Y NOTAS" }
     ]
   }
   ```
   - Los datos se guardan en **localStorage** (para robustez)
   - Sidebar usa este hook para mostrar solo módulos disponibles

### 4️⃣ **Frontend protege rutas** (ModuloGuard en routes)
   - Usuario navega a `/escuela/alumnos` (Módulo 5)
   - React renderiza `AlumnosRoutes.tsx` que está envuelto en `<ModuloGuard requiereModulo={5}>`
   - ModuloGuard:
     1. Carga datos del hook `useModulosPermisos`
     2. Llama a `tieneModulo(5)` → busca en state/ref/localStorage
     3. Si tiene acceso → muestra contenido del módulo ✅
     4. Si NO tiene acceso → redirige a `/escuela/dashboard` ❌
   
### 5️⃣ **Si usuario intenta hackear (bypasear frontend)**
   - Llama directamente a API endpoint
   - Backend valida `@RequireModulo` en el controlador
   - Si no tiene permiso → 403 Forbidden
   - `api.config.ts` maneja automáticamente: limpia tokens y redirige a login

**Síntesis:**
```
SuperAdmin asigna módulos → BD { rol_modulos }
                                    ↓
Usuario entra a /escuela → Frontend carga useModulosPermisos → localStorage
                                    ↓
Usuario navega a /escuela/alumnos → ModuloGuard valida tieneModulo(5)
                                    ↓
¿Tiene acceso? → SÍ: muestra contenido | NO: redirige a dashboard
                                    ↓
Si intenta hackear → Backend valida @RequireModulo → 403 si no tiene acceso
```

---

Cuando implementes tu módulo, asegúrate de:

### 1. **Archivo de Rutas** ✓
- [ ] Archivo `routes/[ModuloNombre]Routes.tsx` creado
- [ ] Importa `ModuloGuard` y `escuelaAuthService`
- [ ] Envuelve todas las rutas con `<ModuloGuard requiereModulo={X}>`
- [ ] El ID del módulo es el correcto (ver tabla arriba)
- [ ] Fallback redirige a `/escuela/dashboard`

### 2. **Estructura de Archivos**
- [ ] Carpeta `api/` con archivos de API
- [ ] Carpeta `components/` con componentes reutilizables
- [ ] Carpeta `hooks/` con custom hooks
- [ ] Carpeta `pages/` con páginas principales
- [ ] Carpeta `types/` con tipos TypeScript
- [ ] Archivo `index.ts` para barrel exports

### 3. **Integración en App.tsx**
- [ ] Las rutas están registradas en `App.tsx` dentro de la sección `Rutas protegidas - Escuela`
- [ ] La ruta importa el componente `Routes` del módulo correctamente

### 4. **Validación en Páginas** (Opcional pero recomendado)
En tus páginas principales, puedes agregar validaciones adicionales usando el hook `useModulosPermisos`:

```typescript
import { useModulosPermisos } from '../../../../hooks/useModulosPermisos';
import { escuelaAuthService } from '../../../../services/escuelaAuth.service';

const MiPaginaPrincipal = () => {
  const currentUser = escuelaAuthService.getCurrentUser();
  const { tieneModulo, isLoading } = useModulosPermisos(currentUser?.idUsuario ?? null);
  
  if (isLoading) return <div>Cargando módulos...</div>;
  
  // Útil para mostrar/ocultar opciones en base a módulos adicionales
  const tieneEvaluaciones = tieneModulo(7);  // Retorna boolean
  const tieneMatriculas = tieneModulo(6);
  
  return (
    <div>
      {tieneEvaluaciones && <button>Ver Evaluaciones</button>}
      {tieneMatriculas && <button>Ver Matrículas</button>}
      <YourContent />
    </div>
  );
};
```

**Notas sobre `useModulosPermisos`:**
- `tieneModulo(idModulo)` → Retorna `boolean`
- `modulosPermisos` → Objeto con array de módulos disponibles
- `isLoading` → Mientras carga datos del servidor
- `error` → Si hay error en la carga
- `recargar()` → Función para refrescar permisos manualmente



### 5. **Manejo de Errores 403**
El archivo `src/config/api.config.ts` ya maneja errores 403 automáticamente:
- Limpia los tokens de sesión
- Redirige al login correspondiente
- No necesitas hacer nada adicional

---

## 🔗 Archivos Modificados (YA ESTÁN LISTOS)

✅ `src/features/portal/alumnos/routes/AlumnosRoutes.tsx` - Protegido con ModuloGuard(5)
✅ `src/features/portal/apoderados/routes/apoderados.routes.tsx` - Protegido con ModuloGuard(5)
✅ `src/features/portal/matriculas/routes/matriculas.routes.tsx` - Protegido con ModuloGuard(6)
✅ `src/features/portal/areas/routes/areas.routes.tsx` - Protegido con ModuloGuard(4)
✅ `src/features/portal/especialidades/routes/especialidades.routes.tsx` - Protegido con ModuloGuard(4)
✅ `src/features/portal/infraestructura/routes/InfraestructuraRoutes.tsx` - Protegido con ModuloGuard(3)
✅ `src/features/portal/usuarios/routes/UsuariosPortalRoutes.tsx` - Protegido con ModuloGuard(2)
✅ `src/config/api.config.ts` - API endpoints actualizados

---

## 🎯 Ejemplo Completo: Módulo de Evaluaciones

Para el **Módulo 7 (EVALUACIONES Y NOTAS)**, la estructura sería:

```
evaluaciones/
├── api/
│   ├── evaluacionesApi.ts        (llamadas a CalificacionesController, etc)
│   ├── asistenciasApi.ts
│   └── index.ts
├── components/
│   ├── TablaCalificaciones.tsx
│   ├── TablaAsistencias.tsx
│   └── index.ts
├── hooks/
│   ├── useEvaluaciones.ts
│   ├── useAsistencias.ts
│   └── index.ts
├── pages/
│   ├── CalificacionesPage.tsx
│   ├── AsistenciasPage.tsx
│   ├── EvaluacionesPage.tsx
│   └── PromediosPage.tsx
├── routes/
│   └── EvaluacionesRoutes.tsx     ← ARCHIVO CLAVE (ver template arriba)
├── types/
│   └── index.ts                   (Calificacion, Evaluacion, Asistencia, etc)
└── index.ts                       (barrel exports)
```

**evaluaciones/routes/EvaluacionesRoutes.tsx:**
```typescript
import { Route, Routes, Navigate } from 'react-router-dom';
import ModuloGuard from '../../../../hooks/ModuloGuard';
import { escuelaAuthService } from '../../../../services/escuelaAuth.service';
import CalificacionesPage from '../pages/CalificacionesPage';
import AsistenciasPage from '../pages/AsistenciasPage';
import EvaluacionesPage from '../pages/EvaluacionesPage';
import PromediosPage from '../pages/PromediosPage';

const EvaluacionesRoutes = () => {
  const currentUser = escuelaAuthService.getCurrentUser();
  
  return (
    <ModuloGuard 
      requiereModulo={7}  // ← EVALUACIONES Y NOTAS
      idUsuario={currentUser?.idUsuario ?? null}
      fallback={<Navigate to="/escuela/dashboard" replace />}
    >
      <Routes>
        <Route path="/" element={<EvaluacionesPage />} />
        <Route path="/calificaciones" element={<CalificacionesPage />} />
        <Route path="/asistencias" element={<AsistenciasPage />} />
        <Route path="/promedios" element={<PromediosPage />} />
      </Routes>
    </ModuloGuard>
  );
};

export default EvaluacionesRoutes;
```

---

---

## ❌ Troubleshooting - Errores Comunes

### Error: "No tienes acceso a este módulo" (módulo bloqueado)

**Causa probable:** El ID del módulo en ModuloGuard es incorrecto.

**Solución:**
1. Revisa la tabla de módulos (arriba) y verifica el ID correcto
2. En `routes/[TuModulo]Routes.tsx`, cambia:
   ```typescript
   // ❌ INCORRECTO
   <ModuloGuard requiereModulo={99}>  // ID no existe
   
   // ✅ CORRECTO
   <ModuloGuard requiereModulo={7}>   // ID valido para EVALUACIONES
   ```
3. Verifica que en `/admin` el rol esté asignado a ese módulo

---

### Error: API retorna 403 Forbidden

**Significado:** El usuario no tiene permiso en ese módulo (validación backend).

**Verificar:**
1. En `/admin` → Asegúrate que el rol tiene asignado el módulo
2. En backend, verifica que el controlador tiene `@RequireModulo(X)` con el ID correcto
3. Llamadas API directas sin módulo asignado serán bloqueadas

---

### Error: "usuario es null" o "currentUser undefined"

**Causa:** `escuelaAuthService.getCurrentUser()` no está retornando el usuario.

**Solución:**
```typescript
// ❌ PROBLEMA
const currentUser = escuelaAuthService.getCurrentUser();
console.log(currentUser);  // undefined

// ✅ SOLUCIÓN - Asegúrate de estar logueado en /escuela/login
// Si estás en desarrollo, verifica que el token está en localStorage
const currentUser = escuelaAuthService.getCurrentUser();
if (!currentUser) {
  console.log('No hay sesión activa');
  return <Navigate to="/escuela/login" replace />;
}
```

---

### Error: "ModuloGuard not found" (import error)

**Solución:**
```typescript
// ✅ Importa desde rutas correctas (ajusta según tu ubicación)
import ModuloGuard from '../../../../hooks/ModuloGuard';  // Si estás en routes/
import ModuloGuard from '../../../hooks/ModuloGuard';     // Si estás en una carpeta más arriba
```

Usa `ctrl+click` en VS Code para seguir la ruta correcta.

---

### Error: "Missing @ in imports" (no importaste escuelaAuthService)

**Solución:**
```typescript
// ✅ Opción 1: Importar servicio en routes
import { escuelaAuthService } from '../../../../services/escuelaAuth.service';

// ✅ Opción 2: Si tienes contexto, usar context en lugar de servicio
import { useAuth } from '../../context/AuthContext';  // Y usar hook en lugar
```

---

## 🧪 Cómo Testear tu Módulo

1. **Login como SuperAdmin**
   - Usuario: `admin@admin.com`
   - Contraseña: (la que tengas configurada)
   - Ingresa a `/admin`

2. **Asigna módulos a un rol**
   - Vete a "Instituciones" → Selecciona una
   - Click en "Roles"
   - Click en el rol (ej: PROFESOR)
   - Marca los módulos que quieres asignar
   - Guarda

3. **Login con ese rol**
   - Logout del admin (`/admin`)
   - Vete a `/escuela/login`
   - Login con un usuario que tenga ese rol
   - Verifica que ves el módulo en la sidebar

4. **Entra al módulo**
   - Click en el módulo en la sidebar
   - Debe cargar tu contenido
   - Si ves error 403, backend está bloqueando (verifica `@RequireModulo`)

5. **Revisa los logs**
   - Abre DevTools (F12) → Console
   - Deberías ver logs de:
     - `useModulosPermisos: Cargando módulos...`
     - `tieneModulo: ✓ Encontrado en state`
     - Etc.

---

Todos los controladores ya tienen `@RequireModulo(X)` implementado:

```java
@RestController
@RequestMapping("/restful/calificaciones")
public class CalificacionesController {
    
    @GetMapping
    @RequireModulo(7)  // EVALUACIONES Y NOTAS
    public List<Calificacion> buscarTodas() {
        // implementación
    }
    
    @PostMapping
    @RequireModulo(7)
    public Calificacion crear(@RequestBody CalificacionDTO dto) {
        // implementación
    }
}
```

---

## 📞 Notas Importantes

1. **NO crear nuevas carpetas en `/src/features/portal/`** - Ya está decidido que cada dev implementa su módulo
2. **ModuloGuard es obligatorio** - Debe envolver todas las rutas del módulo
3. **El ID debe ser exacto** - Revisar tabla de módulos arriba
4. **Reutilizar la estructura** - Usar el patrón `api/`, `components/`, `hooks/`, `pages/`, `routes/`, `types/`
5. **Backend ya está listo** - Todos los controllers tienen `@RequireModulo` implementado

---

## 🚀 Próximos Pasos

1. **Backend**: Ya está completamente implementado ✅
2. **Frontend (Módulos existentes)**: Ya tienen protección con ModuloGuard ✅
3. **Frontend (Nuevos módulos)**: Sigue esta guía para implementar Evaluaciones (Módulo 7) y Pagos (Módulo 8)

¡Buena suerte con la implementación! 🎉
