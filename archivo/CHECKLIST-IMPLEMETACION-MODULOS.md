# 📋 CHECKLIST IMPLEMENTACIÓN: Acceso por Módulos

## ✅ YA COMPLETADO

### Backend Java
- [x] Entity: `RolModulo.java` (creado)
- [x] Repository: `ModuloAccesoRepository.java` (creado)
- [x] Service: `ModuloAccesoService.java` (creado)
- [x] Anotación: `@RequireModulo` (creado)
- [x] Aspecto: `ModuloAccesoAspect.java` (creado)

### Controllers Modificados
- [x] AlumnosController.java (@RequireModulo(5) en todos los métodos)
- [x] MatriculasController.java (@RequireModulo(6) en todos los métodos)
- [x] CalificacionesController.java (@RequireModulo(7) en todos los métodos)
- [x] PagosCajaController.java (@RequireModulo(8) en todos los métodos)

---

## ⏳ FALTA POR HACER

### 1️⃣ BASE DE DATOS (En cPanel phpMyAdmin)

Ejecuta el script: `MIGRACION-ROL-MODULO.sql` (está en `/bd/`)

```sql
-- Crear tabla rol_modulo
-- Migrar datos de rol_modulo_permiso
-- Crear Stored Procedure validarAccesoModuloUsuario
```

**Pasos en cPanel:**
1. Acceder a phpMyAdmin
2. Seleccionar base de datos `primaria_bd_real`
3. Click en "SQL"
4. Copiar contenido de `MIGRACION-ROL-MODULO.sql`
5. Ejecutar

### 2️⃣ COMPILAR Backend

```bash
cd c:\xampp\htdocs\proyecto-escuela-primaria\escuelita-backend
mvn clean package -DskipTests
```

Verificar que compile correctamente (sin errores de sintaxis).

### 3️⃣ GENERAR JAR

```bash
mvn clean install -DskipTests
```

El JAR generado estará en: `escuelita-backend/target/www-0.0.1-SNAPSHOT.jar`

### 4️⃣ SUBIR JAR A CPANEL

1. Conectar a servidor vía FTP
2. Reemplazar el .jar en la carpeta del servidor
3. Reiniciar la aplicación/contenedor

### 5️⃣ APLICAR A OTROS CONTROLLERS (Opcional)

Si quieres proteger más módulos, agregar `@RequireModulo` a:

**Módulo 3 - INFRAESTRUCTURA:**
- AulasController → @RequireModulo(3)
- GradosController → @RequireModulo(3)
- SeccionesController → @RequireModulo(3)

**Módulo 4 - GESTIÓN ACADÉMICA:**
- CursosController → @RequireModulo(4)
- AreasController → @RequireModulo(4)
- MallaCurricularController → @RequireModulo(4)
- HorariosController → @RequireModulo(4)

**Módulo 5 - ALUMNOS (YA HECHO):**
- AlumnosController ✅

**Módulo 6 - MATRÍCULAS (YA HECHO):**
- MatriculasController ✅

**Módulo 7 - EVALUACIONES Y NOTAS (YA HECHO):**
- CalificacionesController ✅
- EvaluacionesController → @RequireModulo(7)

**Módulo 8 - PAGOS Y PENSIONES (YA HECHO):**
- PagosCajaController ✅

---

## 🧪 CÓMO PROBAR

### Request SIN acceso:
```bash
curl -X GET http://apis.miescuela.com/restful/alumnos \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -H "X-Usuario-ID: 3"
```

Si el usuario 3 (Secretaria) no tiene módulo 5 (ALUMNOS):
```json
❌ 403 Forbidden
"No tienes acceso al módulo solicitado"
```

### Request CON acceso:
```bash
curl -X GET http://apis.miescuela.com/restful/alumnos \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -H "X-Usuario-ID: 5"
```

Si el usuario 5 tiene módulo 5 (ALUMNOS):
```json
✅ 200 OK
[
  { "idAlumno": 1, "nombres": "Juan", ... },
  ...
]
```

---

## 📊 Estructura de Datos Final

### Tabla rol_modulo
```sql
id_rol_modulo | id_rol | id_modulo | estado
1             | 1      | 1         | 1   (SuperAdmin → DASHBOARD)
2             | 1      | 2         | 1   (SuperAdmin → CONFIGURACIÓN)
...
100           | 2      | 5         | 1   (PROFESOR → ALUMNOS)
101           | 2      | 7         | 1   (PROFESOR → EVALUACIONES)
102           | 3      | 5         | 1   (SECRETARIA → ALUMNOS)
103           | 3      | 6         | 1   (SECRETARIA → MATRÍCULAS)
```

### Query para verificar asignación:
```sql
SELECT r.nombre, m.nombre 
FROM rol_modulo rm
JOIN roles r ON rm.id_rol = r.id_rol
JOIN modulos m ON rm.id_modulo = m.id_modulo
WHERE r.nombre = 'PROFESOR' AND rm.estado = 1;

-- Resultado:
-- PROFESOR | ALUMNOS
-- PROFESOR | EVALUACIONES Y NOTAS
```

---

## 🔒 Resumen Seguridad

| Nivel | Validación | Si Falla |
|-------|-----------|---------|
| JwtFilter | Token válido | ❌ 401 |
| SecurityConfig | Endpoint requiere auth | ❌ 401 |
| **ModuloAccesoAspect** | **Usuario tiene acceso a módulo** | **❌ 403** |

---

## 📝 Notas Importantes

1. **SuperAdmin (id_rol=1) siempre tiene acceso a TODO** - No necesita validación
2. **X-Usuario-ID es obligatorio** - Debe pasarse en headers de cada request
3. **El SP valida en BD** - Más seguro que validación en frontend
4. **Soft delete** - Los registros de rol_modulo_permiso se desactivan (estado=0), no se eliminan

---

## 📌 IDs de Módulos (Para referencia)
```
1 = DASHBOARD
2 = CONFIGURACIÓN  
3 = INFRAESTRUCTURA
4 = GESTIÓN ACADÉMICA
5 = ALUMNOS
6 = MATRÍCULAS
7 = EVALUACIONES Y NOTAS
8 = PAGOS Y PENSIONES
```
