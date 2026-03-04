# 🏗️ Sistema Multi-Tenancy y Validación de Suscripciones

## 📋 Resumen de Cambios Implementados

Este documento describe la implementación completa del sistema de **multi-tenancy a nivel de sede** y la **validación automática de suscripciones** en el backend del proyecto Escuela Primaria.

---

## ✅ Componentes Implementados

### 1️⃣ **Infraestructura Multi-Tenancy**

#### `TenantContext.java`
- **Ubicación**: `src/main/java/com/escuelita/www/util/`
- **Propósito**: Almacena el ID de la sede del usuario actual usando ThreadLocal
- **Métodos principales**:
  - `setSedeId(Long)`: Establece la sede del usuario autenticado
  - `getSedeId()`: Obtiene la sede del contexto actual
  - `isSuperAdmin()`: Verifica si el usuario es Super Admin
  - `clear()`: Limpia el contexto (previene memory leaks)

#### `TenantInterceptor.java`
- **Ubicación**: `src/main/java/com/escuelita/www/config/`
- **Propósito**: Limpia el TenantContext después de cada request
- **Funcionamiento**: Se ejecuta automáticamente después de completar cada HTTP request

#### `JwtFilter.java` (Modificado)
- **Cambios**: Extrae el ID de sede del token JWT
- **Formato del token**: `"ESCUELA_123_SEDE_45"` o `"SUPER_ADMIN_1"`
- **Funcionalidad**:
  - Extrae automáticamente el ID de sede del token
  - Lo almacena en TenantContext
  - Diferencia entre Super Admin y usuarios de escuela

---

### 2️⃣ **Validación de Suscripciones**

#### `SuscripcionValidator.java`
- **Ubicación**: `src/main/java/com/escuelita/www/service/jpa/`
- **Propósito**: Validar que una institución tenga suscripción activa
- **Métodos**:
  - `validarSuscripcionActiva(Institucion)`: Lanza excepción si no hay suscripción válida
  - `tieneSuscripcionActiva(Institucion)`: Retorna boolean sin lanzar excepción
  - `obtenerSuscripcionActiva(Institucion)`: Retorna Optional con la suscripción

#### `EscuelaAuthService.java` (Modificado)
- **Cambios**: Agregada validación de suscripción en el login
- **Flujo**:
  1. Valida usuario y contraseña
  2. Obtiene la sede del usuario
  3. Obtiene la institución de la sede
  4. **Valida que la institución tenga suscripción activa**
  5. Si no tiene suscripción o está vencida: **BLOQUEA EL LOGIN**
  6. Si tiene suscripción válida: genera token y permite acceso

#### `SuscripcionScheduler.java`
- **Ubicación**: `src/main/java/com/escuelita/www/service/jpa/`
- **Propósito**: Actualizar automáticamente estados de suscripciones
- **Programación**: Ejecuta cada día a las 2:00 AM
- **Acciones**:
  - Marca como "Vencida" las suscripciones que pasaron su fecha de vencimiento
  - Reactiva suscripciones "Vencidas" si se extendió la fecha
- **Método manual**: `actualizarManualmente()` para forzar actualización

---

### 3️⃣ **Repositories con Filtros por Sede**

Se agregaron métodos `findByIdSedeIdSede(Long idSede)` a:
- `AlumnosRepository`
- `ApoderadosRepository`
- `AulasRepository`
- `AreasRepository`
- `CursosRepository`
- `GradosRepository`
- `SeccionesRepository`

También se agregaron métodos especializados a:
- `SuscripcionesRepository`: Buscar suscripción activa por institución
- `EstadosSuscripcionRepository`: Buscar estados por nombre

---

### 4️⃣ **Services con Control de Sede**

#### `AlumnosService.java` (Modificado)
- **Validaciones automáticas**:
  - `buscarTodos()`: Filtra automáticamente por sede del usuario
  - `guardar()`: Asigna automáticamente la sede del usuario, valida que no guarde en otra sede
  - `modificar()`: Valida que no modifique alumnos de otra sede
  - `buscarId()`: Retorna vacío si el alumno no pertenece a la sede
  - `eliminar()`: Valida que no elimine alumnos de otra sede

