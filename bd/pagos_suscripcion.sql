-- =====================================================
-- TABLA: pagos_suscripcion
-- Sistema de Pagos de Suscripciones para Super Admin
-- =====================================================

CREATE TABLE `pagos_suscripcion` (
    -- IDENTIFICACIÓN
    `id_pago` BIGINT PRIMARY KEY AUTO_INCREMENT,
    `numero_pago` VARCHAR(20) NOT NULL UNIQUE COMMENT 'Correlativo: PAGO-0001, PAGO-0002, etc. (generado automáticamente)',
    
    -- RELACIONES
    `id_suscripcion` BIGINT NOT NULL COMMENT 'FK a suscripcion',
    `id_metodo_pago` INT NOT NULL COMMENT 'FK a metodo_pago',
    
    -- DATOS DEL PAGO
    `monto_pagado` DECIMAL(10,2) NOT NULL COMMENT 'Monto que pagó la institución',
    `fecha_pago` DATE NOT NULL COMMENT 'Fecha en que la institución realizó el pago',
    `numero_operacion` VARCHAR(100) NULL COMMENT 'Número de operación bancaria (del comprobante)',
    `banco` VARCHAR(100) NULL COMMENT 'Banco donde se hizo el depósito/transferencia (solo si método = Transferencia)',
    
    -- COMPROBANTE (OBLIGATORIO)
    `comprobante_url` VARCHAR(500) NOT NULL COMMENT 'Ruta de la imagen/PDF del comprobante',
    
    -- VERIFICACIÓN
    `estado_verificacion` ENUM('PENDIENTE', 'VERIFICADO', 'RECHAZADO') DEFAULT 'PENDIENTE' COMMENT 'Estado de verificación del pago',
    `verificado_por` BIGINT NULL COMMENT 'FK a super_admins - ID del super admin que verificó (automático)',
    `fecha_verificacion` DATETIME NULL COMMENT 'Fecha y hora de verificación',
    `observaciones` TEXT NULL COMMENT 'Notas adicionales o motivo de rechazo',
    
    -- AUDITORÍA
    `fecha_registro` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha y hora en que se registró en el sistema (automático)',
    `estado` INT DEFAULT 1 COMMENT '1: Activo, 0: Anulado',
    
    -- FOREIGN KEYS
    FOREIGN KEY (`id_suscripcion`) REFERENCES `suscripcion`(`id_suscripcion`) ON DELETE RESTRICT,
    FOREIGN KEY (`id_metodo_pago`) REFERENCES `metodo_pago`(`id_metodo`) ON DELETE RESTRICT,
    FOREIGN KEY (`verificado_por`) REFERENCES `super_admins`(`id_admin`) ON DELETE SET NULL,
    
    -- ÍNDICES
    INDEX `idx_suscripcion` (`id_suscripcion`),
    INDEX `idx_fecha_pago` (`fecha_pago`),
    INDEX `idx_estado_verificacion` (`estado_verificacion`),
    INDEX `idx_numero_pago` (`numero_pago`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Pagos de suscripciones realizados por instituciones (exclusivo Super Admin)';

-- =====================================================
-- TRIGGER: Generar número_pago automáticamente
-- =====================================================
DELIMITER $$

CREATE TRIGGER `before_insert_pagos_suscripcion`
BEFORE INSERT ON `pagos_suscripcion`
FOR EACH ROW
BEGIN
    DECLARE siguiente_numero INT;
    
    -- Obtener el último número de pago
    SELECT COALESCE(MAX(CAST(SUBSTRING(numero_pago, 6) AS UNSIGNED)), 0) + 1 
    INTO siguiente_numero
    FROM pagos_suscripcion;
    
    -- Generar número con formato PAGO-0001
    SET NEW.numero_pago = CONCAT('PAGO-', LPAD(siguiente_numero, 4, '0'));
END$$

DELIMITER ;

-- =====================================================
-- DATOS DE PRUEBA (Opcional - Descomentar si necesitas)
-- =====================================================
/*
INSERT INTO pagos_suscripcion 
(id_suscripcion, id_metodo_pago, monto_pagado, fecha_pago, numero_operacion, banco, comprobante_url, estado_verificacion, observaciones)
VALUES
(1, 1, 2500.00, '2026-03-01', '001234567890', 'BCP', '/uploads/comprobantes/suscripciones/comp001.jpg', 'VERIFICADO', 'Pago completo del ciclo anual'),
(2, 2, 2000.00, '2026-03-03', NULL, NULL, '/uploads/comprobantes/suscripciones/comp002.jpg', 'PENDIENTE', NULL);
*/
