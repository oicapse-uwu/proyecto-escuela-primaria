# 🔗 Integración Completa del Módulo Evaluaciones

## ✅ Paso 1: Registrar Ruta en App.tsx

Abre tu archivo `escuelita-frontend/src/App.tsx` y agrega:

```tsx
import { EvaluacionesRoutes } from './features/portal/evaluaciones';

// Dentro de tu componente App, en la sección de Routes:
<Route path="/escuela/evaluaciones/*" element={<EvaluacionesRoutes />} />
```

**Ubicación esperada:**
```tsx
<Routes>
  <Route path="/escuela/alumnos/*" element={<AlumnosRoutes />} />
  <Route path="/escuela/matriculas/*" element={<MatriculasRoutes />} />
  
  {/* AGREGA AQUÍ */}
  <Route path="/escuela/evaluaciones/*" element={<EvaluacionesRoutes />} />
  
  // ... otras rutas
</Routes>
```

---

## ✅ Paso 2: Agregar Links en Sidebar

Abre el archivo de tu Sidebar/Layout (probablemente `src/layouts/EscuelaLayout.tsx` o un componente similar).

Busca donde están los links del navegación y agrega:

```tsx
<NavLink 
  to="/escuela/evaluaciones/calificaciones"
  className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
>
  <span>📋</span> Calificaciones
</NavLink>

<NavLink 
  to="/escuela/evaluaciones/asistencias"
  className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
>
  <span>✋</span> Asistencias
</NavLink>

<NavLink 
  to="/escuela/evaluaciones/evaluaciones"
  className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
>
  <span>📝</span> Evaluaciones
</NavLink>

<NavLink 
  to="/escuela/evaluaciones/promedios"
  className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
>
  <span>📊</span> Promedios
</NavLink>
```

**Si usas Tailwind CSS:**
```tsx
<NavLink 
  to="/escuela/evaluaciones/calificaciones"
  className={({ isActive }) => `px-4 py-2 rounded transition ${
    isActive ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'
  }`}
>
  📋 Calificaciones
</NavLink>

<NavLink 
  to="/escuela/evaluaciones/asistencias"
  className={({ isActive }) => `px-4 py-2 rounded transition ${
    isActive ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'
  }`}
>
  ✋ Asistencias
</NavLink>

<NavLink 
  to="/escuela/evaluaciones/evaluaciones"
  className={({ isActive }) => `px-4 py-2 rounded transition ${
    isActive ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'
  }`}
>
  📝 Evaluaciones
</NavLink>

<NavLink 
  to="/escuela/evaluaciones/promedios"
  className={({ isActive }) => `px-4 py-2 rounded transition ${
    isActive ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'
  }`}
>
  📊 Promedios
</NavLink>
```

---

## ✅ Paso 3: Probar en el Navegador

```bash
# En la carpeta escuelita-frontend
npm run dev

# Accede a:
# http://localhost:5173/escuela/evaluaciones/calificaciones
# http://localhost:5173/escuela/evaluaciones/asistencias
# http://localhost:5173/escuela/evaluaciones/evaluaciones
# http://localhost:5173/escuela/evaluaciones/promedios
```

Deberías ver:
- ✅ Las 4 páginas cargando sin errores
- ✅ El formulario y tabla en cada página
- ✅ El mensaje de multi-tenancy: "🌍 Mostrando datos de tu sede..."
- ✅ Los links activos en el sidebar

---

## 🧪 Pruebas Funcionales Recomendadas

### Calificaciones
1. Abre CalificacionesPage
2. Completa el formulario de calificación
3. Presiona "Crear Calificación"
4. Verifica que aparezca en la tabla

### Asistencias
1. Abre AsistenciasPage
2. Completa el formulario
3. Verifica que aparezca en la tabla con el color correcto (Presente=Verde, Falta=Rojo)

### Evaluaciones
1. Abre EvaluacionesPage
2. Completa el formulario con tema y fechas
3. Presiona "Crear Evaluación"
4. Verifica la tabla

### Promedios
1. Abre PromediosPage
2. Cambia el filtro: "Abierto" y "Cerrado/Enviado"
3. Verifica que los cards muestren la información correcta

---

## 🐛 Troubleshooting

### "El componente no carga"
- Verifica que has agregado la ruta en `App.tsx`
- Checks que el path sea exacto: `/escuela/evaluaciones/*`

### "No aparecen los datos"
- Abre la consola (F12)
- Verifica que no haya errores en rojo
- Chequea que tu JWT token sea válido
- Verifica que tengas permisos para el Módulo 7

### "Los links no aparecen en el sidebar"
- Busca el archivo del sidebar
- Verifica que hayas agregado los NavLinks
- Chequea la ubicación correcta

### "Error 403 o no autorizado"
- Verifica que el usuario tiene permisos para el Módulo 7
- Checkea que el JWT token no esté expirado
- Revisa el rol de usuario en la BD

---

## ✨ ¿Qué sigue?

Una vez que todo funcione:
1. Prueba crear datos en cada módulo
2. Verifica que se guarden en la BD
3. Recarga la página y confirma que los datos persisten
4. (OPCIONAL) Crea componentes adicionales para TiposNota y TiposEvaluacion

---

**Última actualización**: Hoy
**Status**: Listo para integración
**Próximo**: Ejecutar Paso 1, 2 y 3
