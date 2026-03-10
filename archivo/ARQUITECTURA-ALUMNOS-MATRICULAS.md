# Arquitectura Correcta: Alumnos, Matrículas y Movimientos

## 📊 Separación de Responsabilidades

### 1. Tabla ALUMNOS
**Responsabilidad:** Datos personales inmutables del estudiante
```sql
CREATE TABLE `alumnos` (
  `id_alumno` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `id_sede` bigint(20) UNSIGNED NOT NULL,
  `id_tipo_doc` bigint(20) UNSIGNED NOT NULL,
  `numero_documento` varchar(20) NOT NULL,
  `nombres` varchar(100) NOT NULL,
  `apellidos` varchar(100) NOT NULL,
  `fecha_nacimiento` date NOT NULL,
  `genero` enum('M','F') NOT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `telefono_contacto` varchar(20) DEFAULT NULL,
  `foto_url` varchar(255) DEFAULT NULL,
  `observaciones_salud` text DEFAULT NULL,
  `estado` int(11) DEFAULT 1,
  PRIMARY KEY (`id_alumno`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
```

**Campos ELIMINADOS:**
- ❌ `tipo_ingreso` → va en matrícula
- ❌ `estado_alumno` → se deriva de la matrícula activa

---

### 2. Tabla MATRICULAS
**Responsabilidad:** Inscripción de un alumno en un año escolar/sección
```sql
CREATE TABLE `matriculas` (
  `id_matricula` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `id_alumno` bigint(20) UNSIGNED NOT NULL,
  `id_seccion` bigint(20) UNSIGNED NOT NULL,
  `id_anio` bigint(20) UNSIGNED NOT NULL,
  `codigo_matricula` varchar(30) UNIQUE,
  `fecha_matricula` datetime DEFAULT current_timestamp(),
  `fecha_vencimiento_pago` datetime DEFAULT NULL,
  `tipo_ingreso` enum('Nuevo','Promovido','Repitente','Trasladado_Entrante') NOT NULL,
  `estado_matricula` enum('Pendiente_Pago','Activa','Finalizada','Cancelada') NOT NULL DEFAULT 'Pendiente_Pago',
  `vacante_garantizada` tinyint(1) DEFAULT 0 COMMENT 'Si es promovido/repitente, su vacante está garantizada',
  `fecha_pago_matricula` datetime DEFAULT NULL COMMENT 'Fecha en que se confirmó el pago',
  `observaciones` text DEFAULT NULL,
  `estado` int(11) DEFAULT 1,
  PRIMARY KEY (`id_matricula`),
  KEY `idx_alumno_anio` (`id_alumno`, `id_anio`),
  KEY `idx_estado_tipo` (`estado_matricula`, `tipo_ingreso`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
```

**Estados simplificados:**
- `Pendiente_Pago`: Matrícula iniciada, esperando pago para confirmar vacante
- `Activa`: **Pago confirmado, vacante asegurada** (o garantizada si es promovido)
- `Finalizada`: Año escolar completado
- `Cancelada`: No confirmó pago o error administrativo

**Campos CLAVE:**
- ✅ `vacante_garantizada`: Diferencia promovidos (garantizados) de nuevos (compiten)
- ✅ `fecha_vencimiento_pago`: Plazo límite para confirmar pago
- ✅ `fecha_pago_matricula`: Timestamp cuando se confirmó el pago (orden de llegada)

**Campos ELIMINADOS de matrícula:**
- ❌ `fecha_retiro` → va en tabla de movimientos
- ❌ `motivo_retiro` → va en tabla de movimientos
- ❌ `colegio_destino` → va en tabla de movimientos
- ❌ `situacion_academica_previa` → reemplazado por `tipo_ingreso`

---

