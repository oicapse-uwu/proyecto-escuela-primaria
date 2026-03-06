# Guía: Estados Automáticos de Suscripción y Sistema de Pagos

## 📋 ÍNDICE
1. [Estados Automáticos](#estados-automáticos)
2. [Sistema de Pagos para Super Admin](#sistema-de-pagos-para-super-admin)
3. [Flujo Completo](#flujo-completo)
4. [Notas de Implementación](#notas-de-implementación)

---

## Estados Automáticos

El campo `estado` de las suscripciones es **AUTOMÁTICO** y NO editable desde el formulario. El sistema actualiza el estado según la lógica de pagos y fechas.

### Estados Disponibles

| Estado | ID | Condición | Color |
|--------|----|-----------| ------|
| **ACTIVA** | 1 | `fechaInicio <= hoy <= fechaVencimiento` Y `pagoConfirmado = true` | 🟢 Verde |
| **SUSPENDIDA** | 2 | `pagoConfirmado = false` O `pagoPendiente = true` | 🟡 Amarillo |
| **VENCIDA** | 3 | `fechaVencimiento < hoy` O `pagoAtrasado = true` | 🔴 Rojo |
| **CANCELADA** | 4 | Cancelación manual desde interfaz o API | ⚫ Gris |

### Flujo de Estados

```
NUEVA SUSCRIPCIÓN
     ↓
¿Pago confirmado?
     ├─ SÍ → ACTIVA
     └─ NO → SUSPENDIDA
     
ACTIVA
     ↓
¿Dejó de pagar o venció?
     ├─ SÍ → VENCIDA
     └─ NO → Sigue ACTIVA
     
SUSPENDIDA
     ↓
¿Confirmó pago?
     ├─ SÍ → ACTIVA
     └─ NO → Sigue SUSPENDIDA
     
CUALQUIER ESTADO
     ↓
¿Usuario canceló?
     └─ SÍ → CANCELADA (estado final)
```

---

## Sistema de Pagos para Super Admin

### 🎯 Objetivo
Gestionar los pagos de suscripciones desde el panel del Super Admin con:
- Registro de pagos con comprobante
- Verificación de comprobantes
- Actualización automática del estado de suscripción

### 📊 Tabla: `pagos_suscripcion`

**IMPORTANTE**: Esta tabla es exclusiva para el backoffice del Super Admin. NO confundir con las tablas de pagos de las escuelas (matrículas y pensiones de alumnos).

**Campos clave:**
- `numero_pago`: Generado automáticamente (PAGO-0001, PAGO-0002, ...)
- `comprobante_url`: Ruta del archivo de comprobante (imagen/PDF)
- `estado_verificacion`: ENUM('PENDIENTE', 'VERIFICADO', 'RECHAZADO')
- `verificado_por`: FK a `super_admins` (auto-asignado desde sesión)
- `fecha_registro`: Auto-generado via @PrePersist
- `banco`: Condicional (solo si método = "Transferencia Bancaria")

### 🔄 Flujo Completo del Sistema

```
1. CREACIÓN DE SUSCRIPCIÓN
   Super Admin crea suscripción para una institución
   Estado inicial: SUSPENDIDA (sin pago confirmado)
                ↓
2. INSTITUCIÓN REALIZA PAGO
   - Institución transfiere/deposita según método
   - Institución envía comprobante por email/WhatsApp
                ↓
3. SUPER ADMIN REGISTRA PAGO
   Formulario incluye:
   - Monto pagado, Fecha de pago
   - Método de pago
   - Número de operación (opcional)
   - Banco (solo si transferencia)
   - Subir comprobante ✓ (OBLIGATORIO)
   - Observaciones (opcional)
                ↓
4. VERIFICACIÓN DE COMPROBANTE
   - Estado inicial: PENDIENTE
   - Super Admin revisa comprobante subido
   - Valida que el monto coincida
   - Marca como VERIFICADO o RECHAZADO
                ↓
5. ACTUALIZACIÓN AUTOMÁTICA
   Si VERIFICADO:
   - Suscripción: SUSPENDIDA → ACTIVA
   - Sistema habilita acceso completo
   
   Si RECHAZADO:
   - Suscripción permanece SUSPENDIDA
   - Se registra motivo de rechazo
```

### 🎨 Interfaz Frontend

#### Módulo: Pagos de Suscripciones
**Ruta:** `/admin/suscripciones/pagos`

**Funcionalidades:**
- Lista de todos los pagos con filtros (Estado, Fecha, Institución)
- Estadísticas: Total pagos, Pendientes, Verificados, Rechazados, Total recaudado
- Modal de registro de pago con upload de comprobante
- Modal de verificación con preview grande del comprobante
- Acciones: Ver, Verificar, Rechazar

**Componentes creados:**
- `PagoSuscripcionForm.tsx`: Formulario de registro con file upload
- `VerificarPagoModal.tsx`: Modal de verificación/rechazo con preview
- `PagosSuscripcionesPage.tsx`: Página principal con lista y filtros

---

## Notas de Implementación

### Backend

**Campos Automáticos:**
- `numero_pago`: Generado via trigger MySQL (PAGO-XXXX)
- `fecha_registro`: Asignado via `@PrePersist` en entidad
- `verificado_por`: Extraído del `SecurityContext` al verificar

**Validaciones:**
- Comprobante es obligatorio al registrar pago
- Motivo es obligatorio al rechazar pago
- Campo `banco` requerido solo si método = "Transferencia Bancaria"

**Transacciones:**
- Al verificar pago → actualiza `estado` de suscripción a ACTIVA en la misma transacción
- Al rechazar pago → agrega motivo a `observaciones`

### Frontend

**Estado en Suscripción Form:**
- Mostrado como badge de solo lectura en modo edición
- Mensaje informativo: "El estado se actualiza automáticamente"

**Comprobantes:**
- Validación: Solo imágenes (JPG, PNG, WEBP) o PDF
- Tamaño máximo: 5MB
- Preview en formulario antes de enviar
- Preview ampliado en modal de verificación

**Rutas agregadas:**
- `/admin/suscripciones/pagos` → PagosSuscripcionesPage

**Sidebar actualizado:**
- Nueva opción: "Pagos de Suscripciones" con icono DollarSign

### Archivos Implementados

**Backend:**
- `pagos_suscripcion.sql` (con trigger)
- `EstadoVerificacion.java` (enum)
- `PagoSuscripcion.java` (entidad)
- `PagoSuscripcionDTO.java`
- `PagoSuscripcionRepository.java`
- `IPagoSuscripcionService.java`
- `PagoSuscripcionService.java`
- `PagoSuscripcionController.java`
- `FileStorageService.java` (upload handling)

**Frontend:**
- `types/index.ts` (tipos agregados)
- `api/pagosSuscripcionApi.ts`
- `hooks/usePagosSuscripcion.ts`
- `components/PagoSuscripcionForm.tsx`
- `components/VerificarPagoModal.tsx`
- `pages/PagosSuscripcionesPage.tsx`
- `routes/SuscripcionesRoutes.tsx` (actualizado)
- `SuperAdminSidebar.tsx` (actualizado)

---

## 💡 Consideraciones Futuras

1. **Tarea programada**: Implementar scheduled task para actualizar estados diariamente
2. **Notificaciones**: Enviar emails/SMS al verificar/rechazar pagos
3. **Historial**: Tabla `historial_estados_suscripcion` para auditoría
4. **Reportes**: Dashboard con métricas de pagos y suscripciones activas
5. **Recordatorios**: Notificar instituciones con pagos pendientes

---

## 📊 Tablas Separadas: Super Admin vs Escuelas

### ❌ NO USAR (son de las escuelas):
- `pago` - Para pagos de matrículas/pensiones de alumnos
- `comprobante` - Comprobantes de pagos de alumnos
- `caja` - Caja chica de cada escuela

### ✅ USAR (son del sistema):
- `metodo_pago` - Métodos de pago compartidos (Transferencia, Efectivo, etc.)
- `pagos_suscripcion` - Nueva tabla exclusiva para pagos de suscripciones

**Razón**: Los pagos de suscripciones son transacciones entre el Super Admin (dueño del sistema) y las instituciones (clientes). Los pagos de alumnos son transacciones entre las instituciones y los apoderados. Son flujos de caja totalmente separados.
