# MIGRACIÓN COMPLETADA: ÁREAS GLOBALES Y CURSOS POR SEDE

## 📋 RESUMEN DE CAMBIOS

Se ha implementado la arquitectura correcta donde:
- **Áreas**: Son globales (8 áreas estándar del Perú según MINEDU) compartidas entre todas las sedes
- **Cursos**: Son específicos de cada sede, vinculados a las áreas globales

## 🗂️ ARCHIVOS MODIFICADOS

### Backend (Java/Spring Boot)
1. **Entidades**
   - `Areas.java` - Eliminado campo `idSede` y relación `@ManyToOne` con Sedes
   - `Cursos.java` - Agregado campo `idSede` con relación `@ManyToOne` a Sedes
   - `AreasDTO.java` - Eliminado campo `idSede`
   - `CursosDTO.java` - Agregado campo `idSede`

2. **Repositorios**
   - `AreasRepository.java` - Eliminado método `findByIdSedeIdSede()`
   - `CursosRepository.java` - Actualizado query para filtrar por `c.idSede.idSede`

3. **Servicios**
   - `AreasService.java` - Simplificado, sin filtros de sede (áreas globales)
   - `CursosService.java` - Actualizado para validar sede directamente desde `cursos.idSede`

4. **Controladores**
   - `AreasController.java` - Eliminada lógica de asignación de sede
   - `CursosController.java` - Agregada lógica para asignar sede a cursos

### Frontend (React/TypeScript)
1. **Types**
   - `areas.types.ts` - Eliminado campo `idSede` de Area y AreaDTO
   - `cursos.types.ts` - CREADO - Interfaces Curso y CursoDTO con `idSede`

2. **Componentes**
   - `AreaForm.tsx` - Eliminado input de `idSede`, agregado mensaje informativo
   - `CursoForm.tsx` - CREADO - Formulario con selector de área y sede automática

3. **Páginas**
   - `AreasPage.tsx` - Sin cambios funcionales (ya funcionaba bien)
   - `CursosPage.tsx` - CREADO - Página completa de gestión de cursos

4. **Hooks**
   - `useCursos.ts` - CREADO - Hook para CRUD de cursos

5. **Rutas**
   - `GestionAcademicaRoutes.tsx` - Agregadas rutas separadas `/areas` y `/cursos`

### Base de Datos
- `migracion_areas_cursos.sql` - Script SQL de migración completo

## 🚀 PASOS PARA APLICAR LA MIGRACIÓN

### Paso 1: Backup de la Base de Datos
```bash
# CRÍTICO: Hacer backup antes de cualquier cambio
mysqldump -u [usuario] -p [nombre_bd] > backup_antes_migracion.sql
```

### Paso 2: Ejecutar Script SQL
```bash
mysql -u [usuario] -p [nombre_bd] < bd/migracion_areas_cursos.sql
```

El script realizará automáticamente:
- ✅ Backup de datos actuales en tablas temporales
- ✅ Eliminación de relación areas-sedes
- ✅ Inserción de 8 áreas estándar del Perú
- ✅ Agregado de campo id_sede a cursos
- ✅ Actualización de referencias de áreas en cursos
- ✅ Creación de foreign keys
- ✅ Verificaciones de integridad

### Paso 3: Compilar Backend
```bash
cd escuelita-backend
./mvnw clean install
# O en Windows:
mvnw.cmd clean install
```

### Paso 4: Reiniciar Backend
```bash
# Detener la aplicación actual
# Iniciar el JAR actualizado
java -jar target/www-0.0.1-SNAPSHOT.jar
```

### Paso 5: Instalar Dependencias Frontend (si es necesario)
```bash
cd escuelita-frontend
npm install
```

### Paso 6: Compilar y Probar Frontend
```bash
cd escuelita-frontend
npm run dev
# O para producción:
npm run build
```

## ✅ VERIFICACIONES POST-MIGRACIÓN

