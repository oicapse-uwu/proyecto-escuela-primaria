-- =====================================================
-- MIGRACIÓN: ÁREAS GLOBALES Y CURSOS POR SEDE
-- =====================================================
-- Propósito: Corregir arquitectura para que las áreas sean
-- globales (8 áreas estándar del Perú) y los cursos sean
-- específicos por sede.
-- 
-- Autor: Sistema
-- Fecha: 2025
-- =====================================================

-- IMPORTANTE: Ejecutar este script en un entorno de prueba primero
-- y hacer un respaldo completo de la base de datos antes.

SET FOREIGN_KEY_CHECKS = 0;

-- =====================================================
-- PASO 1: BACKUP DE DATOS ACTUALES
-- =====================================================

-- Crear tabla temporal para backup de areas
CREATE TABLE IF NOT EXISTS `areas_backup` AS 
SELECT * FROM `areas` WHERE estado = 1;

-- Crear tabla temporal para backup de cursos
CREATE TABLE IF NOT EXISTS `cursos_backup` AS 
SELECT * FROM `cursos` WHERE estado = 1;

SELECT '✓ Paso 1: Backup completado' AS status;

-- =====================================================
-- PASO 2: ELIMINAR RELACIÓN DE AREAS CON SEDES
-- =====================================================

-- Eliminar la foreign key de areas con sedes
ALTER TABLE `areas` 
DROP FOREIGN KEY IF EXISTS `areas_ibfk_1`;

ALTER TABLE `areas` 
DROP FOREIGN KEY IF EXISTS `fk_areas_sedes`;

-- Eliminar el índice asociado
ALTER TABLE `areas` 
DROP INDEX IF EXISTS `id_sede`;

ALTER TABLE `areas` 
DROP INDEX IF EXISTS `idx_areas_sede`;

-- Eliminar la columna id_sede
ALTER TABLE `areas` 
DROP COLUMN IF EXISTS `id_sede`;

SELECT '✓ Paso 2: Relación areas-sedes eliminada' AS status;

-- =====================================================
-- PASO 3: LIMPIAR Y ESTANDARIZAR ÁREAS
-- =====================================================

-- Eliminar todas las áreas actuales (duplicadas por sede)
DELETE FROM `areas`;

-- Resetear el auto_increment
ALTER TABLE `areas` AUTO_INCREMENT = 1;

-- Insertar las 8 áreas estándar del Perú (MINEDU)
INSERT INTO `areas` (`nombre_area`, `descripcion`, `estado`) VALUES
('MATEMÁTICA', 'Área de Matemática según currículo nacional', 1),
('COMUNICACIÓN', 'Área de Comunicación según currículo nacional', 1),
('INGLÉS', 'Área de Inglés como lengua extranjera', 1),
('ARTE Y CULTURA', 'Área de Arte y Cultura', 1),
('PERSONAL SOCIAL', 'Área de Personal Social', 1),
('EDUCACIÓN FÍSICA', 'Área de Educación Física', 1),
('EDUCACIÓN RELIGIOSA', 'Área de Educación Religiosa', 1),
('CIENCIA Y TECNOLOGÍA', 'Área de Ciencia y Tecnología', 1);

SELECT '✓ Paso 3: Áreas estandarizadas (8 áreas globales)' AS status;

-- =====================================================
-- PASO 4: AGREGAR id_sede A CURSOS
-- =====================================================

-- Agregar columna id_sede a la tabla cursos
ALTER TABLE `cursos` 
ADD COLUMN `id_sede` bigint(20) UNSIGNED NOT NULL DEFAULT 18 AFTER `id_curso`;

SELECT '✓ Paso 4: Columna id_sede agregada a cursos' AS status;

-- =====================================================
-- PASO 5: ACTUALIZAR REFERENCIAS DE CURSOS A NUEVAS ÁREAS
-- =====================================================

-- Mapear los cursos existentes a las nuevas áreas por nombre
-- NOTA: Los cursos existentes se asignarán a sede 18 (sede principal)
-- Si tienes otra sede, deberás actualizar manualmente los id_sede

-- Actualizar referencias de área MATEMÁTICA (nueva id=1)
UPDATE `cursos` SET `id_area` = 1 
WHERE `id_area` IN (SELECT ba.id_area FROM areas_backup ba WHERE UPPER(ba.nombre_area) = 'MATEMATICA');

-- Actualizar referencias de área COMUNICACIÓN (nueva id=2)
UPDATE `cursos` SET `id_area` = 2 
WHERE `id_area` IN (SELECT ba.id_area FROM areas_backup ba WHERE UPPER(ba.nombre_area) = 'COMUNICACION');

-- Actualizar referencias de área INGLÉS (nueva id=3)
UPDATE `cursos` SET `id_area` = 3 
WHERE `id_area` IN (SELECT ba.id_area FROM areas_backup ba WHERE UPPER(ba.nombre_area) = 'INGLES');

