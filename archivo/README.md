# 📖 Documentación del Proyecto - Escuela Primaria

## 🚀 Guías de Desarrollo

Bienvenido al proyecto. Aquí encontrarás toda la documentación necesaria para trabajar en el sistema.

---

## 📋 Índice de Guías

### 1. 📚 [GUIA-DESARROLLO.md](GUIA-DESARROLLO.md) - **COMIENZA AQUÍ**

**La guía principal para iniciar el proyecto.**

**Aprenderás:**
- ✅ Cómo actualizar tu repositorio local
- ✅ Crear y gestionar ramas de trabajo
- ✅ Configurar el entorno de desarrollo
- ✅ Acceder a la aplicación y usuarios de prueba
- ✅ Estructura de carpetas del proyecto
- ✅ Flujo de trabajo con Git
- ✅ Responsabilidades y buenas prácticas

**👉 Empieza por aquí si es tu primera vez trabajando en el proyecto.**

---

### 2. 🧭 [GUIA-SIDEBAR.md](GUIA-SIDEBAR.md) - **LEE ANTES DE CREAR VISTAS**

**Explica cómo funciona el sistema de navegación.**

**⚠️ IMPORTANTE:** Evita errores comunes entendiendo cómo funciona el Sidebar.

**Aprenderás:**
- ❌ Por qué NO debes crear el Sidebar en cada vista
- ✅ Cómo funciona el Layout principal
- ✅ Cómo crear tus vistas correctamente
- ✅ Cómo agregar tu módulo al menú de navegación
- ✅ Cómo configurar rutas
- ✅ Errores comunes y cómo evitarlos

**👉 Lee esto ANTES de empezar a codear tus páginas.**

---

### 3. 🧩 [GUIA-COMPONENTES-REUTILIZABLES.md](GUIA-COMPONENTES-REUTILIZABLES.md) - **USA LO QUE YA EXISTE**

**Lista de componentes listos para usar en tu módulo.**

**⚠️ No reinventes la rueda:** Si un componente ya existe, úsalo.

**Componentes disponibles:**
- 🪟 **Modal** - Ventanas emergentes y diálogos
- 📄 **Pagination** - Paginación para tablas y listas
- 🔒 **PrivateRoute** - Protección de rutas (ya implementado)

**Aprenderás:**
- ✅ Cómo usar cada componente con ejemplos completos
- ✅ Props disponibles y sus tipos
- ✅ Buenas prácticas de uso
- ✅ Cómo crear nuevos componentes reutilizables

**👉 Consulta esta guía cuando necesites funcionalidad común.**

---

## 🎯 Flujo de Lectura Recomendado

### Para Nuevos Desarrolladores:

```
1️⃣ GUIA-DESARROLLO.md
   ↓ (Configura tu entorno)
   
2️⃣ GUIA-SIDEBAR.md
   ↓ (Entiende la estructura)
   
3️⃣ GUIA-COMPONENTES-REUTILIZABLES.md
   ↓ (Conoce las herramientas disponibles)
   
4️⃣ ¡Comienza a desarrollar tu módulo! 🚀
```

### Para Consultas Rápidas:

