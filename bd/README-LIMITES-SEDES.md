# 📊 Sistema de Distribución de Límites por Sede

## 📋 Descripción General

Este sistema permite gestionar la distribución del límite de alumnos contratado en una suscripción entre las diferentes sedes de una institución educativa.

---

## 🎯 Conceptos Clave

### Límite Institucional
- Una **suscripción** define un límite total de alumnos para toda la **institución**
- Este límite es **compartido** entre todas las sedes de la institución

### Tipos de Distribución

#### 1️⃣ **EQUITATIVA** (Por defecto)
- El límite total se divide automáticamente en partes iguales entre todas las sedes activas
- Ejemplo: 1000 alumnos ÷ 3 sedes = 333 alumnos por sede (+ 334 en la primera sede por el residuo)

#### 2️⃣ **PERSONALIZADA**
- El administrador asigna manualmente cuántos alumnos corresponden a cada sede
- El sistema valida que la suma no exceda el límite total contratado

---

## 🗄️ Estructura de Base de Datos

### Tabla: `limites_sedes_suscripcion`

```sql
CREATE TABLE limites_sedes_suscripcion (
    id_limite_sede BIGINT PRIMARY KEY AUTO_INCREMENT,
    id_suscripcion BIGINT NOT NULL,
    id_sede BIGINT NOT NULL,
    limite_alumnos_asignado INT NOT NULL,
    estado INT DEFAULT 1,
    FOREIGN KEY (id_suscripcion) REFERENCES suscripciones(id_suscripcion),
    FOREIGN KEY (id_sede) REFERENCES sedes(id_sede)
);
```

### Modificaciones a `suscripciones`

```sql
ALTER TABLE suscripciones 
ADD COLUMN tipo_distribucion_limite VARCHAR(20) DEFAULT 'EQUITATIVA';
```

**Valores válidos:**
- `'EQUITATIVA'` - Distribución automática
- `'PERSONALIZADA'` - Distribución manual

---

## 🔌 API Endpoints

### Base URL: `/api/limites-sedes`

#### 1. Listar todos los límites
```http
GET /api/limites-sedes
```

**Respuesta:**
```json
[
  {
    "idLimiteSede": 1,
    "idSuscripcion": {...},
    "idSede": {...},
    "limiteAlumnosAsignado": 333,
    "estado": 1
  }
]
```

---

#### 2. Obtener límites de una suscripción
```http
GET /api/limites-sedes/suscripcion/{idSuscripcion}
```

**Ejemplo:** `GET /api/limites-sedes/suscripcion/5`

---

#### 3. Generar distribución equitativa
```http
POST /api/limites-sedes/equitativa/{idSuscripcion}
```

**Ejemplo:** `POST /api/limites-sedes/equitativa/5`

**Respuesta:**
```json
{
  "mensaje": "Distribución equitativa generada exitosamente",
  "limites": [
    {
      "idLimiteSede": 1,
      "limiteAlumnosAsignado": 334
    },
    {
      "idLimiteSede": 2,
      "limiteAlumnosAsignado": 333
    },
    {
      "idLimiteSede": 3,
      "limiteAlumnosAsignado": 333
    }
  ]
}
```

**Lógica:**
- Elimina distribución anterior
- Divide el límite total entre el número de sedes activas
- Distribuye el residuo entre las primeras sedes

---

#### 4. Guardar distribución personalizada
```http
POST /api/limites-sedes/personalizada/{idSuscripcion}
```

**Body:**
```json
[
  {
    "idSede": 1,
    "limiteAlumnosAsignado": 600
  },
  {
    "idSede": 2,
    "limiteAlumnosAsignado": 400
  }
]
```

**Validaciones:**
- ✅ Valida que la suma no exceda el límite total
- ✅ Elimina distribución anterior antes de guardar
- ❌ Responde error si se excede el límite

---

#### 5. Crear límite individual
```http
POST /api/limites-sedes
```

