# 📚 MIGRACIÓN: Agregar id_sede a Malla Curricular

## 🎯 Objetivo

Permitir que **cada sede tenga su propia malla curricular**, definiendo qué cursos se enseñan en qué grados para cada año escolar de manera independiente.

---

## 📋 Resumen de Cambios

### ✅ Archivos Modificados

#### **Backend (Java)**
1. `bd/migracion_malla_curricular_sede.sql` - Script SQL de migración
2. `entity/MallaCurricular.java` - Agregado campo `idSede`
3. `entity/MallaCurricularDTO.java` - Agregado campo `idSede`
4. `repository/MallaCurricularRepository.java` - Agregado método `findBySedeId()`
5. `service/jpa/MallaCurricularService.java` - Filtrado automático por sede
6. `controller/MallaCurricularController.java` - Asignación automática de sede

#### **Frontend (TypeScript/React)**
- ✅ No requiere cambios - El backend maneja `idSede` automáticamente

---

## 🚀 PASOS PARA EJECUTAR LA MIGRACIÓN

### 1️⃣ Ejecutar Script SQL

```bash
# Conectar a MySQL
mysql -u root -p primaria_bd_real

# Ejecutar el script
source bd/migracion_malla_curricular_sede.sql
```

**El script hace:**
- ✅ Crea backup de la tabla actual
- ✅ Agrega columna `id_sede`
- ✅ Asigna sedes basándose en los cursos existentes
- ✅ Crea foreign key a `sedes`
- ✅ Crea índices para optimizar búsquedas
- ✅ Valida consistencia de datos

### 2️⃣ Reiniciar el Backend

```bash
cd escuelita-backend
mvn clean package
java -jar target/www-0.0.1-SNAPSHOT.jar
```

O si usas Spring Boot DevTools, se recargará automáticamente.

### 3️⃣ Verificar en el Frontend

1. Inicia sesión como usuario de una sede específica
2. Ve a **Gestión Académica** → **Malla Curricular**
3. Crea una nueva malla curricular
4. **Verifica que:**
   - ✅ Solo ves mallas de tu sede
   - ✅ Al crear una malla, se asigna automáticamente a tu sede
   - ✅ No puedes ver/editar mallas de otras sedes

---

## 🏗️ Arquitectura Final

```
ÁREAS (Global MINEDU) ✅
   ↓
CURSOS (Por Sede) ✅
   ↓
MALLA CURRICULAR (Sede + Año + Grado + Curso) ✅ NUEVO
   ↓
ASIGNACIÓN DOCENTE (Profesor + Sección + Curso) ⏳ Por hacer
   ↓
HORARIOS (Cuándo y Dónde) ⏳ Por hacer
```

---

## 📊 Ejemplo de Uso

### Sede 18: San Juan

**Malla Curricular 2026 - 1er Grado:**
- Aritmética (del Área: Matemática)
- Gramática (del Área: Comunicación)
- Inglés Básico (del Área: Inglés)
- Ciencias Naturales (del Área: Ciencia y Tecnología)
- **Total: 12 cursos** (un registro por cada curso)

### Sede 22: Santa Rosa

**Malla Curricular 2026 - 1er Grado:**
- Matemática Integral (del Área: Matemática)
- Comunicación Oral (del Área: Comunicación)
- English for Kids (del Área: Inglés)
- Ciencias (del Área: Ciencia y Tecnología)
- **Total: 10 cursos diferentes** (adaptado a su metodología)

---

## 🔍 Validaciones Implementadas

### Backend

```java
// En MallaCurricularService.java

// ✅ Listar solo mallas de tu sede
public List<MallaCurricular> buscarTodos() {
    if (TenantContext.isSuperAdmin()) {
        return repoMallaCurricular.findAll();
    }
    return repoMallaCurricular.findBySedeId(TenantContext.getSedeId());
}

// ✅ Crear solo en tu sede
public MallaCurricular guardar(MallaCurricular malla) {
    if (!TenantContext.isSuperAdmin()) {
        Long sedeId = malla.getIdSede() != null
                     ? malla.getIdSede().getIdSede() 
                     : null;
        
        if (sedeId == null || !sedeId.equals(TenantContext.getSedeId())) {
            throw new RuntimeException("No tienes permiso para crear malla curricular en esta sede");
        }
    }
    return repoMallaCurricular.save(malla);
}
```

### Controlador

```java
// En MallaCurricularController.java

@PostMapping("/mallacurricular")
public ResponseEntity<?> guardar(@RequestBody MallaCurricularDTO dto) {
    MallaCurricular malla = new MallaCurricular();
    
    // Asignar sede automáticamente
    Long sedeId = TenantContext.getSedeId();
    if (sedeId != null) {
        Sedes sede = repoSedes.findById(sedeId).orElse(null);
        malla.setIdSede(sede);
    }
    
    // ... resto del código
    return ResponseEntity.ok(serviceMallaCurricular.guardar(malla));
}
```

---

## 🧪 Consultas Útiles para Verificar

### Ver todas las mallas por sede

