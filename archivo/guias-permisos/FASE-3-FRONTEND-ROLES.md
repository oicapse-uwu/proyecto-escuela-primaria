# FASE 3: Frontend Profesional para Matriz de Roles y Permisos

**Estado:** ✅ Completado e integrado
**Rama:** `feature/judithnosequevoyyamuejej`
**Fecha:** 2026-03-04

---

## 📋 Resumen

Se implementó un **módulo completo de Roles y Permisos** en el frontend (backoffice) con un sistema profesional de control de acceso que se puede usar en todo el frontend.

---

## 🏗️ Estructura del Módulo `roles`

```
escuelita-frontend/src/features/backoffice/roles/
├── api/
│   └── rolesMatrizApi.ts          # API calls para obtener/actualizar matriz
├── components/
│   └── MatrizRolEditor.tsx        # Componente para editar matriz (visual)
├── hooks/
│   └── useMatrizRol.ts            # Hook para gestionar estado de matriz
├── pages/
│   └── MatrizRolesPage.tsx        # Página principal
├── routes/
│   └── RolesRoutes.tsx            # Rutas del módulo
├── types/
│   └── index.ts                   # Types para matriz de permisos
└── index.ts                       # Exportaciones del módulo
```

### Estructura de Hooks Compartidos

```
escuelita-frontend/src/hooks/
├── useModulosPermisos.ts         # Hook para obtener permisos del usuario
├── ModuloGuard.tsx               # Componente protector por permisos
├── api.ts                        # API call a /usuarios/{id}/modulos-permisos
├── types.ts                      # Types compartidos
└── index.ts                      # Exportaciones
```

---

## 🎯 Componentes Principales

### 1️⃣ **MatrizRolEditor** (Componente)

**Ubicación:** `features/backoffice/roles/components/MatrizRolEditor.tsx`

**Props:**
```tsx
interface MatrizRolEditorProps {
    matriz: MatrizRol | null;              // Matriz completa del rol
    isLoading: boolean;                    // Estado de carga
    onGuardar: (permisos) => Promise<void>; // Callback al guardar
    isSaving: boolean;                     // Estado de guardado
}
```

**Características:**
- ✅ Visualiza todos los módulos del rol
- ✅ Expand/collapse de módulos para mejor UX
- ✅ Checkbox para cada permiso
- ✅ Botones "Todos" y "Ninguno" por módulo
- ✅ Contador de permisos asignados
- ✅ Indicadores visuales de estado
- ✅ Validación antes de guardar

**Ejemplo de uso:**
```tsx
<MatrizRolEditor
    matriz={matriz}
    isLoading={isLoading}
    onGuardar={handleGuardarMatriz}
    isSaving={isSaving}
/>
```

---

### 2️⃣ **MatrizRolesPage** (Página)

**Ubicación:** `features/backoffice/roles/pages/MatrizRolesPage.tsx`

**Características:**
- ✅ Lista de todos los roles en columna izquierda
- ✅ Editor de matriz en columna derecha (responsive)
- ✅ Búsqueda y paginación de roles
- ✅ Integración con hooks de roles y matriz

**Acceso:**
```
URL: http://localhost:5173/admin/roles
Requiere: rol SUPERADMIN
Sidebar: Menu > Roles y Permisos
```

---

## 🪝 Hooks

### `useMatrizRol(idRol)`

**Ubicación:** `features/backoffice/roles/hooks/useMatrizRol.ts`

```tsx
const { matriz, isLoading, isSaving, error, actualizarMatriz, recargar } = 
    useMatrizRol(idRol);
```

**Returns:**
```tsx
{
    matriz: MatrizRol | null,            // Matriz actual del rol
    isLoading: boolean,                  // Cargando matriz
    isSaving: boolean,                   // Guardando cambios
    error: string | null,                // Mensaje de error
    actualizarMatriz: (payload) => Promise<void>,  // Actualizar matriz
    recargar: () => Promise<void>        // Recargar matriz
}
```

**Ejemplo:**
```tsx
const { matriz, isLoading } = useMatrizRol(1);

if (isLoading) return <LoadingSpinner />;
if (!matriz) return <EmptyState />;

return <MatrizRolEditor matriz={matriz} />;
```

