-- ========================================
-- MIGRACIÓN: Agregar id_sede a malla_curricular
-- Fecha: 2026-03-10
-- Objetivo: Permitir que cada sede tenga su propia malla curricular
-- ========================================

USE primaria_bd_real;

-- ========================================
-- PASO 1: BACKUP DE LA TABLA ACTUAL
-- ========================================

-- Crear tabla de respaldo
DROP TABLE IF EXISTS malla_curricular_backup_20260310;
CREATE TABLE malla_curricular_backup_20260310 AS
SELECT * FROM malla_curricular;

SELECT CONCAT('✅ Backup creado: ', COUNT(*), ' registros respaldados') AS resultado
FROM malla_curricular_backup_20260310;

-- ========================================
-- PASO 2: AGREGAR COLUMNA id_sede
-- ========================================

-- Verificar si la columna ya existe
SET @column_exists = (
    SELECT COUNT(*) 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = 'primaria_bd_real' 
    AND TABLE_NAME = 'malla_curricular' 
    AND COLUMN_NAME = 'id_sede'
);

-- Agregar columna id_sede (permitir NULL temporalmente)
SET @sql = IF(@column_exists = 0,
    'ALTER TABLE malla_curricular ADD COLUMN id_sede bigint(20) UNSIGNED NULL AFTER id_malla',
    'SELECT "⚠️ Columna id_sede ya existe" AS resultado'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- ========================================
-- PASO 3: ASIGNAR VALORES A id_sede
-- ========================================

-- ESTRATEGIA: Asignar sede basándose en los cursos relacionados
-- Ya que los cursos ahora tienen id_sede, podemos usarlos como referencia

UPDATE malla_curricular mc
INNER JOIN cursos c ON mc.id_curso = c.id_curso
SET mc.id_sede = c.id_sede
WHERE mc.id_sede IS NULL;

-- Verificar cuántos registros fueron actualizados
SELECT 
    COUNT(*) AS total_registros,
    SUM(CASE WHEN id_sede IS NOT NULL THEN 1 ELSE 0 END) AS con_sede,
    SUM(CASE WHEN id_sede IS NULL THEN 1 ELSE 0 END) AS sin_sede
FROM malla_curricular;

-- ========================================
-- PASO 4: MOSTRAR REGISTROS SIN SEDE (si hay)
-- ========================================

-- Identificar registros problema (si los hay)
SELECT 
    mc.id_malla,
    mc.id_anio,
    g.nombre_grado,
    c.nombre_curso,
    'SIN SEDE ASIGNADA' AS problema
FROM malla_curricular mc
LEFT JOIN grados g ON mc.id_grado = g.id_grado
LEFT JOIN cursos c ON mc.id_curso = c.id_curso
WHERE mc.id_sede IS NULL;

-- ========================================
-- PASO 5: SOLUCIÓN PARA REGISTROS SIN SEDE
-- ========================================

-- Si hay registros sin sede (cursos huérfanos), asignar a la sede principal
-- O puedes eliminarlos si son datos inconsistentes

-- OPCIÓN A: Asignar a sede principal (id_sede = 18 en tu caso)
-- Descomentar si quieres usar esta opción:
-- UPDATE malla_curricular 
-- SET id_sede = 18 
-- WHERE id_sede IS NULL;

-- OPCIÓN B: Eliminar registros huérfanos (más limpio)
-- Descomentar si quieres usar esta opción:
-- DELETE FROM malla_curricular WHERE id_sede IS NULL;

-- ========================================
-- PASO 6: HACER id_sede NOT NULL
-- ========================================

-- Verificar que no haya registros sin sede
SET @registros_sin_sede = (SELECT COUNT(*) FROM malla_curricular WHERE id_sede IS NULL);

-- Solo hacer NOT NULL si no hay registros pendientes
SET @sql = IF(@registros_sin_sede = 0,
    'ALTER TABLE malla_curricular MODIFY COLUMN id_sede bigint(20) UNSIGNED NOT NULL',
    CONCAT('SELECT "⚠️ ERROR: Hay ', @registros_sin_sede, ' registros sin sede. Resuelve esto primero." AS resultado')
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- ========================================
-- PASO 7: AGREGAR FOREIGN KEY
-- ========================================

-- Verificar si la FK ya existe
SET @fk_exists = (
    SELECT COUNT(*) 
    FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS 
    WHERE TABLE_SCHEMA = 'primaria_bd_real' 
    AND TABLE_NAME = 'malla_curricular' 
    AND CONSTRAINT_NAME = 'fk_malla_sedes'
);

-- Agregar foreign key
SET @sql = IF(@fk_exists = 0 AND @registros_sin_sede = 0,
    'ALTER TABLE malla_curricular ADD CONSTRAINT fk_malla_sedes FOREIGN KEY (id_sede) REFERENCES sedes(id_sede)',
    'SELECT "⚠️ FK ya existe o hay registros sin sede" AS resultado'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- ========================================
-- PASO 8: CREAR ÍNDICES
-- ========================================

-- Índice para mejorar búsquedas por sede
CREATE INDEX IF NOT EXISTS idx_malla_sede ON malla_curricular(id_sede);

-- Índice compuesto para búsquedas comunes (sede + año + grado)
CREATE INDEX IF NOT EXISTS idx_malla_sede_anio_grado 
ON malla_curricular(id_sede, id_anio, id_grado);

-- ========================================
-- PASO 9: VERIFICACIÓN FINAL
-- ========================================

SELECT '========================================' AS '';
SELECT '✅ MIGRACIÓN COMPLETADA' AS resultado;
SELECT '========================================' AS '';

-- Verificar estructura de la tabla
SELECT 
    COLUMN_NAME AS columna,
    COLUMN_TYPE AS tipo,
    IS_NULLABLE AS nulo,
    COLUMN_KEY AS clave
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = 'primaria_bd_real' 
AND TABLE_NAME = 'malla_curricular'
ORDER BY ORDINAL_POSITION;

-- Mostrar distribución por sede
SELECT 
    s.nombre_sede,
    COUNT(mc.id_malla) AS total_registros_malla
FROM sedes s
LEFT JOIN malla_curricular mc ON s.id_sede = mc.id_sede
WHERE s.estado = 1
GROUP BY s.id_sede, s.nombre_sede
ORDER BY s.id_sede;

-- Mostrar ejemplos de malla por sede
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

-- ========================================
-- PASO 10: VALIDACIÓN DE CONSISTENCIA
-- ========================================

-- Verificar que todos los cursos en malla_curricular pertenecen a la misma sede
SELECT 
    mc.id_malla,
    s1.nombre_sede AS sede_malla,
    s2.nombre_sede AS sede_curso,
    'INCONSISTENCIA: Malla y Curso en diferentes sedes' AS problema
FROM malla_curricular mc
INNER JOIN sedes s1 ON mc.id_sede = s1.id_sede
INNER JOIN cursos c ON mc.id_curso = c.id_curso
INNER JOIN sedes s2 ON c.id_sede = s2.id_sede
WHERE mc.id_sede != c.id_sede;

SELECT '========================================' AS '';
SELECT '✅ Si no hay inconsistencias arriba, la migración fue exitosa' AS resultado;
SELECT '========================================' AS '';

-- ========================================
-- ROLLBACK (En caso de emergencia)
-- ========================================

/*
-- DESHACER MIGRACIÓN:

-- 1. Eliminar foreign key
ALTER TABLE malla_curricular DROP FOREIGN KEY fk_malla_sedes;

-- 2. Eliminar índices
DROP INDEX idx_malla_sede ON malla_curricular;
DROP INDEX idx_malla_sede_anio_grado ON malla_curricular;

-- 3. Eliminar columna id_sede
ALTER TABLE malla_curricular DROP COLUMN id_sede;

-- 4. Restaurar desde backup (si es necesario)
TRUNCATE TABLE malla_curricular;
INSERT INTO malla_curricular SELECT * FROM malla_curricular_backup_20260310;

-- 5. Eliminar backup
DROP TABLE malla_curricular_backup_20260310;
*/