### Base de Datos
1. Verificar que existan solo 8 áreas (una por área estándar MINEDU)
   ```sql
   SELECT * FROM areas;
   -- Debe devolver 8 registros
   ```

2. Verificar que los cursos tengan sede asignada
   ```sql
   SELECT c.id_curso, c.nombre_curso, c.id_sede, a.nombre_area 
   FROM cursos c
   INNER JOIN areas a ON c.id_area = a.id_area;
   -- Todos deben tener id_sede poblado
   ```

3. Verificar foreign keys
   ```sql
   SHOW CREATE TABLE cursos;
   -- Debe mostrar FK con areas y sedes
   ```

### Backend
1. Iniciar el backend sin errores de compilación
2. Verificar logs - no debe haber errores de Hibernate/JPA
3. Probar endpoints:
   ```
   GET /restful/areas - Debe devolver 8 áreas
   GET /restful/cursos - Debe devolver cursos filtrados por sede
   POST /restful/cursos - Debe requerir idSede
   ```

### Frontend
1. Navegar a `/escuela/gestion-academica/areas`
   - Verificar que se muestren las 8 áreas globales
   - El formulario no debe pedir ID de sede

2. Navegar a `/escuela/gestion-academica/cursos`
   - Verificar que se muestren solo cursos de tu sede
   - Al crear curso, debe asignarse automáticamente a tu sede
   - Debe mostrar el área global asociada

## 📝 NOTAS IMPORTANTES

### Datos por Defecto
- Todos los cursos existentes se asignaron a **sede 18** (sede principal)
- Si tienes cursos de otras sedes, ejecuta:
  ```sql
  UPDATE cursos SET id_sede = [ID_SEDE_CORRECTA] 
  WHERE id_curso IN ([IDS_DE_CURSOS]);
  ```

### Áreas Estándar del Perú (MINEDU)
Las 8 áreas creadas son:
1. MATEMÁTICA
2. COMUNICACIÓN
3. INGLÉS
4. ARTE Y CULTURA
5. PERSONAL SOCIAL
6. EDUCACIÓN FÍSICA
7. EDUCACIÓN RELIGIOSA
8. CIENCIA Y TECNOLOGÍA

### Comportamiento Multi-Sede
- **Áreas**: Todas las sedes ven las mismas 8 áreas
- **Cursos**: Cada sede ve y gestiona solo sus propios cursos
- **Super Admin**: Ve todos los cursos de todas las sedes

## 🔄 ROLLBACK (En caso de problemas)

Si algo sale mal, puedes revertir usando las tablas de backup:

```sql
-- Restaurar áreas
DROP TABLE areas;
CREATE TABLE areas LIKE areas_backup;
INSERT INTO areas SELECT * FROM areas_backup;

-- Restaurar cursos
DROP TABLE cursos;
CREATE TABLE cursos LIKE cursos_backup;
INSERT INTO cursos SELECT * FROM cursos_backup;

-- Restaurar constraints originales (ver backup SQL original)
```

O restaurar desde el dump completo:
```bash
mysql -u [usuario] -p [nombre_bd] < backup_antes_migracion.sql
```

## 📧 SOPORTE

Si encuentras algún problema:
1. Revisa los logs del backend (errores de Hibernate/JPA)
2. Verifica la consola del navegador (errores de red/fetch)
3. Consulta las tablas de backup creadas automáticamente
4. Revisa este documento para asegurar que seguiste todos los pasos

## ✨ MEJORAS IMPLEMENTADAS

- ✅ Arquitectura correcta según estándares educativos peruanos
- ✅ Separación clara entre datos globales (áreas) y por sede (cursos)
- ✅ Interfaz intuitiva con mensajes informativos
- ✅ Validación de sede en backend (seguridad)
- ✅ Filtrado automático por sede (multi-tenancy)
- ✅ Rutas separadas para mejor UX
- ✅ Código limpio y documentado

---
**Fecha de Migración**: 2025
**Versión**: 1.0
