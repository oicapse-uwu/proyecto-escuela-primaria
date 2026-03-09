# 🔧 SOLUCIÓN: Error 500 en Calificaciones

## ❌ Problema Encontrado

Cuando accedías a la página de Calificaciones, recibías:
```
GET http://primaria.spring.informaticapp.com:4040/calificaciones 500 (Internal Server Error)
```

## ✅ Causa y Solución

El problema era que **los endpoints NO tenían el prefijo `/restful/`**.

### Endpoints Viejos (INCORRECTOS)
```typescript
GET /calificaciones          ❌
POST /calificaciones         ❌
PUT /calificaciones          ❌
DELETE /calificaciones/{id}  ❌
```

### Endpoints Nuevos (CORRECTOS)
```typescript
GET /restful/calificaciones          ✅
POST /restful/calificaciones         ✅
PUT /restful/calificaciones          ✅
DELETE /restful/calificaciones/{id}  ✅
```

---

## 🔀 Cambios Realizados

Se actualizó el archivo `evaluacionesApi.ts` para incluir `/restful/` en todos los endpoints:

### 1. Calificaciones
- ✅ `/restful/calificaciones` (obtener todas, crear)
- ✅ `/restful/calificaciones/{id}` (obtener por ID, actualizar, eliminar)

### 2. Asistencias
- ✅ `/restful/asistencias` (obtener todas, crear)
- ✅ `/restful/asistencias/{id}` (obtener por ID, actualizar, eliminar)

### 3. Evaluaciones
- ✅ `/restful/evaluaciones` (obtener todas, crear)
- ✅ `/restful/evaluaciones/{id}` (obtener por ID, actualizar, eliminar)

### 4. Promedios de Período
- ✅ `/restful/promediosperiodo` (obtener todos, crear)
- ✅ `/restful/promediosperiodo/{id}` (obtener por ID, actualizar, eliminar)

### 5. Tipos de Nota
- ✅ `/restful/tiposnota` (obtener todos, crear)
- ✅ `/restful/tiposnota/{id}` (obtener por ID, actualizar, eliminar)

### 6. Tipos de Evaluación
- ✅ `/restful/tiposevaluacion` (obtener todos, crear)
- ✅ `/restful/tiposevaluacion/{id}` (obtener por ID, actualizar, eliminar)

---

## 🔐 Autenticación Incluida

El cliente Axios (`api.config.ts`) ya está configurado para:
- ✅ Agregar automáticamente el token JWT en cada solicitud
- ✅ Detectar si eres usuario de `/escuela` o `/admin`
- ✅ Usar el token correcto (`escuela_token` en tu caso)
- ✅ Manejar errores de autenticación (401/403)

---

## 🧪 Cómo Probar

1. **Recarga la página** (Ctrl+R o Cmd+R)
2. **Navega a**: `http://localhost:5173/escuela/evaluaciones/calificaciones`
3. **Abre Console** (F12 → Console)
4. Deberías ver la lista de calificaciones cargadas

Si aún tienes erro, verifica:
- ✅ Estés logueado como usuario de escuela (no admin)
- ✅ Que tu usuario tenga el Módulo 7 (Evaluaciones y Notas) asignado
- ✅ Que haya datos de calificaciones en tu sede en la BD

---

## 📊 Estructura de Datos

Los endpoints ahora devuelven datos en esta estructura (heredados de backend):

### Calificaciones
```json
{
  "idCalificacion": 1,
  "notaObtenida": "18.5",
  "fechaCalificacion": "2026-03-07T10:30:00",
  "observaciones": "Excelente desempeño",
  "idEvaluacion": 1,
  "idMatricula": 1
}
```

### Asistencias
```json
{
  "idAsistencia": 1,
  "estadoAsistencia": "Presente",
  "fecha": "2026-03-07",
  "idAsignacion": 1,
  "idMatricula": 1
}
```

---

## ✨ Estado Actual

✅ **Endpoints**: Todos usan `/restful/` correctamente
✅ **Autenticación**: Token JWT automático en cada solicitud
✅ **Permisos**: Validados con `usePermisoModulo(7, 'VER')`
✅ **Multi-tenancy**: Filtro automático por sede en backend
✅ **Compilación**: Sin errores TypeScript

---

## 🔄 Próximos Pasos

1. Recarga el navegador
2. Navega a `/escuela/evaluaciones/calificaciones`
3. Si ves datos → ✅ **¡FUNCIONANDO!**
4. Si aún hay error → Verifica en la console cuál es el nuevo error

---

**Último cambio**: Hoy - Endpoints actualizados a `/restful/`
**Status**: ✅ LISTO PARA PROBAR