### 3. Tabla MOVIMIENTOS_ALUMNO (NUEVA)
**Responsabilidad:** Gestionar retiros, traslados y cambios de estado
```sql
CREATE TABLE `movimientos_alumno` (
  `id_movimiento` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `id_matricula` bigint(20) UNSIGNED NOT NULL,
  `tipo_movimiento` enum('Retiro','Traslado_Saliente','Cambio_Seccion') NOT NULL,
  `fecha_movimiento` date NOT NULL,
  `fecha_solicitud` datetime DEFAULT current_timestamp(),
  `motivo` text NOT NULL,
  `colegio_destino` varchar(200) DEFAULT NULL,
  `documentos_url` varchar(255) DEFAULT NULL,
  `observaciones` text DEFAULT NULL,
  `id_usuario_registro` bigint(20) UNSIGNED DEFAULT NULL,
  `id_usuario_aprobador` bigint(20) UNSIGNED DEFAULT NULL,
  `fecha_aprobacion` datetime DEFAULT NULL,
  `estado_solicitud` enum('Pendiente','Aprobada','Rechazada') DEFAULT 'Pendiente',
  `estado` int(11) DEFAULT 1,
  PRIMARY KEY (`id_movimiento`),
  KEY `idx_matricula` (`id_matricula`),
  KEY `idx_fecha` (`fecha_movimiento`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
```

**Tipos de movimiento:**
- `Retiro`: Abandono de la institución
- `Traslado_Saliente`: Cambio a otra institución
- `Cambio_Seccion`: Cambio interno de sección/grado

---

## 🔄 Flujo de Trabajo (Lógica Real del Negocio)

### Caso 1: Alumno Nuevo (Ingresante)
**Compite por vacantes - El que PAGA primero gana**

1. **Inicio de matrícula:**
   - Se verifica que haya capacidad en la sección (puede permitir "sobreventa")
   - Se crea registro en `alumnos`
   - Se crea `matricula`:
     - `tipo_ingreso = 'Nuevo'`
     - `estado_matricula = 'Pendiente_Pago'`
     - `vacante_garantizada = 0` ⚠️
     - `fecha_vencimiento_pago = NOW() + 7 días`
     - `fecha_pago_matricula = NULL`

2. **Competencia por vacantes:**
   - Pueden haber 5 solicitudes `Pendiente_Pago` para 3 vacantes
   - **Las vacantes se asignan cuando se PAGA**, no cuando se registra
   - Los primeros 3 que paguen → `Activa` (ganan vacante)
   - Los otros 2 → `Cancelada` (sin vacante disponible)

3. **Confirmación de pago:**
   - Al registrar pago → Se verifica capacidad real
   - Si aún hay vacante → `estado_matricula = 'Activa'`, `fecha_pago_matricula = NOW()`
   - Si ya no hay vacante → `estado_matricula = 'Cancelada'` (llegó tarde)

4. **Expiración:**
   - Si pasa `fecha_vencimiento_pago` sin pagar → `estado_matricula = 'Cancelada'`

### Caso 2: Alumno Promovido (2do → 3ero)
**Vacante GARANTIZADA - No compite con nuevos**

1. **Creación automática al cerrar año:**
   - Al finalizar año escolar, se marca matrícula anterior como `Finalizada`
   - Se crea nueva `matricula` para el siguiente año:
     - `tipo_ingreso = 'Promovido'`
     - `estado_matricula = 'Activa'` ✅ (directo, sin validación de pago)
     - `vacante_garantizada = 1` 🔒
     - `fecha_pago_matricula = NULL` (puede pagar después)
     - `fecha_vencimiento_pago = NULL` (no tiene deadline estricto)

2. **Pago flexible:**
   - Su vacante está asegurada independientemente del pago
   - El pago es para generar deuda/compromiso financiero
   - No afecta su cupo en la sección

### Caso 3: Alumno Repitente
**Vacante GARANTIZADA en el mismo grado**

1. Similar a promovido:
   - `tipo_ingreso = 'Repitente'`
   - `estado_matricula = 'Activa'` (directo)
   - `vacante_garantizada = 1` 🔒
   - No compite con nuevos ingresantes

### Caso 4: Alumno Trasladado Entrante
**Compite igual que nuevos**

1. Misma lógica que alumno nuevo:
   - `tipo_ingreso = 'Trasladado_Entrante'`
   - `vacante_garantizada = 0` ⚠️
   - Debe pagar para asegurar vacante
   - Compite con otros nuevos/trasladados

