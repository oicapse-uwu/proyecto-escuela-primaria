-- ============================================
-- SCRIPT DE MIGRACIÓN: rol_modulo_permiso → rol_modulo
-- Ejecutar en cPanel phpMyAdmin
-- ============================================

-- PASO 1: Crear tabla rol_modulo
CREATE TABLE IF NOT EXISTS `rol_modulo` (
  `id_rol_modulo` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `id_rol` bigint(20) UNSIGNED NOT NULL,
  `id_modulo` bigint(20) UNSIGNED NOT NULL,
  `estado` int(11) DEFAULT 1,
  PRIMARY KEY (`id_rol_modulo`),
  UNIQUE KEY `uk_rol_modulo` (`id_rol`, `id_modulo`),
  KEY `fk_rol_modulo_rol` (`id_rol`),
  KEY `fk_rol_modulo_modulo` (`id_modulo`),
  CONSTRAINT `fk_rol_modulo_rol` FOREIGN KEY (`id_rol`) REFERENCES `roles` (`id_rol`),
  CONSTRAINT `fk_rol_modulo_modulo` FOREIGN KEY (`id_modulo`) REFERENCES `modulos` (`id_modulo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- PASO 2: Migrar datos de rol_modulo_permiso a rol_modulo
-- Agrupa por rol-modulo para eliminar duplicados
INSERT INTO `rol_modulo` (`id_rol`, `id_modulo`, `estado`)
SELECT DISTINCT rmp.id_rol, rmp.id_modulo, 1
FROM `rol_modulo_permiso` rmp
WHERE rmp.estado = 1
ON DUPLICATE KEY UPDATE estado = 1;

-- Verificar que se migró correctamente
-- SELECT COUNT(*) as total_registros FROM rol_modulo;
-- SELECT * FROM rol_modulo LIMIT 10;

-- PASO 3: Crear Stored Procedure para validar acceso a módulos
DROP PROCEDURE IF EXISTS validarAccesoModuloUsuario;

DELIMITER //
CREATE PROCEDURE validarAccesoModuloUsuario(
  IN p_idUsuario BIGINT,
  IN p_idModulo BIGINT
)
BEGIN
  DECLARE v_idRol BIGINT DEFAULT NULL;
  DECLARE v_existe INT DEFAULT 0;
  
  SELECT id_rol INTO v_idRol FROM usuarios WHERE id_usuario = p_idUsuario LIMIT 1;
  
  IF v_idRol IS NULL THEN
    SELECT 0 as resultado;
  ELSEIF v_idRol = 1 THEN
    SELECT 1 as resultado;
  ELSE
    SELECT COALESCE((SELECT COUNT(*) FROM rol_modulo 
                     WHERE id_rol = v_idRol 
                     AND id_modulo = p_idModulo 
                     AND estado = 1), 0) as resultado;
  END IF;
END //
DELIMITER;

-- PASO 4: Verificar que el SP se creó correctamente
-- SHOW PROCEDURE STATUS WHERE Db = 'primaria_bd_real' AND Name = 'validarAccesoModuloUsuario';

-- PASO 5 (OPCIONAL): Eliminar tabla vieja rol_modulo_permiso si todo está bien
-- Primero comentado para seguridad. Descomenta cuando hayas verificado todo
-- DROP TABLE `rol_modulo_permiso`;
