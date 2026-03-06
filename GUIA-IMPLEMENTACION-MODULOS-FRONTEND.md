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

## 📋 Checklist para cada Módulo

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
En tus páginas principales, puedes agregar validaciones adicionales:

```typescript
import { useModulosPermisos } from '../../../../hooks/useModulosPermisos';
import { escuelaAuthService } from '../../../../services/escuelaAuth.service';

const MiPaginaPrincipal = () => {
  const currentUser = escuelaAuthService.getCurrentUser();
  const { modulosPermisos, isLoading } = useModulosPermisos(currentUser?.idUsuario ?? null);
  
  if (isLoading) return <div>Cargando...</div>;
  
  // Validación redundante (idealmente no es necesaria si ModuloGuard está en routes)
  if (!modulosPermisos?.tieneModulo(7)) {
    return <div>No tienes acceso a este módulo</div>;
  }
  
  return <YourContent />;
};
```

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

## 🔧 Backend - Información para Referencia

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