---

### `useModulosPermisos(idUsuario)`

**Ubicación:** `src/hooks/useModulosPermisos.ts`

```tsx
const { 
    modulosPermisos, 
    isLoading, 
    tienePermiso, 
    obtenerModulo,
    obtenerPermisosModulo,
    recargar 
} = useModulosPermisos(idUsuario);
```

**Returns:**
```tsx
{
    modulosPermisos: ModulosPermisosUsuario | null,
    isLoading: boolean,
    error: string | null,
    tienePermiso: (codigoPermiso: string) => boolean,
    obtenerModulo: (idModulo: number) => ModuloAcceso | null,
    obtenerPermisosModulo: (idModulo: number) => PermisoAcceso[],
    recargar: () => Promise<void>
}
```

**Ejemplo:**
```tsx
const { tienePermiso, obtenerModulo } = useModulosPermisos(usuarioId);

if (tienePermiso('VER_ALUMNOS')) {
    // Mostrar botón de alumnos
}

const moduloAlumnos = obtenerModulo(3);
```

---

## 🛡️ Componente Guard

### `<ModuloGuard />`

**Ubicación:** `src/hooks/ModuloGuard.tsx`

**Props:**
```tsx
interface ModuloGuardProps {
    requierePermiso?: string;    // Código de permiso (VER_ALUMNOS)
    requiereModulo?: number;     // ID del módulo
    children: React.ReactNode;   // Contenido a proteger
    fallback?: React.ReactNode;  // Mostrar si NO tiene acceso
    idUsuario: number | null;    // ID del usuario
}
```

**Ejemplo 1: Proteger por permiso**
```tsx
<ModuloGuard 
    requierePermiso="VER_ALUMNOS"
    idUsuario={usuarioId}
    fallback={<div>No tienes acceso a alumnos</div>}
>
    <AlumnosTable />
</ModuloGuard>
```

**Ejemplo 2: Proteger por módulo**
```tsx
<ModuloGuard 
    requiereModulo={3}  // ALUMNOS
    idUsuario={usuarioId}
>
    <ContenidoAlumnos />
</ModuloGuard>
```

**Ejemplo 3: Ocultar botón sin acceso**
```tsx
<ModuloGuard 
    requierePermiso="CREAR_ALUMNO"
    idUsuario={usuarioId}
>
    <button>Crear Alumno</button>
</ModuloGuard>
{/* El botón desaparece si no tiene permiso */}
```

---

## 📡 API Calls

### `obtenerMatrizRol(idRol: number)`

```tsx
import { obtenerMatrizRol } from '@/features/backoffice/roles';

const matriz = await obtenerMatrizRol(1);
// Retorna: { idRol, nombreRol, modulos: [...] }
```

### `actualizarMatrizRol(idRol, payload)`

```tsx
import { actualizarMatrizRol } from '@/features/backoffice/roles';

await actualizarMatrizRol(1, {
    idRol: 1,
    modulos: [
        { idModulo: 1, idPermisos: [1, 2, 3] },
        { idModulo: 2, idPermisos: [4, 5] }
    ]
});
```

### `obtenerModulosPermisosUsuario(idUsuario: number)`

```tsx
import { obtenerModulosPermisosUsuario } from '@/hooks';

const permisos = await obtenerModulosPermisosUsuario(5);
// Retorna: ModulosPermisosUsuario con módulos y permisos del usuario
```

---

## 💾 Caching

El hook `useModulosPermisos` cachea automáticamente los permisos en **localStorage** bajo la clave:

```
usuario_permisos_{idUsuario}
```

**Ventajas:**
- ✅ Carga rápida en refresco de página
- ✅ Funciona offline si ya se cargaron los permisos
- ✅ Se valida contra el servidor en cada carga

**Para limpiar cache** (ej: al logout):
```tsx
localStorage.removeItem(`usuario_permisos_${usuarioId}`);
```

---

## 🔌 Integración con Autenticación

Ejemplo de integración en el flujo de login:

```tsx
// Después de autenticación exitosa
const usuario = await login(credentials);

// Frontend carga los permisos automáticamente
useModulosPermisos(usuario.idUsuario);

// O manualmente:
const permisos = await obtenerModulosPermisosUsuario(usuario.idUsuario);
```