**Body:**
```json
{
  "idSuscripcion": 5,
  "idSede": 3,
  "limiteAlumnosAsignado": 250
}
```

---

#### 6. Actualizar límite
```http
PUT /api/limites-sedes/{id}
```

**Body:**
```json
{
  "limiteAlumnosAsignado": 300
}
```

---

#### 7. Eliminar límite
```http
DELETE /api/limites-sedes/{id}
```

---

## 🧩 Componentes Backend

### Entidades
- `LimitesSedesSuscripcion.java` - Entidad principal
- `LimitesSedesSuscripcionDTO.java` - DTO para transferencia de datos

### Repository
- `LimitesSedesSuscripcionRepository.java`
  - Métodos de búsqueda por suscripción y sede
  - Eliminación en cascada

### Service
- `ILimitesSedesSuscripcionService.java` - Interfaz
- `LimitesSedesSuscripcionService.java` - Implementación
  - Generación de distribución equitativa
  - Validación de límites personalizados

### Controller
- `LimitesSedesSuscripcionController.java`
  - Endpoints REST
  - Manejo de errores

---

## 📊 Flujo de Trabajo

### Caso 1: Distribución Equitativa

```
1. Admin crea suscripción
   └─ Límite total: 1000 alumnos
   └─ Tipo: EQUITATIVA

2. Sistema detecta 3 sedes activas

3. POST /api/limites-sedes/equitativa/5
   └─ Cálculo: 1000 ÷ 3 = 333 (residuo 1)
   └─ Sede 1: 334 alumnos
   └─ Sede 2: 333 alumnos
   └─ Sede 3: 333 alumnos
```

### Caso 2: Distribución Personalizada

```
1. Admin crea suscripción
   └─ Límite total: 1000 alumnos
   └─ Tipo: PERSONALIZADA

2. Admin define distribución
   └─ Sede Principal: 600 alumnos
   └─ Sede Norte: 250 alumnos
   └─ Sede Sur: 150 alumnos

3. POST /api/limites-sedes/personalizada/5
   └─ Validación: 600 + 250 + 150 = 1000 ✅
   └─ Guarda distribución
```

---

## 🔄 Próximos Pasos (Frontend)

Ahora que el backend está completo, se debe implementar en el frontend:

1. **Tipos TypeScript**
   - Interface `LimiteSedeSuscripcion`
   - Interface `DistribucionLimites`

2. **API Client**
   - `limitesSedesApi.ts` con todos los endpoints

3. **Componentes**
   - `DistribucionLimitesModal.tsx` - Modal para configurar distribución
   - Selector de tipo: Equitativa vs Personalizada
   - Tabla de sedes con inputs de límites

4. **Integración**
   - En `SuscripcionForm.tsx` agregar gestión de límites
   - Mostrar distribución actual en `InstitucionDetallePage.tsx`

---

## ✅ Validaciones Implementadas

### Backend
- ✅ Suma de límites no excede el total contratado
- ✅ Suscripción debe existir
- ✅ Sede debe existir y pertenecer a la institución
- ✅ No permite duplicados (unique key en BD)

### Pendientes (Frontend)
- ⏳ Mostrar advertencia si quedan alumnos sin asignar
- ⏳ Deshabilitar sedes cuando se alcanza el límite
- ⏳ Mostrar progreso visual de distribución

---

## 📝 Notas Importantes

1. **Eliminación en cascada**: Si se elimina una suscripción, se eliminan automáticamente sus límites
2. **Soft delete**: Los límites usan `estado=0` para eliminación lógica
3. **Constraint único**: No puede haber dos límites para la misma sede en la misma suscripción
4. **Flexibilidad**: Se puede cambiar de equitativa a personalizada en cualquier momento

---

## 🚀 Migración

Para aplicar los cambios a la base de datos:

```sql
SOURCE bd/migration-limites-sedes.sql;
```

O ejecutar manualmente desde phpMyAdmin.
