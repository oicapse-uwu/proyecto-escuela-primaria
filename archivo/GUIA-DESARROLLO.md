# 📚 Guía de Desarrollo - Proyecto Escuela Primaria

## 🚀 Inicio Rápido

### 1. Actualizar tu Repositorio Local

Antes de empezar a trabajar, **siempre** asegúrate de tener la última versión del proyecto:


```bash

#    Todo estos comandos son en consola, si saben hacerlo mediante la interfaz del visual, 
#    haganlo como saben, este es una guia para los que aun no saben, para ayudarlos a trabajar de manera mas facil 

# Cambia a la rama main
git checkout main

# Descarga los últimos cambios
git pull origin main
```

### 2. Crear tu Rama de Trabajo

**⚠️ IMPORTANTE: NUNCA TRABAJES DIRECTAMENTE EN LA RAMA MAIN**

Crea tu propia rama para desarrollar tu módulo:

```bash
# Crear y cambiar a una nueva rama
git switch -c feature/nombre-de-tu-modulo

# Ejemplo:
# git switch -c feature/docentes
# git switch -c feature/materias
# git switch -c feature/calificaciones
```

## 💻 Configuración del Entorno de Desarrollo

### Levantar el Frontend

Asegúrate de estar en tu rama de trabajo:

```bash
# Navega a la carpeta del frontend
cd escuelita-frontend

# Instala las dependencias (solo la primera vez o si hay cambios en package.json)
npm install

# Inicia el servidor de desarrollo
npm run dev
```

### Solución de Problemas

Si aparecen errores o archivos marcados en rojo:

1. **Probablemente te faltan dependencias instaladas**
2. Abre GitHub Copilot o tu IA de preferencia
3. Pregunta: *"¿Por qué sale este error? Verifica que tenga instalado todo lo necesario"*
4. Sigue las instrucciones que te proporcione

### Acceder a la Aplicación

Una vez que el servidor esté corriendo, verás una URL en la consola. Presiona `Ctrl + Click` sobre ella.

**Rutas de acceso:**

- **Super Admin:** `http://localhost:[puerto]/login`
- **Admin Escuela:** `http://localhost:[puerto]/escuela/login`

*(Reemplaza `[puerto]` con el puerto que te muestre la consola, generalmente 5173)*

## 🔐 Usuarios de Prueba (Super Admin)

| Nombre | Usuario | Contraseña |
|--------|---------|------------|
| Martin | `Marki` | `marki123` |
| Nayelli | `Nay` | `nay123` |
| Luis | `Luis` | `luis123` |
| Bizantino | `Biza` | `biza123` |

### Modificar tu Usuario

Si deseas cambiar tu información o contraseña:

1. Inicia sesión como Super Admin
2. Ve a **Usuarios del Sistema → SuperAdmins**
3. Haz clic en el botón **Editar** de tu usuario
4. Modifica los campos que desees

**Nota:** El sistema hashea las contraseñas automáticamente al iniciar sesión, por lo que en la base de datos verás la contraseña encriptada, no en texto plano.

## 📁 Estructura de Trabajo

### ¿Dónde Trabajar?

```
src/
├── features/
    ├── backoffice/        ← ❌ NO TRABAJAR AQUÍ (Solo Super Admin)
    │   ├── instituciones/
    │   ├── usuarios/
    │   ├── reportes/
    │   └── suscripciones/
    │
    └── portal/            ← ✅ AQUÍ ES DONDE TRABAJAMOS
        ├── alumnos/       ← Ejemplo de estructura
        ├── docentes/      ← Tu módulo aquí
        ├── materias/      ← Tu módulo aquí
        └── ...
```

### Estructura de Carpetas para tu Módulo

Sigue esta estructura (basada en la carpeta `alumnos`):

```
tu-modulo/
├── index.ts              # Exportaciones principales
├── api/                  # Llamadas a la API
│   └── tuModulo.api.ts
├── components/           # Componentes específicos del módulo
│   ├── TuModuloForm.tsx
│   └── TuModuloTable.tsx
├── hooks/                # Custom hooks
│   └── useTuModulo.ts
├── pages/                # Páginas/vistas
│   ├── TuModuloList.tsx
│   └── TuModuloDetail.tsx
├── routes/               # Configuración de rutas
│   └── tuModulo.routes.tsx
└── types/                # TypeScript types/interfaces
    └── tuModulo.types.ts
```

