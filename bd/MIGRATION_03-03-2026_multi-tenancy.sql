-- ========================================
-- SCRIPT DE ACTUALIZACIÓN DE BASE DE DATOS
-- Sistema Multi-Tenancy y Facturación
-- Fecha: 03-03-2026
-- ========================================

-- =====================================================
-- 1. AGREGAR CAMPOS DE FACTURACIÓN A TABLA INSTITUCION
-- =====================================================
-- RUC único por institución (Persona Jurídica)
ALTER TABLE institucion 
    ADD COLUMN ruc VARCHAR(11) UNIQUE AFTER cod_modular,
    ADD COLUMN razon_social VARCHAR(200) AFTER nombre,
    ADD COLUMN domicilio_fiscal VARCHAR(255) AFTER razon_social,
    ADD COLUMN representante_legal VARCHAR(150) AFTER nombre_director,
    ADD COLUMN correo_facturacion VARCHAR(100),
    ADD COLUMN telefono_facturacion VARCHAR(20);

-- Comentarios descriptivos
COMMENT ON COLUMN institucion.ruc IS 'Número de RUC de la institución (único por persona jurídica)';
COMMENT ON COLUMN institucion.razon_social IS 'Razón social completa de la institución';
COMMENT ON COLUMN institucion.domicilio_fiscal IS 'Dirección fiscal de la sede principal';
COMMENT ON COLUMN institucion.representante_legal IS 'Nombre del representante legal';
COMMENT ON COLUMN institucion.correo_facturacion IS 'Correo para envío de facturas y comprobantes';
COMMENT ON COLUMN institucion.telefono_facturacion IS 'Teléfono de contacto para facturación';


-- =====================================================
-- 2. AGREGAR CAMPOS DE ESTABLECIMIENTO A TABLA SEDES
-- =====================================================
-- Código de establecimiento SUNAT (0000 = Principal, 0001, 0002... = Anexos)
ALTER TABLE sedes
    ADD COLUMN codigo_establecimiento VARCHAR(4) DEFAULT '0000' AFTER id_institucion,
    ADD COLUMN es_sede_principal BOOLEAN DEFAULT FALSE AFTER codigo_establecimiento;

-- Comentarios descriptivos
COMMENT ON COLUMN sedes.codigo_establecimiento IS 'Código de establecimiento SUNAT (0000=Principal, 0001-9999=Anexos)';
COMMENT ON COLUMN sedes.es_sede_principal IS 'Indica si es la sede principal (domicilio fiscal)';


-- =====================================================
-- 3. ACTUALIZAR SEDES EXISTENTES (OPCIONAL)
-- =====================================================
-- Marcar la primera sede de cada institución como principal
-- Solo si quieres actualizar datos existentes

-- Ejemplo: Si quieres que la primera sede (menor ID) sea la principal:
/*
UPDATE sedes s1
JOIN (
    SELECT id_institucion, MIN(id_sede) as primera_sede
    FROM sedes
    GROUP BY id_institucion
) s2 ON s1.id_sede = s2.primera_sede
SET s1.es_sede_principal = TRUE,
    s1.codigo_establecimiento = '0000';
*/

-- Asignar códigos correlativos a sedes anexas (opcional)
/*
UPDATE sedes 
SET codigo_establecimiento = LPAD(
    (SELECT COUNT(*) 
     FROM (SELECT * FROM sedes) s2 
     WHERE s2.id_institucion = sedes.id_institucion 
     AND s2.id_sede < sedes.id_sede), 
    4, '0'
)
WHERE es_sede_principal = FALSE;
*/


-- =====================================================
-- 4. OBSERVACIONES Y RECOMENDACIONES
-- =====================================================
-- 
-- NOTA IMPORTANTE:
-- - Los campos estado_suscripcion, fecha_inicio_suscripcion, 
--   fecha_vencimiento_licencia y plan_contratado en la tabla
--   institucion son REDUNDANTES.
--
-- - La información de suscripción DEBE obtenerse de la tabla
--   suscripciones para evitar inconsistencias.
--
-- OPCIONAL: Si deseas limpiar la redundancia, ejecutar:
/*
ALTER TABLE institucion
    DROP COLUMN estado_suscripcion,
    DROP COLUMN fecha_inicio_suscripcion,
    DROP COLUMN fecha_vencimiento_licencia,
    DROP COLUMN plan_contratado;
*/
--
-- =====================================================

-- Verificar cambios
SELECT 'Columnas agregadas a institucion:' as info;
SHOW COLUMNS FROM institucion WHERE Field IN ('ruc', 'razon_social', 'domicilio_fiscal', 'representante_legal', 'correo_facturacion', 'telefono_facturacion');

SELECT 'Columnas agregadas a sedes:' as info;
SHOW COLUMNS FROM sedes WHERE Field IN ('codigo_establecimiento', 'es_sede_principal');

-- =====================================================
-- FIN DEL SCRIPT
-- =====================================================
