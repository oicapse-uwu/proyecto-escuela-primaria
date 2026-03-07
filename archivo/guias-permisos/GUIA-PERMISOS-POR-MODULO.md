# 🔐 GUÍA: Implementar Permisos en tu Módulo

## 📋 Resumen
- **NO necesitas esperar a que todos terminen sus módulos**
- Cada persona implementa permisos en su módulo de forma independiente
- Los datos ya están en la BD (rol → módulo → permisos)
- Solo necesitas usar 2 cosas: `usePermisoModulo` hook y `AccionesBotones` componente

---

## 🎯 Pasos Rápidos (5 minutos)

### Paso 1: Importa el Hook
```tsx
import { usePermisoModulo } from '../../hooks/usePermisoModulo';
```

### Paso 2: Obtén los Permisos
```tsx
const MODULO_ALUMNOS = 5; // Tu ID de módulo
const puedeCrear = usePermisoModulo(MODULO_ALUMNOS, 'CREAR');
const puedeEditar = usePermisoModulo(MODULO_ALUMNOS, 'EDITAR');
const puedeEliminar = usePermisoModulo(MODULO_ALUMNOS, 'ELIMINAR');
```

### Paso 3: Usa los Permisos
```tsx
{puedeCrear && <button onClick={crear}>Nuevo</button>}

{puedeEditar && (
  <button onClick={editar}>Editar</button>
)}

{puedeEliminar && (
  <button onClick={eliminar}>Eliminar</button>
)}
```

---

## 📚 Códigos de Permiso Estándar

**Tu módulo debe tener permisos con estos códigos:**

| Código | Significado | Ejemplo |
|--------|------------|---------|
| `VER` | Ver listado/detalles | Acceso al módulo |
| `CREAR` | Crear registro nuevo | Botón "Nuevo Alumno" |
| `EDITAR` | Modificar registro | Botón "Editar" |
| `ELIMINAR` | Borrar registro | Botón "Eliminar" |
| `REPORTES` | Acceso a reportes | Ver reportes del módulo |
| `EXPORTAR` | Exportar datos | Descargar Excel |

---

## 🔧 3 Formas de Usar (Elige la que prefieras)

### Opción A: Mostrar/Ocultar Botones (MÁS COMÚN)
```tsx
{puedeCrear && (
  <button className="bg-blue-500 text-white px-4 py-2 rounded">
    ➕ Nuevo Alumno
  </button>
)}
```

### Opción B: Usar Componente AccionesBotones (RECOMENDADO)
```tsx
import { AccionesBotones } from '../../components/common/AccionesBotones';

<AccionesBotones
  idModulo={5}
  acciones={[
    { codigo: 'CREAR', etiqueta: 'Nuevo', onClick: handleNuevo },
    { codigo: 'EDITAR', etiqueta: 'Editar', onClick: handleEditar },
    { codigo: 'ELIMINAR', etiqueta: 'Eliminar', color: 'danger', onClick: handleEliminar },
  ]}
/>
```

### Opción C: Componente SoloConPermiso (Para contenido)
```tsx
import { SoloConPermiso } from '../../components/common/AccionesBotones';

<SoloConPermiso idModulo={5} permiso="EDITAR">
  <EditForm />
</SoloConPermiso>
```

---

## 💡 Casos de Uso

### Caso 1: Botón Condicional en Lista
```tsx
<table>
  <tbody>
    {alumnos.map(alumno => (
      <tr key={alumno.id}>
        <td>{alumno.nombre}</td>
        <td>
          {puedeEditar && <button>Editar</button>}
          {puedeEliminar && <button>Eliminar</button>}
        </td>
      </tr>
    ))}
  </tbody>
</table>
```

### Caso 2: Bloquear Acceso Completo al Módulo
```tsx
const puedeAcceder = usePermisoModulo(MODULO_ALUMNOS, 'VER');

if (!puedeAcceder) {
  return <div>❌ Sin permisos para acceder</div>;
}

return <AlumnosContent />;
```