**📖 Referencia:** Si necesitas guiarte con archivos que ya funcionan, revisa la carpeta `backoffice/instituciones` como ejemplo.

---

## 📚 Guías Complementarias

Antes de empezar a desarrollar, **LEE ESTAS GUÍAS**:

### 🧭 [GUIA-SIDEBAR.md](GUIA-SIDEBAR.md)
**IMPORTANTE:** Explica cómo funciona el Sidebar y por qué **NO debes volver a crearlo** en cada vista.

**Lee esto para entender:**
- Cómo funciona el Layout principal
- Por qué el Sidebar ya está implementado
- Cómo agregar tu módulo al menú de navegación
- Errores comunes que debes evitar

### 🧩 [GUIA-COMPONENTES-REUTILIZABLES.md](GUIA-COMPONENTES-REUTILIZABLES.md)
**IMPORTANTE:** Lista todos los componentes que puedes usar en tu módulo sin tener que crearlos.

**Lee esto para conocer:**
- Modal (ventanas emergentes)
- Pagination (paginación de tablas)
- Otros componentes disponibles
- Ejemplos de uso completos
- Cómo crear nuevos componentes reutilizables

**⚠️ No reinventes la rueda** - Si un componente ya existe, úsalo. Te ahorrará tiempo y mantendrá consistencia en el proyecto.

---

## 📝 Flujo de Trabajo con Git

### Trabajar en tu Rama

```bash
# 1. Asegúrate de estar en tu rama
git branch

# 2. Haz tus cambios en el código

# 3. Guarda tus cambios
git add .
git commit -m "Descripción clara de lo que hiciste"

# 4. Sube tus cambios a GitHub
git push origin feature/tu-rama
```

### Crear una Nueva Rama desde tu Rama Actual

Si necesitas crear una sub-rama o experimentar con algo nuevo:

```bash
# Desde tu rama actual, crea una nueva
git switch -c feature/tu-rama-experimental

# O si prefieres el comando tradicional:
git checkout -b feature/tu-rama-experimental
```

## 🎯 Responsabilidades

- ✅ Cada persona es responsable de su módulo asignado
- ✅ Los items del sidebar son solo ejemplos, puedes modificarlos según tu módulo
- ✅ Sigue la estructura de carpetas establecida
- ✅ Mantén tu código limpio y documentado
- ⚠️ **NO** trabajes en la rama main directamente
- ⚠️ **NO** modifiques código que no sea parte de tu módulo sin consultar

## 🗓️ Presentación del Avance

**Fecha:** Lunes (próxima presentación)

**Formato:** Cada persona defiende su módulo y explica:
- ¿Qué funcionalidad implementaste?
- ¿Qué problemas encontraste y cómo los resolviste?
- Demo en vivo de tu módulo

## 💬 Comunicación

**¿Tienes dudas, preguntas o consultas?**

- ✅ Escribe al grupo
- ✅ Pregunta sin miedo
- ✅ Es mejor preguntar antes que equivocarse

**RECUERDA:** No hay preguntas tontas, todas las dudas son válidas. ¡Pregunta! 😊 PREGUNTEN :D 

            psdt: pregunten de vrd :D les voy a botar si no

---

## 📌 Tips Adicionales

### Comandos Útiles de Git

```bash
# Ver el estado de tus cambios
git status

# Ver las ramas disponibles
git branch

# Ver el historial de commits
git log --oneline

# Descartar cambios no guardados
git checkout -- nombre-archivo

# Ver diferencias de lo que cambiaste
git diff
```

### Buenas Prácticas

1. **Commits frecuentes:** Guarda tu progreso regularmente
2. **Mensajes claros:** Describe bien qué hiciste en cada commit
3. **Pull antes de Push:** Actualiza tu rama antes de subir cambios
4. **Prueba antes de subir:** Asegúrate de que todo funciona
5. **Código limpio:** Mantén tu código ordenado y comentado

---

**¡Éxito en el desarrollo! 🚀**