- **Excepción para Super Admin**: Puede ver/modificar todas las sedes

---

### 5️⃣ **Entidades Actualizadas**

#### `Institucion.java` (Nuevos campos)
```java
private String ruc;                      // RUC único de la institución
private String razonSocial;              // Razón social completa
private String domicilioFiscal;          // Dirección fiscal
private String representanteLegal;       // Representante legal
private String correoFacturacion;        // Email para facturas
private String telefonoFacturacion;      // Teléfono de facturación
```

#### `Sedes.java` (Nuevos campos)
```java
private String codigoEstablecimiento;    // Código SUNAT (0000, 0001, etc.)
private Boolean esSedePrincipal;         // Indica si es la sede principal
```

---

## 🚀 Cómo Funciona el Sistema

### Flujo de Autenticación y Validación

```
1. Usuario → POST /auth/escuela/login
   ├─ Usuario: "admin123"
   └─ Contraseña: "***"

2. Backend valida credenciales
   ├─ ✅ Usuario existe
   ├─ ✅ Contraseña correcta
   └─ ✅ Usuario tiene sede asignada

3. Backend obtiene la institución
   └─ Sede ID: 5 → Institución: "Colegio San Marcos"

4. Backend valida suscripción ⚡
   ├─ Busca suscripción con estado "Activa"
   ├─ Verifica fecha_vencimiento > HOY
   │
   ├─ ✅ SI ES VÁLIDA:
   │   ├─ Genera token: "ESCUELA_123_SEDE_5"
   │   └─ Permite login
   │
   └─ ❌ SI NO ES VÁLIDA:
       ├─ Mensaje: "Suscripción Vencida/Suspendida"
       └─ BLOQUEA LOGIN

5. Usuario autenticado
   └─ Cada request incluye el token en headers
       └─ JwtFilter extrae idSede y lo guarda en TenantContext
```

### Flujo de Consulta de Datos

```
1. Usuario → GET /restful/alumnos

2. JwtFilter intercepta request
   └─ Extrae del token: idSede = 5
   └─ Guarda en TenantContext.setSedeId(5)

3. AlumnosService.buscarTodos()
   ├─ Obtiene sedeId del TenantContext
   │
   ├─ Si es Super Admin:
   │   └─ return alumnosRepository.findAll()  // Todos
   │
   └─ Si es usuario de escuela:
       └─ return alumnosRepository.findByIdSedeIdSede(5)  // Solo su sede

4. TenantInterceptor limpia contexto
   └─ TenantContext.clear()  // Previene memory leaks
```

---

## 📊 Modelo de Datos (Arquitectura Corporativa)

### Estructura de Facturación
```
Institución (Persona Jurídica)
├─ RUC: 20123456789 (único)
├─ Razón Social: "Corporación Educativa San Marcos SAC"
├─ Domicilio Fiscal: Av. Principal 123
│
├─ Suscripción: Plan Profesional (3 sedes)
│  ├─ Precio: S/ 3,500/año
│  ├─ Estado: Activa
│  └─ Vence: 31/12/2026
│
└─ Sedes (Establecimientos Físicos)
    ├─ Sede Principal (0000) ← Domicilio fiscal
    ├─ Anexo Los Olivos (0001)
    └─ Anexo San Martín (0002)
```

### Facturación
- **Una sola factura** al RUC de la institución
- **Pago centralizado** por la sede principal
- **Todas las sedes** se bloquean si la suscripción vence

---

## 🔧 Configuración Necesaria

### 1. Ejecutar Migración SQL
```bash
# Ubicación del script:
bd/MIGRATION_03-03-2026_multi-tenancy.sql

# Ejecutar en MySQL/MariaDB:
mysql -u usuario -p nombre_bd < MIGRATION_03-03-2026_multi-tenancy.sql
```