### Retiro de Alumno
### Proceso CRÍTICO de Pago de Matrícula
**Importante:** El pago se gestiona en la tabla `pagos` con `concepto_pago.nombre = 'Matrícula'`

**Al registrar un pago de matrícula:**

```sql
-- Pseudo-código del proceso
1. Se registra el pago en tabla `pagos`
2. Service valida:
   
   IF vacante_garantizada = 1 THEN
       -- Promovido/Repitente: Actualizar directo
       UPDATE matriculas SET 
           estado_matricula = 'Activa',
           fecha_pago_matricula = NOW()
       WHERE id_matricula = ?
   
   ELSE
       -- Nuevo/Trasladado: Verificar capacidad real
       SELECT COUNT(*) FROM matriculas 
       WHERE id_seccion = ? 
         AND id_anio = ?
         AND estado_matricula = 'Activa'
         INTO vacantes_ocupadas
       
       IF vacantes_ocupadas < capacidad_maxima THEN
           -- Hay vacante, confirmar
           UPDATE matriculas SET 
               estado_matricula = 'Activa',
               fecha_pago_matricula = NOW()
           WHERE id_matricula = ?
       ELSE
           -- No hay vacante (otro pagó antes)
           UPDATE matriculas SET estado_matricula = 'Cancelada'
           -- Revertir/reembolsar pago
       END IF
   END IF
```

**Job automático de expiración:**
```sql
-- Ejecutar diariamente
UPDATE matriculas 
SET estado_matricula = 'Cancelada'
WHERE estado_matricula = 'Pendiente_Pago'
  AND vacante_garantizada = 0
  AND fecha_vencimiento_pago < NOW();
```

### Consultas SQL Importantes

**Alumnos activos en año actual:**
```sql
SELECT a.*, m.*
FROM alumnos a
INNER JOIN matriculas m ON a.id_alumno = m.id_alumno
WHERE m.id_anio = (SELECT id_anio FROM anio_escolar WHERE activo = 1)
  AND m.estado_matricula = 'Activa'
  AND a.estado = 1;
```

**Matrículas con pago vencido:**
```sql
SELECT m.*, a.nombres, a.apellidos
FROM matriculas m
INNER JOIN alumnos a ON m.id_alumno = a.id_alumno
WHERE m.estado_matricula = 'Pendiente_Pago'
  AND m.fecha_vencimiento_pago < NOW()
  AND m.vacante_garantizada = 0;
```

**Vacantes disponibles por sección (REAL):**
```sql
SELECT s.nombre_seccion, s.capacidad_maxima,
       COUNT(CASE WHEN m.estado_matricula = 'Activa' THEN 1 END) as vacantes_confirmadas,
       COUNT(CASE WHEN m.estado_matricula = 'Pendiente_Pago' AND m.vacante_garantizada = 0 THEN 1 END) as pendientes_competencia,
       COUNT(CASE WHEN m.vacante_garantizada = 1 THEN 1 END) as vacantes_garantizadas,
       (s.capacidad_maxima - COUNT(CASE WHEN m.estado_matricula = 'Activa' THEN 1 END)) as vacantes_disponibles
FROM secciones s
LEFT JOIN matriculas m ON s.id_seccion = m.id_seccion 
    AND m.id_anio = (SELECT id_anio FROM anio_escolar WHERE activo = 1)
GROUP BY s.id_seccion;
```

**Orden de pago (quién llegó primero):**
```sql
-- Útil para resolver conflictos
SELECT m.*, a.nombres, a.apellidos, m.fecha_pago_matricula
FROM matriculas m
INNER JOIN alumnos a ON m.id_alumno = a.id_alumno
WHERE m.id_seccion = ?
  AND m.estado_matricula = 'Activa'
  AND m.vacante_garantizada = 0
ORDER BY m.fecha_pago_matricula ASC;
```

### Retiro de Alumno
1. Se crea registro en `movimientos_alumno` con `tipo_movimiento='Retiro'`
2. El estado puede ser `Pendiente` (requiere aprobación)
3. Una vez aprobado, se actualiza `matricula.estado_matricula = 'Finalizada'`
4. **La matrícula NO se elimina**, queda como histórico