### Caso 3: Deshabilitar Botones Según Permisos
```tsx
<button disabled={!puedeEditar}>
  Editar {!puedeEditar && '(Sin permisos)'}
</button>
```

### Caso 4: Mostrar UI Diferente Según Permisos
```tsx
return (
  <div>
    {puedeCrear ? (
      <form>Crear nuevo alumno</form>
    ) : (
      <p>Solo puedes ver alumnos existentes</p>
    )}
  </div>
);
```

---

## 🔍 Debugging: Ver tus Permisos

Si quieres ver exactamente qué permisos tiene el usuario en tu módulo:

```tsx
import { usePermisosDelModulo } from '../../hooks/usePermisoModulo';

const permisos = usePermisosDelModulo(5); // Tu módulo
console.log('Permisos disponibles:', permisos);
// Output: ['VER', 'CREAR', 'EDITAR']
```

---

## ⚠️ Puntos Importantes

| Punto | Detalles |
|-------|----------|
| **ID de Módulo** | Cada módulo tiene un ID en la BD. Encuéntralo en `rol_modulo_permiso` table |
| **Códigos de Permiso** | Deben coincidir exactamente (case-insensitive) con los códigos en la BD |
| **Hook usePermisoModulo** | Devuelve `true/false`, usar para condicionales |
| **Datos Vienen de BD** | El hook obtiene datos del usuario logueado, no necesita parámetros adicionales |
| **Se Actualiza Automático** | Si cambias los permisos del usuario en SuperAdmin, se ven al refrescar |

---

## 🚀 Implementación Recomendada

```tsx
// 1. Arriba del componente
const MODULO_ACTUAL = 5; // Reemplaza con tu ID
const { puedeCrear, puedeEditar, puedeEliminar } = {
  puedeCrear: usePermisoModulo(MODULO_ACTUAL, 'CREAR'),
  puedeEditar: usePermisoModulo(MODULO_ACTUAL, 'EDITAR'),
  puedeEliminar: usePermisoModulo(MODULO_ACTUAL, 'ELIMINAR'),
};

// 2. En el JSX
return (
  <>
    <AccionesBotones
      idModulo={MODULO_ACTUAL}
      acciones={[
        { codigo: 'CREAR', etiqueta: 'Nuevo', onClick: () => {} },
        { codigo: 'EDITAR', etiqueta: 'Editar', onClick: () => {} },
      ]}
    />
    
    {/* O manual */}
    {puedeEliminar && <button onClick={eliminar}>Eliminar</button>}
  </>
);
```

---

## 📞 Preguntas Frecuentes

**P: ¿Afecta el rendimiento?**
A: No, el hook usa `useMemo` y los datos ya están cargados en `useModulosPermisos`

**P: ¿Qué pasa si el usuario no tiene permisos?**
A: Devuelve `false`, tú decides qué mostrar (ocultar botón, deshabilitar, etc.)

**P: ¿Necesito sincronizar con los otros módulos?**
A: No, cada módulo es independiente. Los datos vienen de la BD compartida.

**P: ¿Cómo agregar nuevos permisos?**
A: En SuperAdmin → Roles → [Tu Rol] → Agrega el nuevo permiso al módulo

---

## 📋 Checklist para tu Módulo

- [ ] Identificar ID de módulo en BD
- [ ] Importar `usePermisoModulo`
- [ ] Crear variables para cada permiso (crear, editar, eliminar)
- [ ] Ajustar botones/formularios según `puedeCrear`, `puedeEditar`, etc.
- [ ] Probar: crear rol sin CREAR, sin EDITAR, etc.
- [ ] Verificar que botones aparecen/desaparecen correctamente

---

## 🎓 Ejemplo Completo (Copiar y Pegar)

Ver archivo: `src/features/portal/alumnos/ejemplo-uso-permisos.tsx`