-- Actualizar referencias de área ARTE Y CULTURA (nueva id=4)
UPDATE `cursos` SET `id_area` = 4 
WHERE `id_area` IN (SELECT ba.id_area FROM areas_backup ba WHERE UPPER(ba.nombre_area) = 'ARTE Y CULTURA');

-- Actualizar referencias de área PERSONAL SOCIAL (nueva id=5)
UPDATE `cursos` SET `id_area` = 5 
WHERE `id_area` IN (SELECT ba.id_area FROM areas_backup ba WHERE UPPER(ba.nombre_area) = 'PERSONAL SOCIAL');

-- Actualizar referencias de área EDUCACIÓN FÍSICA (nueva id=6)
UPDATE `cursos` SET `id_area` = 6 
WHERE `id_area` IN (SELECT ba.id_area FROM areas_backup ba WHERE UPPER(ba.nombre_area) = 'EDUCACION FISICA');

-- Actualizar referencias de área EDUCACIÓN RELIGIOSA (nueva id=7)
UPDATE `cursos` SET `id_area` = 7 
WHERE `id_area` IN (SELECT ba.id_area FROM areas_backup ba WHERE UPPER(ba.nombre_area) = 'EDUCACION RELIGIOSA');

-- Actualizar referencias de área CIENCIA Y TECNOLOGÍA (nueva id=8)
UPDATE `cursos` SET `id_area` = 8 
WHERE `id_area` IN (SELECT ba.id_area FROM areas_backup ba WHERE UPPER(ba.nombre_area) = 'CIENCIA Y TECNOLOGIA');

SELECT '✓ Paso 5: Referencias de áreas actualizadas en cursos' AS status;

-- =====================================================
-- PASO 6: AGREGAR CONSTRAINTS Y FOREIGN KEYS
-- =====================================================

-- Agregar índice para id_sede en cursos
ALTER TABLE `cursos` 
ADD INDEX `idx_cursos_sede` (`id_sede`);

-- Agregar índice para id_area en cursos (si no existe)
ALTER TABLE `cursos` 
ADD INDEX IF NOT EXISTS `idx_cursos_area` (`id_area`);

-- Agregar foreign key de cursos a sedes
ALTER TABLE `cursos` 
ADD CONSTRAINT `fk_cursos_sedes` 
FOREIGN KEY (`id_sede`) REFERENCES `sedes`(`id_sede`) 
ON DELETE RESTRICT ON UPDATE CASCADE;

-- Agregar foreign key de cursos a areas
ALTER TABLE `cursos` 
ADD CONSTRAINT `fk_cursos_areas` 
FOREIGN KEY (`id_area`) REFERENCES `areas`(`id_area`) 
ON DELETE RESTRICT ON UPDATE CASCADE;

SELECT '✓ Paso 6: Constraints y Foreign Keys creados' AS status;

-- =====================================================
-- PASO 7: VERIFICACIÓN DE INTEGRIDAD
-- =====================================================

-- Verificar que todas las áreas están correctas
SELECT 'Verificación de áreas:' AS verificacion;
SELECT id_area, nombre_area, descripcion, estado FROM areas ORDER BY id_area;

-- Verificar que los cursos tienen sede asignada
SELECT 'Verificación de cursos:' AS verificacion;
SELECT c.id_curso, c.id_sede, a.nombre_area, c.nombre_curso, c.estado 
FROM cursos c
INNER JOIN areas a ON c.id_area = a.id_area
ORDER BY c.id_sede, a.nombre_area, c.nombre_curso;

-- Contar cursos por sede
SELECT 'Cursos por sede:' AS verificacion;
SELECT s.nombre_sede, COUNT(c.id_curso) as total_cursos
FROM sedes s
LEFT JOIN cursos c ON s.id_sede = c.id_sede
GROUP BY s.id_sede, s.nombre_sede;

SELECT '✓ Paso 7: Verificaciones completadas' AS status;

SET FOREIGN_KEY_CHECKS = 1;

-- =====================================================
-- NOTAS IMPORTANTES
-- =====================================================
-- 1. Todos los cursos existentes se asignaron a sede 18 por defecto
-- 2. Si tienes cursos que pertenecen a otras sedes, ejecuta:
--    UPDATE cursos SET id_sede = [ID_SEDE_CORRECTA] WHERE id_curso IN ([IDS]);
-- 3. Las áreas ahora son globales y compartidas entre todas las sedes
-- 4. Cada sede debe crear sus propios cursos dentro de estas áreas
-- 5. Las tablas de backup (areas_backup, cursos_backup) se conservan
--    por seguridad. Puedes eliminarlas después de validar:
--    DROP TABLE IF EXISTS areas_backup;
--    DROP TABLE IF EXISTS cursos_backup;
-- =====================================================

SELECT '✅ MIGRACIÓN COMPLETADA CON ÉXITO' AS status;
