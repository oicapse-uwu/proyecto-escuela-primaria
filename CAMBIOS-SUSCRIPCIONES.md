# Cambios en Sistema de Suscripciones

## Fecha: 6 de Marzo 2026

### ✅ Problemas Corregidos

#### 1. **Estado "Pendiente" al Crear Suscripción**
**Antes:** La suscripción se marcaba como "Activa" inmediatamente al crearla, sin verificar pagos.

**Ahora:** 
- Al crear una suscripción → Estado **"Pendiente"**
- Al verificar un pago que **cubre el mes actual** → Estado cambia a **"Activa"**
- Si verificas un pago de meses pasados → Permanece **"Pendiente"** hasta que verifiques el pago del mes actual
- La institución NO puede acceder al sistema hasta que tengan un pago verificado que cubra el mes actual

#### 2. **Corrección de Fechas en Pagos**
**Antes:** Si creabas de 01-01-2026 a 01-01-2027:
- Generaba desde 31-12-2025 hasta 30-11-2026 (incorrecto)

**Ahora:** 
- Genera correctamente desde 01-01-2026 hasta 01-01-2027 (incluye ambos extremos)
- Ajusta automáticamente para incluir el mes de vencimiento

#### 3. **Eliminación en Cascada**
**Antes:** Al eliminar una suscripción quedaban pagos huérfanos que causaban errores 500.

**Ahora:**
- Al eliminar una suscripción, se eliminan automáticamente todos sus pagos asociados
- No más errores de pagos huérfanos

#### 4. **Validación de Registro Cronológico**
**Ahora:** No puedes registrar un pago de marzo si no has registrado enero y febrero primero.

#### 5. **Validación de Acceso por Pagos al Día**
**Ahora:** Al hacer login, se verifica:
- Estado "Activa" ✅
- Fecha de vencimiento no pasada ✅
- **Tener un pago VERIFICADO que cubra el mes actual** ✅

---

## 📋 Pasos para Implementar

### 1. Ejecutar SQL en cPanel
```sql
-- Agregar estado "Pendiente"
INSERT INTO `estados_suscripcion` (`id_estado`, `nombre`, `estado`) VALUES
(5, 'Pendiente', 1);
```

### 2. Limpiar Datos Huérfanos (si existen)
```sql
-- Ver pagos huérfanos
SELECT COUNT(*) FROM pagos_suscripcion 
WHERE id_suscripcion NOT IN (SELECT id_suscripcion FROM suscripciones WHERE estado = 1);

-- Eliminar pagos huérfanos
DELETE FROM pagos_suscripcion 
WHERE id_suscripcion NOT IN (SELECT id_suscripcion FROM suscripciones WHERE estado = 1);
```

### 3. Subir Nuevo JAR
- Archivo: `escuelita-backend\target\www-0.0.1-SNAPSHOT.jar`
- Subir a cPanel
- Reiniciar servidor

### 4. Probar el Flujo Completo

#### Paso 1: Crear Suscripción
- Ir a **Suscripciones → Nueva Suscripción**
- Llenar datos:
  - Institución: Prueba 1
  - Plan: Emprendedor
  - Fecha inicio: **1 enero 2026**
  - Fecha vencimiento: **31 diciembre 2026**
  - Ciclo: **Mensual**
  - Precio: S/ 150.00
- Guardar

**Resultado esperado:**
- Estado: **Pendiente** (badge amarillo)
- Se generan 12 pagos automáticamente (enero a diciembre 2026)

#### Paso 2: Verificar Pagos Generados
- Ir a **Pagos de Suscripciones**

**Resultado esperado:**
- 12 pagos en estado PENDIENTE
- Fechas: 31 ene 2026, 28 feb 2026, 31 mar 2026, ..., 31 dic 2026
- Botón "Registrar Pago" visible en cada uno

#### Paso 3: Registrar Primer Pago
- Click en "Registrar Pago" del pago de **31 enero 2026** (el primero)
- Subir comprobante de pago
- Seleccionar método: Efectivo
- Monto: S/ 150.00
- Guardar