```sql
SELECT 
    s.nombre_sede,
    ae.nombre_anio,
    g.nombre_grado,
    COUNT(mc.id_malla) AS total_cursos
FROM malla_curricular mc
INNER JOIN sedes s ON mc.id_sede = s.id_sede
INNER JOIN anio_escolar ae ON mc.id_anio = ae.id_anio
INNER JOIN grados g ON mc.id_grado = g.id_grado
WHERE mc.estado = 1
GROUP BY s.id_sede, ae.id_anio, g.id_grado
ORDER BY s.id_sede, ae.id_anio, g.id_grado;
```

### Ver detalle de una malla específica

```sql
SELECT 
    s.nombre_sede,
    ae.nombre_anio,
    g.nombre_grado,
    c.nombre_curso,
    a.nombre_area
FROM malla_curricular mc
INNER JOIN sedes s ON mc.id_sede = s.id_sede
INNER JOIN anio_escolar ae ON mc.id_anio = ae.id_anio
INNER JOIN grados g ON mc.id_grado = g.id_grado
INNER JOIN cursos c ON mc.id_curso = c.id_curso
INNER JOIN areas a ON c.id_area = a.id_area
WHERE mc.estado = 1
  AND s.id_sede = 18
  AND ae.id_anio = 2026
  AND g.id_grado = 1
ORDER BY a.nombre_area, c.nombre_curso;
```

### Validar consistencia (mallas y cursos en misma sede)

```sql
-- No debería devolver resultados
SELECT 
    mc.id_malla,
    s1.nombre_sede AS sede_malla,
    s2.nombre_sede AS sede_curso,
    'ERROR: Malla y Curso en diferentes sedes' AS problema
FROM malla_curricular mc
INNER JOIN sedes s1 ON mc.id_sede = s1.id_sede
INNER JOIN cursos c ON mc.id_curso = c.id_curso
INNER JOIN sedes s2 ON c.id_sede = s2.id_sede
WHERE mc.id_sede != c.id_sede;
```

---

## ⚠️ Rollback (Deshacer Migración)

```sql
-- 1. Eliminar foreign key
ALTER TABLE malla_curricular DROP FOREIGN KEY fk_malla_sedes;

-- 2. Eliminar índices
DROP INDEX idx_malla_sede ON malla_curricular;
DROP INDEX idx_malla_sede_anio_grado ON malla_curricular;

-- 3. Eliminar columna
ALTER TABLE malla_curricular DROP COLUMN id_sede;

-- 4. Restaurar desde backup (si es necesario)
TRUNCATE TABLE malla_curricular;
INSERT INTO malla_curricular 
SELECT * FROM malla_curricular_backup_20260310;

-- 5. Eliminar backup
DROP TABLE malla_curricular_backup_20260310;
```

---

## 📝 Próximos Pasos

### **Asignación Docente** (Siguiente)

Ya tiene la estructura correcta. Solo necesita:
- ✅ Validar que el curso asignado esté en la malla del grado
- ✅ Evitar asignar cursos que no están en la malla curricular

### **Horarios** (Después)

Ya tiene la estructura correcta. Solo necesita:
- ✅ Validar conflictos (mismo docente en 2 lugares)
- ✅ Validar conflictos (misma aula con 2 clases)
- ✅ Validar conflictos (misma sección en 2 cursos simultáneos)

---

## ✅ Checklist de Verificación

Después de ejecutar la migración, verifica:

- [ ] La tabla `malla_curricular` tiene la columna `id_sede`
- [ ] Todos los registros existentes tienen `id_sede` asignado
- [ ] La foreign key `fk_malla_sedes` está creada
- [ ] Los índices `idx_malla_sede` e `idx_malla_sede_anio_grado` existen
- [ ] El backend compila sin errores
- [ ] Al crear una malla, se asigna automáticamente a tu sede
- [ ] Solo ves mallas de tu sede en el frontend
- [ ] No puedes editar mallas de otras sedes
- [ ] Super Admin puede ver todas las mallas

---

## 🎉 Resultado Final

**Antes:**
- ❌ Todas las sedes veían las mismas mallas curriculares
- ❌ No había separación por sede
- ❌ Conflictos al personalizar la oferta académica

**Después:**
- ✅ Cada sede tiene su propia malla curricular independiente
- ✅ Sede 18 puede ofrecer 12 cursos en 1ero
- ✅ Sede 22 puede ofrecer 10 cursos diferentes en 1ero
- ✅ Ambos usan las **8 áreas globales de MINEDU** ✅
- ✅ Personalización total de la oferta académica por sede

---

## 📞 Soporte

Si encuentras algún problema durante la migración:

1. **Revisa los logs del backend** para errores de SQL o validación
2. **Verifica la consulta de inconsistencias** en la sección de validación
3. **Usa el rollback** si necesitas revertir cambios
4. **Consulta este documento** para los pasos correctos

---

**Fecha de migración:** 2026-03-10  
**Versión:** 1.0  
**Estado:** ✅ Lista para producción