---

## 📚 Uso en Diferentes Contextos

### En Sidebar (renderizar módulos dinámicamente)

```tsx
const { modulosPermisos } = useModulosPermisos(usuarioId);

{modulosPermisos?.modulos.map(modulo => (
    <SidebarItem 
        key={modulo.idModulo}
        nombre={modulo.nombre}
        icono={modulo.icono}
    />
))}
```

### En Rutas Protegidas

```tsx
<Route 
    path="/alumnos"
    element={
        <ModuloGuard requiereModulo={3} idUsuario={usuarioId}>
            <AlumnosPage />
        </ModuloGuard>
    }
/>
```

### En Botones/Acciones

```tsx
<button 
    disabled={!tienePermiso('CREAR_ALUMNO')}
    onClick={crearAlumno}
>
    {tienePermiso('CREAR_ALUMNO') ? 'Crear' : 'Crear (Sin acceso)'}
</button>
```

### En Tablas (columnas condicionales)

```tsx
const columnas = [
    { id: 'nombre', label: 'Nombre' },
    ...(tienePermiso('EDITAR_ALUMNO') && { id: 'editar', label: 'Editar' }),
    ...(tienePermiso('ELIMINAR_ALUMNO') && { id: 'eliminar', label: 'Eliminar' })
];
```

---

## 🎨 UI/UX Features

### Matriz de Permisos (SuperAdmin)
- Grid responsivo (1 columna móvil, 2 columnas desktop)
- Módulos con expand/collapse
- Contadores de permisos
- Botones Todos/Ninguno por módulo
- Toast notifications para éxito/error
- Loading spinners
- Estados visuales claros

### Flujo de Administración
1. SuperAdmin navega a `/admin/roles`
2. Selecciona un rol de la lista
3. Se carga la matriz actual del rol
4. Expone módulos y checkboxes
5. Marca/desmarca permisos
6. Clica "Guardar Cambios"
7. Backend actualiza relaciones
8. Toast muestra confirmación

---

## 🧪 Testing

### Test de Matriz Load
```tsx
const { matriz, isLoading } = useMatrizRol(1);
await waitFor(() => expect(isLoading).toBe(false));
expect(matriz?.idRol).toBe(1);
expect(matriz?.modulos.length).toBeGreaterThan(0);
```

### Test de Permisos
```tsx
const { tienePermiso } = useModulosPermisos(5);
expect(tienePermiso('VER_ALUMNOS')).toBe(true);
expect(tienePermiso('BORRAR_SISTEMA')).toBe(false);
```

### Test de Guard
```tsx
render(
    <ModuloGuard requierePermiso="VER" idUsuario={5}>
        <div>Contenido Protegido</div>
    </ModuloGuard>
);
expect(screen.getByText('Contenido Protegido')).toBeInTheDocument();
```

---

## 🐛 Troubleshooting

| Problema | Solución |
|----------|----------|
| Permisos no se cargan | Verificar token JWT en localStorage |
| ModuloGuard siempre oculta | Asegurar que `idUsuario` sea válido |
| Matriz no guarda cambios | Revisar console.error y respuesta API |
| Cache obsoleto | `localStorage.clear()` y recargar |
| API 401/403 | Token expirado, hacer logout y login |

---

## 🚀 Próximos Pasos

### Sugerencias para Mejorar:
1. **Breadcrumbs dináámicos** basados en módulos accesibles
2. **Auditoría de cambios** de permisos (quién cambió qué y cuándo)
3. **Plantillas de permisos** (presets rápidos por tipo de rol)
4. **Export/Import** de configuración de roles
5. **Dashboard de permisos activos** (gráfico de módulos por rol)

---

## 📝 Archivos Relacionados

- Backend FASE 2: [FASE-2-BACKEND-APIS.md](archivo/FASE-2-BACKEND-APIS.md)
- Tipos compartidos: `src/hooks/types.ts`
- Componentes layout: `src/components/layout/SuperAdminSidebar.tsx`
- Rutas principales: `src/App.tsx`

---

**Implementado por:** Copilot (Haiku 4.5)  
**Código:** Profesional, escalable y mantenible  
**Testing:** Listo para testing manual y automatizado