**Resultado esperado:**
- Pago cambia a estado PENDIENTE (con comprobante)
- Aparece botón "Ver" en lugar de "Registrar Pago"

#### Paso 4: Verificar Pago (Como Admin)
- Click en "Ver" del pago recién registrado
- Click en "Verificar Pago"

**Resultado esperado:**
- Pago cambia a VERIFICADO (badge verde)
- **Si el pago NO cubre el mes actual (enero, estamos en marzo):**
  - ⚠️ Suscripción permanece en **"Pendiente"**
  - Log: "⚠️ Pago verificado pero NO cubre el período actual. Suscripción permanece en estado Pendiente."
- **Si el pago SÍ cubre el mes actual (marzo):**
  - ✅ Suscripción cambia a **"Activa"**
  - Log: "✅ Suscripción ID X activada tras verificar pago que cubre el período actual"

#### Paso 5: Intentar Registrar Pago de Marzo (sin Febrero)
- Intentar registrar el pago de **31 marzo 2026**

**Resultado esperado:**
- ❌ Bloquea con mensaje: "No puede registrar este pago. Primero debe registrar el pago correspondiente a 28-02-2026 (PAGO-XXXXX)"

#### Paso 6: Probar Login de Institución
- Intentar hacer login como usuario de "Prueba 1"

**Con pago de enero verificado (estamos en marzo 2026):**
- ❌ Acceso denegado: "Sus pagos no están al día. El último pago verificado no cubre el período actual."

**Después de registrar y verificar el pago de febrero y marzo:**
- ✅ Acceso permitido

---

## 📊 Estados de Suscripción

| ID | Estado | Cuándo se aplica |
|----|--------|------------------|
| 1 | Activa | Tiene al menos 1 pago verificado que cubre el mes actual |
| 2 | Vencida | Fecha de vencimiento pasada |
| 3 | Suspendida | Manualmente suspendida por admin |
| 4 | Cancelada | Cancelada manualmente |
| 5 | **Pendiente** | Recién creada SIN pagos verificados, O con pagos verificados que NO cubren el mes actual ✨ NUEVO |

---

## 🎯 Flujo de Estados

```
Crear Suscripción
     ↓
[PENDIENTE] ← Sin pagos verificados
     ↓
Verificar pago de mes PASADO
     ↓
[PENDIENTE] ← Pago verificado pero NO cubre mes actual
     ↓
Verificar pago del mes ACTUAL
     ↓
[ACTIVA] ← Con pagos al día
     ↓
Mes avanza, no pagan
     ↓
[ACTIVA pero NO puede acceder] ← Estado activo pero validación de login bloquea
     ↓
Verificar pago del nuevo mes actual
     ↓
[ACTIVA] ← Pueden acceder nuevamente
```

---

## ⚠️ Importante

- **NUNCA elimines suscripciones directamente de la BD**
  - Usa el botón "Eliminar" del frontend (ahora elimina pagos automáticamente)
  - O cambia el estado a "Cancelada"

- **El último JAR compilado incluye:**
  - Estado Pendiente al crear
  - Corrección de fechas (+1 día al calcular)
  - Validación de registro cronológico
  - Validación de pagos al día en login
  - Eliminación en cascada de pagos
  - **Cambio a Activa solo si el pago verificado cubre el mes actual** ✨

- **Escenario de ejemplo (estamos en 6 marzo 2026):**
  - Creas suscripción de 1 ene a 31 dic 2026 → Estado: **Pendiente**
  - Registras y verificas pago de enero → Estado: **Pendiente** (enero no cubre marzo)
  - Registras y verificas pago de febrero → Estado: **Pendiente** (febrero no cubre marzo)
  - Registras y verificas pago de marzo → Estado: **Activa** ✅ (marzo cubre el período actual)
  - Usuario puede hacer login exitosamente
