# 🔐 GUÍA: Agregar más Permisos a Módulos

## 📋 Problema
- Módulos tienen pocos permisos configurados
- SuperAdmin necesita una interfaz para agregar nuevos permisos
- Cada módulo puede tener permisos diferentes según sus funcionalidades

---

## ✅ Solución Implementada

### **Interfaz en SuperAdmin: Gestión de Permisos por Módulo**

**Ubicación:** SuperAdmin → Permisos Módulos

**Funcionalidades:**
1. ✅ Ver todos los módulos expandibles
2. ✅ Ver permisos actuales de cada módulo
3. ✅ Crear NUEVOS permisos para un módulo
4. ✅ Editar permisos existentes
5. ✅ Eliminar permisos (soft delete)

---

## 🎯 Cómo Agregar Nuevos Permisos

### **Paso 1: Ir a SuperAdmin → Permisos Módulos**
```
SuperAdmin
├── Instituciones
├── Planes
├── Suscripciones
├── Roles
├── Usuarios
└── ➕ PERMISOS MÓDULOS ← Aquí
```

### **Paso 2: Expandir un Módulo**
Por ejemplo, expandir "ALUMNOS"

### **Paso 3: Agregar Nuevo Permiso**
```
Código:       IMPRIMIR    (mayúsculas, sin espacios)
Nombre:       Imprimir listado de alumnos
Descripción:  Permite imprimir reportes de alumnos
```

### **Paso 4: Guardar**
✅ El permiso se crea y inmediatamente aparece en la lista

---

## 📚 Ejemplo: Agregar Permisos a Módulo ALUMNOS

### **Permisos Estándar (Ya Existen)**
```
VER       → Ver listado y detalles
CREAR     → Crear nuevo alumno
EDITAR    → Editar datos del alumno
ELIMINAR  → Eliminar alumno
```

### **Nuevos Permisos a Agregar**
```
EXPORTAR  → Exportar a Excel/PDF
REPORTES  → Ver reportes de asistencia
IMPRIMIR  → Imprimir carnet de alumno
ASIGNAR   → Asignar a cursos/secciones
```

---

## 🔧 Backend: Endpoints Necesarios

El frontend está listo. **El backend debe implementar estos endpoints:**

### **GET /restful/modulos/con-permisos**
Retorna todos los módulos con sus permisos actuales
```json
{
  "idModulo": 5,
  "nombre": "ALUMNOS",
  "permisos": [
    {
      "idPermiso": 15,
      "codigo": "VER",
      "nombre": "Ver alumnos",
      "descripcion": "Ver listado y detalles",
      "idModulo": 5
    },
    {
      "idPermiso": 16,
      "codigo": "CREAR",
      "nombre": "Crear alumno",
      "descripcion": "Crear nuevo registro",
      "idModulo": 5
    }
  ]
}
```

### **GET /restful/modulos/{idModulo}/permisos**
Obtener permisos de un módulo específico

### **POST /restful/permisos**
Crear nuevo permiso
```json
{
  "codigo": "EXPORTAR",
  "nombre": "Exportar datos",
  "descripcion": "Exportar alumnos a Excel",
  "idModulo": 5
}
```

### **PUT /restful/permisos/{idPermiso}**
Actualizar permiso existente

### **DELETE /restful/permisos/{idPermiso}**
Eliminar permiso (soft delete: establecer estado = 0)

---

## 💡 Flujo Completo

```
SuperAdmin crea nuevo permiso "EXPORTAR" en ALUMNOS
         ↓
Guarda en BD (tabla permisos)
         ↓
SuperAdmin → Roles → PROFESOR
         ↓
Asigna permiso EXPORTAR al rol PROFESOR en módulo ALUMNOS
         ↓
Guarda en BD (tabla rol_modulo_permiso)
         ↓
Usuario con rol PROFESOR se loguea
         ↓
Frontend carga permisos: useModulosPermisos()
         ↓
En código usa: const puedeExportar = usePermisoModulo(5, 'EXPORTAR')
         ↓
Botón EXPORTAR aparece/desaparece según permiso
```

