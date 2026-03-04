-- ============================================
-- MIGRATION: Sistema de Límites por Sede
-- Fecha: 03-03-2026
-- Descripción: Gestión de distribución de límites de alumnos por sede
-- ============================================

USE primaria_bd_real;

-- ============================================
-- 1. CREAR TABLA: limites_sedes_suscripcion
-- ============================================
CREATE TABLE IF NOT EXISTS `limites_sedes_suscripcion` (
  `id_limite_sede` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `id_suscripcion` BIGINT(20) UNSIGNED NOT NULL,
  `id_sede` BIGINT(20) UNSIGNED NOT NULL,
  `limite_alumnos_asignado` INT(11) NOT NULL DEFAULT 0,
  `estado` INT(11) DEFAULT 1,
  PRIMARY KEY (`id_limite_sede`),
  UNIQUE KEY `uk_suscripcion_sede` (`id_suscripcion`, `id_sede`),
  KEY `idx_suscripcion` (`id_suscripcion`),
  KEY `idx_sede` (`id_sede`),
  CONSTRAINT `fk_limites_suscripcion` FOREIGN KEY (`id_suscripcion`) REFERENCES `suscripciones` (`id_suscripcion`) ON DELETE CASCADE,
  CONSTRAINT `fk_limites_sede` FOREIGN KEY (`id_sede`) REFERENCES `sedes` (`id_sede`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ============================================
-- 2. AGREGAR CAMPO: tipo_distribucion_limite
-- ============================================
ALTER TABLE `suscripciones` 
ADD COLUMN `tipo_distribucion_limite` VARCHAR(20) DEFAULT 'EQUITATIVA' 
COMMENT 'EQUITATIVA o PERSONALIZADA' 
AFTER `limite_sedes_contratadas`;

-- ============================================
-- 3. COMENTARIOS EN CAMPOS EXISTENTES
-- ============================================
ALTER TABLE `suscripciones` 
MODIFY COLUMN `limite_alumnos_contratado` INT(11) NOT NULL 
COMMENT 'Límite total de alumnos para toda la institución';

ALTER TABLE `suscripciones` 
MODIFY COLUMN `limite_sedes_contratadas` INT(11) NOT NULL 
COMMENT 'Número máximo de sedes permitidas';

-- ============================================
-- FIN DE LA MIGRACIÓN
-- ============================================
