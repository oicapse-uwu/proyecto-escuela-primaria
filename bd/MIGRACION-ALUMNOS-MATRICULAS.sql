-- ================================================================================================
-- MIGRACION: Arquitectura Correcta de Alumnos, Matrículas y Movimientos
-- Fecha: 2026-03-09
-- Descripción: Implementación de gestión de vacantes y separación de responsabilidades
-- ================================================================================================

-- ================================================================================================
-- PASO 1: CREAR TABLA MOVIMIENTOS_ALUMNO (Nueva tabla para gestionar retiros y traslados)
-- ================================================================================================

CREATE TABLE IF NOT EXISTS `movimientos_alumno` (
  `id_movimiento` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `id_matricula` bigint(20) UNSIGNED NOT NULL,
  `tipo_movimiento` enum('Retiro','Traslado_Saliente','Cambio_Seccion') NOT NULL,
  `fecha_movimiento` date NOT NULL,
  `fecha_solicitud` datetime DEFAULT current_timestamp(),
  `motivo` text NOT NULL,
  `colegio_destino` varchar(200) DEFAULT NULL,
  `documentos_url` varchar(255) DEFAULT NULL,
  `observaciones` text DEFAULT NULL,
  `id_usuario_registro` bigint(20) UNSIGNED DEFAULT NULL,
  `id_usuario_aprobador` bigint(20) UNSIGNED DEFAULT NULL,
  `fecha_aprobacion` datetime DEFAULT NULL,
  `estado_solicitud` enum('Pendiente','Aprobada','Rechazada') DEFAULT 'Pendiente',
  `estado` int(11) DEFAULT 1,
  PRIMARY KEY (`id_movimiento`),
  KEY `idx_matricula` (`id_matricula`),
  KEY `idx_fecha` (`fecha_movimiento`),
  KEY `idx_tipo` (`tipo_movimiento`),
  KEY `idx_estado_solicitud` (`estado_solicitud`),
  CONSTRAINT `fk_mov_alumno_matricula` FOREIGN KEY (`id_matricula`) REFERENCES `matriculas` (`id_matricula`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ================================================================================================
-- PASO 2: MIGRAR DATOS EXISTENTES DE MATRICULAS A MOVIMIENTOS_ALUMNO
-- ================================================================================================

-- Migrar retiros/traslados existentes de matriculas a movimientos_alumno
INSERT INTO `movimientos_alumno` 
  (`id_matricula`, `tipo_movimiento`, `fecha_movimiento`, `motivo`, `colegio_destino`, `estado_solicitud`)
SELECT 
  m.id_matricula,
  CASE 
    WHEN m.estado_matricula = 'Trasladado_Saliente' THEN 'Traslado_Saliente'
    WHEN m.estado_matricula = 'Retirada' THEN 'Retiro'
    ELSE 'Retiro'
  END as tipo_movimiento,
  COALESCE(m.fecha_retiro, NOW()) as fecha_movimiento,
  COALESCE(m.motivo_retiro, 'Migración de datos antiguos') as motivo,
  m.colegio_destino,
  'Aprobada' as estado_solicitud
FROM `matriculas` m
WHERE m.fecha_retiro IS NOT NULL 
   OR m.motivo_retiro IS NOT NULL 
   OR m.estado_matricula IN ('Retirada', 'Trasladado_Saliente');

-- ================================================================================================
-- PASO 3: MODIFICAR TABLA MATRICULAS
-- ================================================================================================

-- 3.1: Agregar nuevos campos
ALTER TABLE `matriculas` 
  ADD COLUMN `fecha_vencimiento_pago` datetime DEFAULT NULL COMMENT 'Plazo límite para pagar (solo nuevos/trasladados)' AFTER `fecha_matricula`,
  ADD COLUMN `vacante_garantizada` tinyint(1) DEFAULT 0 COMMENT 'Si es promovido/repitente, vacante garantizada' AFTER `situacion_academica_previa`,
  ADD COLUMN `fecha_pago_matricula` datetime DEFAULT NULL COMMENT 'Fecha en que se confirmó el pago (orden de llegada)' AFTER `vacante_garantizada`;

-- 3.2: Modificar campo situacion_academica_previa a tipo_ingreso
ALTER TABLE `matriculas` 
  CHANGE COLUMN `situacion_academica_previa` `tipo_ingreso` 
  enum('Nuevo','Promovido','Repitente','Trasladado_Entrante') NOT NULL;

-- 3.3: Actualizar valores de tipo_ingreso
UPDATE `matriculas` 
SET `tipo_ingreso` = CASE 
  WHEN `tipo_ingreso` = 'Promovido' THEN 'Promovido'
  WHEN `tipo_ingreso` = 'Repitente' THEN 'Repitente'
  WHEN `tipo_ingreso` = 'Ingresante' THEN 'Nuevo'
  ELSE 'Nuevo'
END;

-- 3.4: Modificar estado_matricula (simplificado)
ALTER TABLE `matriculas` 
  MODIFY COLUMN `estado_matricula` 
  enum('Pendiente_Pago','Activa','Finalizada','Cancelada') NOT NULL DEFAULT 'Pendiente_Pago';

-- 3.5: Actualizar estados existentes a la nueva nomenclatura
UPDATE `matriculas` 
SET `estado_matricula` = CASE 
  WHEN `estado_matricula` = 'Activa' THEN 'Activa'
  WHEN `estado_matricula` IN ('Retirada', 'Trasladado_Saliente') THEN 'Finalizada'
  ELSE 'Activa'
END;

-- 3.6: Establecer vacante_garantizada para matrículas existentes
UPDATE `matriculas` 
SET `vacante_garantizada` = CASE 
  WHEN `tipo_ingreso` IN ('Promovido', 'Repitente') THEN 1
  ELSE 0
END;

-- 3.7: Establecer fecha_pago_matricula para matrículas activas (usar fecha_matricula como referencia)
UPDATE `matriculas` 
SET `fecha_pago_matricula` = `fecha_matricula`
WHERE `estado_matricula` = 'Activa' AND `fecha_pago_matricula` IS NULL;

-- 3.8: Agregar índices para optimización
ALTER TABLE `matriculas`
  ADD KEY `idx_estado_tipo` (`estado_matricula`, `tipo_ingreso`),
  ADD KEY `idx_vacante_garantizada` (`vacante_garantizada`),
  ADD KEY `idx_fecha_vencimiento` (`fecha_vencimiento_pago`);

-- 3.9: ELIMINAR CAMPOS OBSOLETOS (después de migrar a movimientos_alumno)
ALTER TABLE `matriculas`
  DROP COLUMN `fecha_retiro`,
  DROP COLUMN `motivo_retiro`,
  DROP COLUMN `colegio_destino`;

-- ================================================================================================
-- PASO 4: MODIFICAR TABLA ALUMNOS (Limpiar campos incorrectos)
-- ================================================================================================

-- 4.1: Eliminar campos que no deben estar en alumnos
ALTER TABLE `alumnos`
  DROP COLUMN IF EXISTS `tipo_ingreso`,
  DROP COLUMN IF EXISTS `estado_alumno`;

-- ================================================================================================
-- PASO 5: CREAR VISTA PARA ESTADO DEL ALUMNO (Derivado, no almacenado)
-- ================================================================================================

CREATE OR REPLACE VIEW `v_estado_alumnos` AS
SELECT 
  a.id_alumno,
  a.numero_documento,
  a.nombres,
  a.apellidos,
  a.fecha_nacimiento,
  m.id_matricula,
  m.tipo_ingreso,
  m.estado_matricula,
  m.vacante_garantizada,
  m.fecha_pago_matricula,
  m.fecha_vencimiento_pago,
  an.nombre_anio,
  s.nombre_seccion,
  CASE 
    WHEN m.estado_matricula = 'Activa' AND an.activo = 1 THEN 'Matriculado_Activo'
    WHEN m.estado_matricula = 'Pendiente_Pago' AND m.vacante_garantizada = 1 THEN 'Promovido_Pendiente_Pago'
    WHEN m.estado_matricula = 'Pendiente_Pago' AND m.vacante_garantizada = 0 THEN 'En_Proceso_Compitiendo'
    WHEN m.estado_matricula = 'Cancelada' THEN 'Matricula_Cancelada'
    WHEN m.estado_matricula = 'Finalizada' AND EXISTS (
      SELECT 1 FROM movimientos_alumno ma 
      WHERE ma.id_matricula = m.id_matricula 
        AND ma.tipo_movimiento = 'Retiro' 
        AND ma.estado_solicitud = 'Aprobada'
    ) THEN 'Retirado'
    WHEN m.estado_matricula = 'Finalizada' AND EXISTS (
      SELECT 1 FROM movimientos_alumno ma 
      WHERE ma.id_matricula = m.id_matricula 
        AND ma.tipo_movimiento = 'Traslado_Saliente' 
        AND ma.estado_solicitud = 'Aprobada'
    ) THEN 'Trasladado'
    WHEN m.estado_matricula = 'Finalizada' THEN 'Año_Finalizado'
    ELSE 'Sin_Matricula_Vigente'
  END as estado_alumno_derivado,
  ma.tipo_movimiento as ultimo_movimiento,
  ma.fecha_movimiento as fecha_ultimo_movimiento
FROM alumnos a
LEFT JOIN matriculas m ON a.id_alumno = m.id_alumno
LEFT JOIN anio_escolar an ON m.id_anio = an.id_anio
LEFT JOIN secciones s ON m.id_seccion = s.id_seccion
LEFT JOIN movimientos_alumno ma ON m.id_matricula = ma.id_matricula 
  AND ma.id_movimiento = (
    SELECT MAX(id_movimiento) FROM movimientos_alumno 
    WHERE id_matricula = m.id_matricula
  )
WHERE a.estado = 1
  AND (an.activo = 1 OR an.id_anio IS NULL);

-- ================================================================================================
-- PASO 6: CREAR PROCEDIMIENTO ALMACENADO PARA CONFIRMAR PAGO DE MATRÍCULA
-- ================================================================================================

DELIMITER $$

CREATE PROCEDURE `sp_confirmar_pago_matricula`(
  IN p_id_matricula BIGINT,
  OUT p_resultado VARCHAR(50),
  OUT p_mensaje VARCHAR(255)
)
BEGIN
  DECLARE v_vacante_garantizada TINYINT;
  DECLARE v_id_seccion BIGINT;
  DECLARE v_id_anio BIGINT;
  DECLARE v_capacidad_maxima INT;
  DECLARE v_vacantes_ocupadas INT;
  DECLARE v_estado_actual VARCHAR(50);
  
  -- Iniciar transacción
  START TRANSACTION;
  
  -- Obtener datos de la matrícula
  SELECT 
    vacante_garantizada, 
    id_seccion, 
    id_anio,
    estado_matricula
  INTO 
    v_vacante_garantizada, 
    v_id_seccion, 
    v_id_anio,
    v_estado_actual
  FROM matriculas 
  WHERE id_matricula = p_id_matricula;
  
  -- Validar que la matrícula existe
  IF v_id_seccion IS NULL THEN
    SET p_resultado = 'ERROR';
    SET p_mensaje = 'Matrícula no encontrada';
    ROLLBACK;
  -- Validar que está en estado Pendiente_Pago
  ELSEIF v_estado_actual != 'Pendiente_Pago' THEN
    SET p_resultado = 'ERROR';
    SET p_mensaje = CONCAT('La matrícula ya está en estado: ', v_estado_actual);
    ROLLBACK;
  -- Si tiene vacante garantizada (promovido/repitente), confirmar directo
  ELSEIF v_vacante_garantizada = 1 THEN
    UPDATE matriculas 
    SET 
      estado_matricula = 'Activa',
      fecha_pago_matricula = NOW()
    WHERE id_matricula = p_id_matricula;
    
    SET p_resultado = 'EXITO';
    SET p_mensaje = 'Matrícula confirmada (vacante garantizada)';
    COMMIT;
  ELSE
    -- Para nuevos/trasladados: verificar capacidad real
    SELECT capacidad_maxima 
    INTO v_capacidad_maxima
    FROM secciones 
    WHERE id_seccion = v_id_seccion;
    
    SELECT COUNT(*) 
    INTO v_vacantes_ocupadas
    FROM matriculas 
    WHERE id_seccion = v_id_seccion 
      AND id_anio = v_id_anio 
      AND estado_matricula = 'Activa'
      AND estado = 1;
    
    -- Verificar si hay vacante disponible
    IF v_vacantes_ocupadas < v_capacidad_maxima THEN
      UPDATE matriculas 
      SET 
        estado_matricula = 'Activa',
        fecha_pago_matricula = NOW()
      WHERE id_matricula = p_id_matricula;
      
      SET p_resultado = 'EXITO';
      SET p_mensaje = CONCAT('Matrícula confirmada. Vacante ', v_vacantes_ocupadas + 1, ' de ', v_capacidad_maxima);
      COMMIT;
    ELSE
      -- No hay vacantes disponibles
      UPDATE matriculas 
      SET estado_matricula = 'Cancelada'
      WHERE id_matricula = p_id_matricula;
      
      SET p_resultado = 'SIN_VACANTE';
      SET p_mensaje = 'No hay vacantes disponibles. La matrícula ha sido cancelada.';
      COMMIT;
    END IF;
  END IF;
  
END$$

DELIMITER ;

-- ================================================================================================
-- PASO 7: CREAR JOB PARA EXPIRACIÓN AUTOMÁTICA DE MATRÍCULAS
-- ================================================================================================

-- Nota: Este es un evento que se ejecuta diariamente
-- Asegúrate de que el Event Scheduler esté habilitado: SET GLOBAL event_scheduler = ON;

DELIMITER $$

CREATE EVENT IF NOT EXISTS `evt_expirar_matriculas_vencidas`
ON SCHEDULE EVERY 1 DAY
STARTS CURRENT_DATE + INTERVAL 1 DAY + INTERVAL 2 HOUR
DO
BEGIN
  -- Cancelar matrículas pendientes de pago que han vencido (solo las que compiten)
  UPDATE matriculas 
  SET estado_matricula = 'Cancelada'
  WHERE estado_matricula = 'Pendiente_Pago'
    AND vacante_garantizada = 0
    AND fecha_vencimiento_pago < NOW()
    AND estado = 1;
END$$

DELIMITER ;

-- ================================================================================================
-- PASO 8: INSERTAR DATOS DE EJEMPLO (OPCIONAL - Solo para testing)
-- ================================================================================================

-- Ejemplo de configuración de días de vencimiento por defecto
-- INSERT INTO configuracion (clave, valor, descripcion) VALUES
-- ('dias_vencimiento_matricula_nuevo', '7', 'Días para pagar matrícula (alumnos nuevos)'),
-- ('dias_vencimiento_matricula_trasladado', '7', 'Días para pagar matrícula (alumnos trasladados)');

-- ================================================================================================
-- VERIFICACIONES POST-MIGRACIÓN
-- ================================================================================================

-- Verificar estructura de movimientos_alumno
SELECT 'Verificando tabla movimientos_alumno...' as paso;
SELECT COUNT(*) as total_movimientos FROM movimientos_alumno;

-- Verificar campos nuevos en matriculas
SELECT 'Verificando campos en matriculas...' as paso;
DESCRIBE matriculas;

-- Verificar campos eliminados de alumnos
SELECT 'Verificando tabla alumnos...' as paso;
DESCRIBE alumnos;

-- Verificar distribución de vacantes garantizadas
SELECT 'Distribución de vacantes garantizadas:' as paso;
SELECT 
  tipo_ingreso,
  vacante_garantizada,
  estado_matricula,
  COUNT(*) as total
FROM matriculas
GROUP BY tipo_ingreso, vacante_garantizada, estado_matricula
ORDER BY tipo_ingreso, vacante_garantizada;

-- Verificar vista de estado de alumnos
SELECT 'Vista de estado de alumnos creada:' as paso;
SELECT COUNT(*) as total_registros FROM v_estado_alumnos;

-- ================================================================================================
-- FIN DE LA MIGRACIÓN
-- ================================================================================================

SELECT '✅ Migración completada exitosamente' as resultado;