---

## 🎓 Cómo Usarlo en el Código

### **Opción 1: Después de agregar permiso "EXPORTAR"**
```tsx
const puedeExportar = usePermisoModulo(5, 'EXPORTAR');

return (
  <>
    {puedeExportar && (
      <button onClick={handleExportar}>
        📥 Exportar a Excel
      </button>
    )}
  </>
);
```

### **Opción 2: Con Componente AccionesBotones**
```tsx
<AccionesBotones
  idModulo={5}
  acciones={[
    { codigo: 'VER', etiqueta: 'Ver', onClick: handleVer },
    { codigo: 'CREAR', etiqueta: 'Nuevo', onClick: handleNuevo },
    { codigo: 'EDITAR', etiqueta: 'Editar', onClick: handleEditar },
    { codigo: 'ELIMINAR', etiqueta: 'Eliminar', onClick: handleEliminar },
    { codigo: 'EXPORTAR', etiqueta: 'Exportar', onClick: handleExportar },
  ]}
/>
```

---

## 📊 Tabla de Permisos Recomendados por Tipo de Módulo

### **Para Módulos CRUD (Alumnos, Usuarios, etc.)**
| Código | Uso |
|--------|-----|
| VER | Ver listado |
| CREAR | Agregar registro |
| EDITAR | Modificar datos |
| ELIMINAR | Borrar registro |
| EXPORTAR | Descargar Excel/PDF |
| REPORTES | Ver reportes |

### **Para Módulos de Calificación**
| Código | Uso |
|--------|-----|
| VER | Ver calificaciones |
| CALIFICAR | Ingresar calificaciones |
| EDITAR | Modificar calificaciones |
| REVISAR | Revisar calificaciones |
| APROBAR | Aprobar calificaciones |

### **Para Módulos Administrativos**
| Código | Uso |
|--------|-----|
| CONFIGURAR | Cambiar configuración |
| AUDITAR | Ver registros de auditoría |
| GENERAR | Generar reportes |
| SINCRONIZAR | Sincronizar datos |

---

## ✨ Ventajas del Sistema

| Ventaja | Detalje |
|---------|--------|
| **Flexible** | Agregar permisos sin tocar código |
| **Dinámico** | Cambios en tiempo real (solo recarga página) |
| **Granular** | Control fino por cada permiso |
| **Escalable** | Funciona para N permisos |
| **Centralizado** | Todo en SuperAdmin |

---

## 🚀 Checklist para tu Módulo

```
Si ALUMNOS va a tener EXPORTAR:

[ ] 1. Ir a SuperAdmin → Permisos Módulos
[ ] 2. Expandir "ALUMNOS"
[ ] 3. Crear permiso "EXPORTAR"
[ ] 4. En tu código: const puedeExportar = usePermisoModulo(5, 'EXPORTAR')
[ ] 5. Mostrar botón u ocultarlo: {puedeExportar && <button>Exportar</button>}
[ ] 6. Asignar permiso a rol en SuperAdmin → Roles
[ ] 7. Probar: loguear con ese rol y verificar botón
```

---

## ❓ Preguntas Frecuentes

**P: ¿Cada miembro del equipo puede agregar sus propios permisos?**
A: SÍ. Cada quien agrega los permisos que necesita su módulo en SuperAdmin.

**P: ¿Los cambios se ven inmediatamente?**
A: Los cambios en BD sí, pero el frontend carga en login. Recarga página para ver cambios.

**P: ¿Puedo eliminar un permiso?**
A: SÍ, pero usa soft delete (estado=0) para no romper historial.

**P: ¿Código debe ser MAYÚSCULAS?**
A: Recomendado para consistencia, pero el sistema es case-insensitive.

---

## 📞 Soporte

Si necesitas ayuda:
1. Revisa la interfaz en SuperAdmin
2. Consulta esta guía
3. Pregunta al equipo en el grupo de desarrollo