### Traslado a Otro Colegio
1. Se crea registro en `movimientos_alumno` con `tipo_movimiento='Traslado_Saliente'`
2. Se llena `colegio_destino`
3. Se adjuntan documentos si es necesario
4. Workflow de aprobación
5. Se actualiza estado de matrícula

---

## 📈 Ventajas de Esta Arquitectura

### ✅ Trazabilidad Completa
- Histórico de todos los movimientos del alumno
- Quién autorizó cada movimiento y cuándo
- Documentación de respaldo

### ✅ Workflow de Aprobación
- Los retiros pueden requerir aprobación
- Estado `Pendiente` → `Aprobada` → `Rechazada`
- Reversibilidad si hay error

### ✅ Auditoría
- Todas las acciones quedan registradas
- Fechas de solicitud vs aprobación
- Usuario que realizó cada acción

### ✅ Reportería
- Tasa de retiros por periodo
- Motivos más comunes
- Colegios de destino frecuentes
- Análisis de deserción

### ✅ Flexibilidad
- Se pueden agregar nuevos tipos de movimiento
- Campos adicionales sin afectar tablas maestras
- Documentos adjuntos por movimiento

### ✅ Gestión de Vacantes Justa
- Alumnos promovidos/repitentes tienen prioridad (vacante asegurada)
- Nuevos/trasladados compiten por vacantes disponibles
- Sistema de expiración automática para liberar vacantes no pagadas
- Permite configurar tiempo de gracia por tipo de ingreso

---

## 🔄 Comparación: Antes vs Después

### ❌ ANTES (Incorrecto)
```
alumnos
├── tipo_ingreso (❌ va en matrícula)
└── estado_alumno (❌ se deriva de matrícula)

matriculas
├── situacion_academica_previa
├── estado_matricula (con retiros mezclados)
├── fecha_retiro (❌ evento, no campo)
├── motivo_retiro (❌ evento, no campo)
└── colegio_destino (❌ evento, no campo)
```

### ✅ DESPUÉS (Correcto)
```
alumnos
└── (solo datos personales)

matriculas
├── tipo_ingreso (✅ nuevo/promovido/repitente/trasladado)
├── estado_matricula (✅ pendiente_pago/activa/finalizada/cancelada)
├── vacante_garantizada (✅ 1=promovidos, 0=compiten por pago)
├── fecha_pago_matricula (✅ orden de llegada del pago)
└── fecha_vencimiento_pago (✅ deadline para pagar)

movimientos_alumno (NUEVA)
├── tipo_movimiento
├── fecha_movimiento
├── motivo
├── colegio_destino
├── estado_solicitud
├── workflow de aprobación
└── trazabilidad completa
```

---

## 🎯 Escenario Real: Competencia por Vacantes

### Ejemplo Práctico
**Sección:** 3er Grado A - **Capacidad:** 30 alumnos

#### Estado Inicial
- Promovidos de 2do: **25 alumnos** → `vacante_garantizada = 1`, `estado_matricula = 'Activa'`
- Vacantes disponibles para nuevos: **5 vacantes**

#### Proceso de Inscripción

**Día 1 - 03/01/2026:**
- 🟡 **Alumno Nuevo A** se matricula → `Pendiente_Pago`, `fecha_vencimiento = 10/01/2026`
- 🟡 **Alumno Nuevo B** se matricula → `Pendiente_Pago`, `fecha_vencimiento = 10/01/2026`
- 🟡 **Alumno Nuevo C** se matricula → `Pendiente_Pago`, `fecha_vencimiento = 10/01/2026`

**Día 2 - 04/01/2026:**
- 🟡 **Alumno Nuevo D** se matricula → `Pendiente_Pago`, `fecha_vencimiento = 11/01/2026`
- 🟡 **Alumno Nuevo E** se matricula → `Pendiente_Pago`, `fecha_vencimiento = 11/01/2026`
- 🟡 **Alumno Nuevo F** se matricula → `Pendiente_Pago`, `fecha_vencimiento = 11/01/2026`
- 🟡 **Alumno Nuevo G** se matricula → `Pendiente_Pago`, `fecha_vencimiento = 11/01/2026`