- **¿Cómo creo una rama?** → [GUIA-DESARROLLO.md](GUIA-DESARROLLO.md#2-crear-tu-rama-de-trabajo)
- **¿Cómo agrego un item al menú?** → [GUIA-SIDEBAR.md](GUIA-SIDEBAR.md#📝-cómo-agregar-tu-módulo-al-sidebar)
- **¿Cómo uso el Modal?** → [GUIA-COMPONENTES-REUTILIZABLES.md](GUIA-COMPONENTES-REUTILIZABLES.md#1-modal---ventanas-emergentes)
- **¿Cómo pagino una tabla?** → [GUIA-COMPONENTES-REUTILIZABLES.md](GUIA-COMPONENTES-REUTILIZABLES.md#2-pagination---paginación-de-tablas)

---

## 📁 Estructura del Proyecto (Resumen)

```
proyecto-escuela-primaria/
├── bd/                           # Scripts de Base de Datos
├── escuelita-backend/            # Backend (Spring Boot)
├── escuelita-frontend/           # Frontend (React + TypeScript)
│   └── src/
│       ├── components/
│       │   ├── common/           # 🧩 Componentes reutilizables
│       │   └── layout/           # 🧭 Sidebar, TopBar, etc.
│       ├── features/
│       │   ├── backoffice/       # ❌ Solo Super Admin
│       │   └── portal/           # ✅ Aquí trabajamos
│       ├── layouts/              # Layouts principales
│       ├── pages/                # Páginas principales
│       └── routes/               # Configuración de rutas
└── archivo/                      # 📖 Esta carpeta con las guías
```

---

## 🎓 Conceptos Clave

### 🔹 Backoffice
**Módulos de Super Admin** - Gestión de instituciones, suscripciones, usuarios del sistema.
- ❌ **NO trabajas aquí** a menos que seas parte del equipo de super admin.

### 🔹 Portal
**Módulos de cada Escuela** - Alumnos, docentes, matrículas, evaluaciones, pagos, etc.
- ✅ **Aquí es donde desarrollas tu módulo.**

### 🔹 Layout
**Plantilla principal** - Contiene el Sidebar y TopBar que se muestran en todas las páginas.
- ℹ️ Ya está implementado, no necesitas recrearlo.

### 🔹 Componentes Reutilizables
**Piezas de código compartidas** - Modal, Pagination, Buttons, etc.
- ✅ Úsalos para mantener consistencia y ahorrar tiempo.

---

## ⚡ Comandos Rápidos

### Configuración Inicial
```bash
# Actualizar repositorio
git checkout main
git pull origin main

# Crear tu rama
git switch -c feature/tu-modulo

# Instalar dependencias
cd escuelita-frontend
npm install

# Iniciar desarrollo
npm run dev
```

### Durante el Desarrollo
```bash
# Ver estado
git status

# Guardar cambios
git add .
git commit -m "Descripción de cambios"

# Subir cambios
git push origin feature/tu-rama
```

---

## 🆘 ¿Tienes Dudas?

### Antes de Preguntar:
1. ✅ Verifica las guías de documentación
2. ✅ Busca en los módulos existentes (ej: `backoffice/instituciones`)
3. ✅ Revisa si existe un componente reutilizable

### Si Aún Tienes Dudas:
- 💬 Pregunta en el grupo
- 🤝 Consulta con el equipo
- 🤖 Usa GitHub Copilot o tu IA favorita

**RECUERDA:** No hay preguntas tontas. ¡PREGUNTA! 😊

---

## 📅 Presentación de Avances

**Fecha:** Lunes (próxima presentación)

**Qué Preparar:**
- ✅ Demo funcional de tu módulo
- ✅ Explicación de qué implementaste
- ✅ Problemas encontrados y soluciones
- ✅ Código limpio y documentado

---

## ✨ Buenas Prácticas

1. **Lee las guías completas** antes de empezar
2. **Sigue la estructura de carpetas** establecida
3. **Reutiliza componentes** existentes
4. **Commits frecuentes** con mensajes claros
5. **NO trabajes en la rama main**
6. **Pregunta si tienes dudas**
7. **Mantén tu código limpio y ordenado**

---

## 🎯 Objetivo

Desarrollar un sistema de gestión escolar completo, colaborativo y de calidad.

**Cada uno es responsable de su módulo.**

**El trabajo en equipo es fundamental.**

**La comunicación es clave.**

---

**¡Éxito en el desarrollo! 🚀**

---

## 📝 Notas

Este proyecto es un trabajo en equipo. Respeta el trabajo de tus compañeros, sigue las guías establecidas y mantén una comunicación constante.

**Si encuentras un error en las guías o quieres agregar información útil, compártelo con el equipo.**

---

_Última actualización: Marzo 2026_