### 2. Verificar Configuración
- ✅ `@EnableScheduling` agregado en `ProyectoEscuelaPrimariaApplication.java`
- ✅ `TenantInterceptor` registrado en `WebConfig.java`

### 3. Datos a Completar
Para cada institución, completar:
- `ruc` (11 dígitos)
- `razon_social`
- `representante_legal`
- `correo_facturacion`

Para cada sede, completar:
- `codigo_establecimiento` (0000 para principal, 0001+ para anexos)
- `es_sede_principal` (true solo para una sede)

---

## 🧪 Testing

### Probar Validación de Suscripción

#### Caso 1: Login con Suscripción Activa
```bash
POST /auth/escuela/login
{
  "usuario": "admin",
  "contrasena": "123456"
}

# ✅ Respuesta esperada:
{
  "token": "eyJhbGc...",
  "usuario": { ... }
}
```

#### Caso 2: Login con Suscripción Vencida
```sql
-- Cambiar estado manualmente para testing:
UPDATE suscripciones 
SET id_estado = 2  -- 2 = Vencida
WHERE id_institucion = 1;
```

```bash
POST /auth/escuela/login
{
  "usuario": "admin",
  "contrasena": "123456"
}

# ❌ Respuesta esperada:
{
  "error": "⚠️ ACCESO DENEGADO: La institución no tiene una suscripción activa..."
}
```

### Probar Job Automático

#### Opción 1: Esperar a las 2:00 AM
El job se ejecutará automáticamente.

#### Opción 2: Crear endpoint de testing
```java
// En un controller (ej: UtilsController)
@GetMapping("/admin/actualizar-suscripciones")
public String actualizarSuscripciones() {
    suscripcionScheduler.actualizarManualmente();
    return "Actualización completada";
}
```

### Probar Filtro de Sede

```bash
# Login como usuario de Sede 1
POST /auth/escuela/login
{
  "usuario": "admin_sede1",
  "contrasena": "123456"
}

# Obtener alumnos (solo verá de Sede 1)
GET /restful/alumnos
Authorization: Bearer {token}

# Login como Super Admin
POST /auth/admin/login
{
  "usuario": "superadmin",
  "contrasena": "123456"
}

# Obtener alumnos (verá de TODAS las sedes)
GET /restful/alumnos
Authorization: Bearer {token}
```

---

## 📝 Notas Importantes

### ⚠️ Redundancia de Estado
La tabla `institucion` tiene campos redundantes:
- `estado_suscripcion`
- `fecha_inicio_suscripcion`
- `fecha_vencimiento_licencia`
- `plan_contratado`

**Recomendación**: Eliminarlos y usar solo la tabla `suscripciones` como fuente de verdad.

### 🔒 Seguridad
- Los usuarios de escuela **SOLO** pueden ver/modificar datos de su sede
- Los Super Admin pueden acceder a **TODAS** las sedes
- El filtro se aplica automáticamente en el backend (no depende del frontend)

### 🔄 Mantenimiento
- El job actualiza estados diariamente a las 2:00 AM
- Si cambias `fecha_vencimiento` en suscripciones, el estado se actualizará automáticamente
- Logs informativos en consola para cada actualización

---

## 🎯 Próximos Pasos Recomendados

1. **Aplicar el mismo patrón** a otros services:
   - `ApoderadosService`
   - `AulasService`
   - `AsistenciasService`
   - etc.

2. **Crear endpoint** para renovar suscripciones desde el Super Admin

3. **Implementar notificaciones** de vencimiento próximo (ej: 15 días antes)

4. **Dashboard** para Super Admin mostrando estado de suscripciones

5. **Reportes** de uso por sede para facturación

---

## 📞 Soporte

Para dudas o problemas:
- Revisar logs del servidor (búsqueda: 🏫, ✅, ⚠️, ❌)
- Verificar que el job esté ejecutándose (logs a las 2:00 AM)
- Validar que los tokens incluyan `_SEDE_` en el formato

---

**Implementado**: 03/03/2026  
**Versión**: 1.0.0