**Situación:** 7 solicitudes `Pendiente_Pago` para 5 vacantes disponibles

#### ¿Quién gana las vacantes?

**Los primeros 5 en PAGAR:**

- **05/01 10:30 AM** - Alumno B paga → ✅ `Activa` (vacante 1/5)
- **05/01 2:45 PM** - Alumno D paga → ✅ `Activa` (vacante 2/5)
- **06/01 9:15 AM** - Alumno F paga → ✅ `Activa` (vacante 3/5)
- **06/01 11:00 AM** - Alumno A paga → ✅ `Activa` (vacante 4/5)
- **07/01 8:30 AM** - Alumno C paga → ✅ `Activa` (vacante 5/5) **ÚLTIMA VACANTE**

**Los que llegaron tarde:**

- **07/01 10:00 AM** - Alumno E intenta pagar → ❌ `Cancelada` (no hay vacantes)
- **08/01 3:00 PM** - Alumno G intenta pagar → ❌ `Cancelada` (no hay vacantes)

### Lógica del Sistema

| Tipo | vacante_garantizada | Comportamiento |
|------|---------------------|----------------|
| **Nuevo** | 0 | ⚠️ **COMPITE**: El primero que PAGUE gana la vacante |
| **Trasladado** | 0 | ⚠️ **COMPITE**: El primero que PAGUE gana la vacante |
| **Promovido** | 1 | 🔒 **GARANTIZADO**: Vacante asegurada, paga cuando quiera |
| **Repitente** | 1 | 🔒 **GARANTIZADO**: Vacante asegurada, paga cuando quiera |

### Mensaje al Padre/Madre

**Para Promovidos:**
> "Su hijo/a tiene su vacante asegurada para el próximo año. Puede realizar el pago de matrícula en cualquier momento sin perder su lugar."

**Para Nuevos/Trasladados:**
> "⚠️ IMPORTANTE: Su solicitud está en proceso. Para confirmar la vacante debe realizar el pago antes del [fecha_vencimiento]. Las vacantes se asignan por orden de pago confirmado. Vacantes disponibles: X"

---

## 📝 Notas Adicionales

### Estado del Alumno (Vista o Derivado)
El "estado actual" de un alumno NO es un campo, sino que se deriva de:
- ¿Tiene matrícula `Activa` en el año actual? → **Matriculado Activo**
- ¿Tiene matrícula `Pendiente_Pago` con `vacante_garantizada=1`? → **Promovido - Pendiente de Ratificar Pago**
- ¿Tiene matrícula `Pendiente_Pago` con `vacante_garantizada=0`? → **En Proceso - Compitiendo por Vacante**
- ¿Su última matrícula tiene movimiento de retiro aprobado? → **Retirado**
- ¿Su última matrícula tiene movimiento de traslado? → **Trasladado**
- ¿Su matrícula está `Cancelada` por no pago? → **Matrícula Cancelada**
- ¿No tiene matrícula en año actual? → **Sin Matrícula Vigente**

### Beneficios para el Usuario Final
- Histórico completo de cambios
- Posibilidad de revertir decisiones
- Documentación para auditorías
- Reportes estadísticos robustos
- Cumplimiento normativo

---

## 🚀 Implementación Recomendada

1. **Crear tabla `movimientos_alumno`**
2. **Migrar datos existentes** de campos de retiro en `matriculas` a `movimientos_alumno`
3. **Eliminar campos** `fecha_retiro`, `motivo_retiro`, `colegio_destino` de `matriculas`
4. **Limpiar tabla `alumnos`** (eliminar `tipo_ingreso` y `estado_alumno`)
5. **Actualizar backend** (entidades, servicios, controladores)
6. **Actualizar frontend** (formularios y vistas)
7. **Crear endpoints** para gestión de movimientos

---

*Fecha: 2026-03-09*
*Versión: 1.0*
