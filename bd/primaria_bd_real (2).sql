-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost:3306
-- Tiempo de generación: 06-03-2026 a las 07:42:15
-- Versión del servidor: 10.11.16-MariaDB
-- Versión de PHP: 8.4.18

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `primaria_bd_real`
--

DELIMITER $$
--
-- Procedimientos
--
CREATE DEFINER=`primaria`@`localhost` PROCEDURE `validarAccesoModuloUsuario` (IN `p_idUsuario` BIGINT, IN `p_idModulo` BIGINT)   BEGIN
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
END$$

CREATE DEFINER=`primaria`@`localhost` PROCEDURE `verificar_permiso_usuario` (IN `p_id_usuario` BIGINT(20), IN `p_codigo_permiso` VARCHAR(255), OUT `p_tiene_permiso` BOOLEAN)   BEGIN
    DECLARE v_id_rol BIGINT(20);
    DECLARE v_conteo INT;

    -- 1. Obtenemos el ID del rol del usuario
    SELECT id_rol INTO v_id_rol 
    FROM usuarios 
    WHERE id_usuario = p_id_usuario;

    -- 2. Verificamos la excepción: si el rol es 1, siempre es TRUE
    IF v_id_rol = 1 THEN
        SET p_tiene_permiso = TRUE;
    ELSE
        -- 3. Buscamos si existe la relación entre el rol y el código del permiso
        SELECT COUNT(*) INTO v_conteo
        FROM rol_modulo_permiso rmp
        INNER JOIN permisos p ON rmp.id_permiso = p.id_permiso
        WHERE rmp.id_rol = v_id_rol 
          AND p.codigo = p_codigo_permiso
          AND rmp.estado = 1; -- Asumiendo que 1 es estado activo

        IF v_conteo > 0 THEN
            SET p_tiene_permiso = TRUE;
        ELSE
            SET p_tiene_permiso = FALSE;
        END IF;
    END IF;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `alumnos`
--

CREATE TABLE `alumnos` (
  `id_alumno` bigint(20) UNSIGNED NOT NULL,
  `id_sede` bigint(20) UNSIGNED NOT NULL,
  `id_tipo_doc` bigint(20) UNSIGNED NOT NULL,
  `numero_documento` varchar(20) NOT NULL,
  `nombres` varchar(100) NOT NULL,
  `apellidos` varchar(100) NOT NULL,
  `fecha_nacimiento` date NOT NULL,
  `genero` enum('M','F') NOT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `telefono_contacto` varchar(20) DEFAULT NULL,
  `foto_url` varchar(255) DEFAULT NULL,
  `observaciones_salud` text DEFAULT NULL,
  `tipo_ingreso` varchar(50) DEFAULT NULL,
  `estado_alumno` varchar(255) DEFAULT NULL,
  `estado` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `alumno_apoderado`
--

CREATE TABLE `alumno_apoderado` (
  `id_alum_apod` bigint(20) UNSIGNED NOT NULL,
  `id_alumno` bigint(20) UNSIGNED NOT NULL,
  `id_apoderado` bigint(20) UNSIGNED NOT NULL,
  `parentesco` varchar(50) NOT NULL,
  `es_representante_financiero` tinyint(1) DEFAULT 0,
  `vive_con_estudiante` tinyint(1) DEFAULT 1,
  `estado` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `anio_escolar`
--

CREATE TABLE `anio_escolar` (
  `id_anio_escolar` bigint(20) UNSIGNED NOT NULL,
  `id_sede` bigint(20) UNSIGNED NOT NULL,
  `nombre_anio` varchar(50) DEFAULT NULL,
  `activo` int(11) DEFAULT NULL,
  `estado` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `apoderados`
--

CREATE TABLE `apoderados` (
  `id_apoderado` bigint(20) UNSIGNED NOT NULL,
  `id_sede` bigint(20) UNSIGNED NOT NULL,
  `id_tipo_doc` bigint(20) UNSIGNED NOT NULL,
  `numero_documento` varchar(20) NOT NULL,
  `nombres` varchar(100) NOT NULL,
  `apellidos` varchar(100) NOT NULL,
  `telefono_principal` varchar(20) NOT NULL,
  `correo` varchar(100) DEFAULT NULL,
  `lugar_trabajo` varchar(100) DEFAULT NULL,
  `estado` int(11) DEFAULT NULL,
  `lugarTrabajo` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `areas`
--

CREATE TABLE `areas` (
  `id_area` bigint(20) UNSIGNED NOT NULL,
  `id_sede` bigint(20) UNSIGNED NOT NULL,
  `nombre_area` varchar(255) DEFAULT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `estado` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `asignacion_docente`
--

CREATE TABLE `asignacion_docente` (
  `id_asignacion` bigint(20) UNSIGNED NOT NULL,
  `id_docente` bigint(20) UNSIGNED NOT NULL,
  `id_seccion` bigint(20) UNSIGNED NOT NULL,
  `id_curso` bigint(20) UNSIGNED NOT NULL,
  `id_anio` bigint(20) UNSIGNED NOT NULL,
  `estado` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `asistencias`
--

CREATE TABLE `asistencias` (
  `id_asistencia` bigint(20) UNSIGNED NOT NULL,
  `id_asignacion` bigint(20) UNSIGNED NOT NULL,
  `id_matricula` bigint(20) UNSIGNED NOT NULL,
  `fecha` date NOT NULL,
  `estado_asistencia` enum('Presente','Falta','Tardanza','Justificado') DEFAULT NULL,
  `observaciones` varchar(255) DEFAULT NULL,
  `estado` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `aulas`
--

CREATE TABLE `aulas` (
  `id_aula` bigint(20) UNSIGNED NOT NULL,
  `id_sede` bigint(20) UNSIGNED NOT NULL,
  `nombre_aula` varchar(50) NOT NULL,
  `capacidad` int(11) DEFAULT NULL,
  `estado` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `calificaciones`
--

CREATE TABLE `calificaciones` (
  `id_calificacion` bigint(20) UNSIGNED NOT NULL,
  `id_evaluacion` bigint(20) UNSIGNED NOT NULL,
  `id_matricula` bigint(20) UNSIGNED NOT NULL,
  `nota_obtenida` varchar(10) NOT NULL,
  `observaciones` varchar(255) DEFAULT NULL,
  `fecha_calificacion` datetime DEFAULT current_timestamp(),
  `estado` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ciclos_facturacion`
--

CREATE TABLE `ciclos_facturacion` (
  `id_ciclo` bigint(20) UNSIGNED NOT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  `meses_duracion` int(11) NOT NULL,
  `estado` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `ciclos_facturacion`
--

INSERT INTO `ciclos_facturacion` (`id_ciclo`, `nombre`, `meses_duracion`, `estado`) VALUES
(1, 'Mensual', 1, 1),
(2, 'Anual', 12, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `conceptos_pago`
--

CREATE TABLE `conceptos_pago` (
  `id_concepto` bigint(20) UNSIGNED NOT NULL,
  `id_institucion` bigint(20) UNSIGNED NOT NULL,
  `id_grado` bigint(20) UNSIGNED DEFAULT NULL,
  `nombre_concepto` varchar(255) DEFAULT NULL,
  `monto` decimal(38,2) DEFAULT NULL,
  `estado_concepto` int(11) DEFAULT NULL,
  `estado` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cursos`
--

CREATE TABLE `cursos` (
  `id_curso` bigint(20) UNSIGNED NOT NULL,
  `id_area` bigint(20) UNSIGNED NOT NULL,
  `nombre_curso` varchar(255) DEFAULT NULL,
  `estado` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `deudas_alumno`
--

CREATE TABLE `deudas_alumno` (
  `id_deuda` bigint(20) UNSIGNED NOT NULL,
  `id_matricula` bigint(20) UNSIGNED NOT NULL,
  `id_concepto` bigint(20) UNSIGNED NOT NULL,
  `descripcion_cuota` varchar(255) DEFAULT NULL,
  `monto_total` decimal(38,2) DEFAULT NULL,
  `fecha_emision` date NOT NULL,
  `fecha_vencimiento` date NOT NULL,
  `estado_deuda` varchar(255) DEFAULT NULL,
  `fecha_pago_total` datetime DEFAULT NULL,
  `estado` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `documentos_alumno`
--

CREATE TABLE `documentos_alumno` (
  `id_doc_alumno` bigint(20) UNSIGNED NOT NULL,
  `id_alumno` bigint(20) UNSIGNED NOT NULL,
  `id_requisito` bigint(20) UNSIGNED DEFAULT NULL,
  `ruta_archivo` varchar(255) NOT NULL,
  `fecha_subida` datetime DEFAULT current_timestamp(),
  `estado_revision` varchar(50) DEFAULT NULL,
  `observaciones` text DEFAULT NULL,
  `estado` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `especialidades`
--

CREATE TABLE `especialidades` (
  `id_especialidad` bigint(20) UNSIGNED NOT NULL,
  `nombre_especialidad` varchar(255) DEFAULT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `estado` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `especialidades`
--

INSERT INTO `especialidades` (`id_especialidad`, `nombre_especialidad`, `descripcion`, `estado`) VALUES
(1, 'Educación Primaria', NULL, 1),
(2, 'Educación Física', NULL, 1),
(3, 'Inglés', NULL, 1),
(4, 'Computación e Informática', NULL, 1),
(5, 'Arte y Cultura', NULL, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estados_suscripcion`
--

CREATE TABLE `estados_suscripcion` (
  `id_estado` bigint(20) UNSIGNED NOT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  `estado` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `estados_suscripcion`
--

INSERT INTO `estados_suscripcion` (`id_estado`, `nombre`, `estado`) VALUES
(1, 'Activa', 1),
(2, 'Vencida', 1),
(3, 'Suspendida', 1),
(4, 'Cancelada', 1),
(5, 'Pendiente', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `evaluaciones`
--

CREATE TABLE `evaluaciones` (
  `id_evaluacion` bigint(20) UNSIGNED NOT NULL,
  `id_asignacion` bigint(20) UNSIGNED NOT NULL,
  `id_periodo` bigint(20) UNSIGNED NOT NULL,
  `id_tipo_nota` bigint(20) UNSIGNED NOT NULL,
  `id_tipo_evaluacion` bigint(20) UNSIGNED NOT NULL,
  `tema_especifico` varchar(150) NOT NULL,
  `fecha_evaluacion` date NOT NULL,
  `estado` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `grados`
--

CREATE TABLE `grados` (
  `id_grado` bigint(20) UNSIGNED NOT NULL,
  `id_sede` bigint(20) UNSIGNED NOT NULL,
  `nombre_grado` varchar(50) NOT NULL,
  `estado` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `horarios`
--

CREATE TABLE `horarios` (
  `id_horario` bigint(20) UNSIGNED NOT NULL,
  `id_asignacion` bigint(20) UNSIGNED NOT NULL,
  `id_aula` bigint(20) UNSIGNED DEFAULT NULL,
  `dia_semana` varchar(255) DEFAULT NULL,
  `hora_inicio` time NOT NULL,
  `hora_fin` time NOT NULL,
  `estado` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `institucion`
--

CREATE TABLE `institucion` (
  `id_institucion` bigint(20) UNSIGNED NOT NULL,
  `nombre` varchar(150) NOT NULL,
  `cod_modular` varchar(10) NOT NULL,
  `tipo_gestion` varchar(50) NOT NULL,
  `resolucion_creacion` varchar(50) DEFAULT NULL,
  `nombre_director` varchar(100) DEFAULT NULL,
  `logo_path` varchar(255) DEFAULT NULL,
  `correo_facturacion` varchar(100) DEFAULT NULL,
  `domicilio_fiscal` varchar(255) DEFAULT NULL,
  `razon_social` varchar(200) DEFAULT NULL,
  `representante_legal` varchar(150) DEFAULT NULL,
  `ruc` varchar(11) DEFAULT NULL,
  `telefono_facturacion` varchar(20) DEFAULT NULL,
  `estado` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `institucion`
--

INSERT INTO `institucion` (`id_institucion`, `nombre`, `cod_modular`, `tipo_gestion`, `resolucion_creacion`, `nombre_director`, `logo_path`, `correo_facturacion`, `domicilio_fiscal`, `razon_social`, `representante_legal`, `ruc`, `telefono_facturacion`, `estado`) VALUES
(30, 'Institución Educativa San Jose del Alto Mayo', '1234568', 'Pública', 'R.G.R. N° 5678-2024-GRE-SANMARTIN', NULL, '/uploads/logos/aab2bf06-8ad9-4a61-8890-f1418a014e5c.jpg', 'sanjose@gmail.com', 'Av. San Pedro 211', 'Institución Educativa San Jose del Alto Mayo', 'Judith Marianella Contreras Bernilla', '20123456781', '911001111', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `limites_sedes_suscripcion`
--

CREATE TABLE `limites_sedes_suscripcion` (
  `id_limite_sede` bigint(20) NOT NULL,
  `estado` int(11) DEFAULT NULL,
  `limite_alumnos_asignado` int(11) NOT NULL,
  `id_sede` bigint(20) NOT NULL,
  `id_suscripcion` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `limites_sedes_suscripcion`
--

INSERT INTO `limites_sedes_suscripcion` (`id_limite_sede`, `estado`, `limite_alumnos_asignado`, `id_sede`, `id_suscripcion`) VALUES
(11, 1, 5, 13, 27);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `malla_curricular`
--

CREATE TABLE `malla_curricular` (
  `id_malla` bigint(20) UNSIGNED NOT NULL,
  `id_anio` bigint(20) UNSIGNED NOT NULL,
  `id_grado` bigint(20) UNSIGNED NOT NULL,
  `id_curso` bigint(20) UNSIGNED NOT NULL,
  `estado` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `matriculas`
--

CREATE TABLE `matriculas` (
  `id_matricula` bigint(20) UNSIGNED NOT NULL,
  `id_alumno` bigint(20) UNSIGNED NOT NULL,
  `id_seccion` bigint(20) UNSIGNED NOT NULL,
  `id_anio` bigint(20) UNSIGNED NOT NULL,
  `codigo_matricula` varchar(30) DEFAULT NULL,
  `fecha_matricula` datetime DEFAULT current_timestamp(),
  `situacion_academica_previa` enum('Promovido','Repitente','Ingresante') NOT NULL,
  `estado_matricula` enum('Activa','Retirada','Trasladado_Saliente') NOT NULL,
  `observaciones_matricula` text DEFAULT NULL,
  `fecha_retiro` date DEFAULT NULL,
  `motivo_retiro` text DEFAULT NULL,
  `colegio_destino` varchar(150) DEFAULT NULL,
  `estado` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `metodos_pago`
--

CREATE TABLE `metodos_pago` (
  `id_metodo` bigint(20) UNSIGNED NOT NULL,
  `nombre_metodo` varchar(50) NOT NULL,
  `requiere_comprobante` int(11) DEFAULT NULL,
  `estado` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `metodos_pago`
--

INSERT INTO `metodos_pago` (`id_metodo`, `nombre_metodo`, `requiere_comprobante`, `estado`) VALUES
(1, 'Efectivo', 0, 1),
(2, 'Yape', 1, 1),
(3, 'Plin', 1, 1),
(4, 'Transferencia Bancaria', 1, 1),
(5, 'Tarjeta de Crédito / Débito', 1, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `modulos`
--

CREATE TABLE `modulos` (
  `id_modulo` bigint(20) UNSIGNED NOT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `icono` varchar(255) DEFAULT NULL,
  `orden` int(11) DEFAULT 0,
  `url_base` varchar(255) DEFAULT NULL,
  `estado` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `modulos`
--

INSERT INTO `modulos` (`id_modulo`, `nombre`, `descripcion`, `icono`, `orden`, `url_base`, `estado`) VALUES
(1, 'DASHBOARD', 'Panel principal del sistema', 'BarChart3', 0, '/dashboard', 1),
(2, 'CONFIGURACIÓN', 'Ajustes y configuración de la institución', 'Settings', 1, '/configuracion', 1),
(3, 'INFRAESTRUCTURA', 'Gestión de aulas, grados, secciones', 'Building2', 2, '/infraestructura', 1),
(4, 'GESTIÓN ACADÉMICA', 'Cursos, áreas, horarios y malla curricular', 'BookOpen', 3, '/gestioacademica', 1),
(5, 'ALUMNOS', 'Gestión completa de estudiantes', 'Users', 4, '/alumnos', 1),
(6, 'MATRÍCULAS', 'Proceso de inscripción y matrícula', 'FileText', 5, '/matriculas', 1),
(7, 'EVALUACIONES Y NOTAS', 'Registro de calificaciones y evaluaciones', 'CheckCircle', 6, '/evaluacionesynotas', 1),
(8, 'PAGOS Y PENSIONES', 'Gestión de ingresos y pensiones', 'DollarSign', 7, '/pagosypensiones', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pagos_caja`
--

CREATE TABLE `pagos_caja` (
  `id_pago` bigint(20) UNSIGNED NOT NULL,
  `id_metodo` bigint(20) UNSIGNED NOT NULL,
  `id_usuario` bigint(20) UNSIGNED NOT NULL,
  `fecha_pago` datetime DEFAULT current_timestamp(),
  `monto_total_pagado` decimal(38,2) NOT NULL,
  `comprobante_numero` varchar(50) DEFAULT NULL,
  `observacion_pago` text DEFAULT NULL,
  `estado` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pagos_suscripcion`
--

CREATE TABLE `pagos_suscripcion` (
  `id_pago` bigint(20) NOT NULL,
  `banco` varchar(100) DEFAULT NULL,
  `comprobante_url` varchar(500) DEFAULT NULL,
  `estado` int(11) NOT NULL,
  `estado_verificacion` enum('PENDIENTE','RECHAZADO','VERIFICADO') NOT NULL,
  `fecha_pago` date NOT NULL,
  `fecha_registro` datetime(6) NOT NULL,
  `fecha_verificacion` datetime DEFAULT NULL,
  `monto_pagado` decimal(10,2) NOT NULL,
  `numero_operacion` varchar(100) DEFAULT NULL,
  `numero_pago` varchar(20) DEFAULT NULL,
  `observaciones` text DEFAULT NULL,
  `id_metodo_pago` bigint(20) DEFAULT NULL,
  `id_suscripcion` bigint(20) NOT NULL,
  `verificado_por` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `pagos_suscripcion`
--

INSERT INTO `pagos_suscripcion` (`id_pago`, `banco`, `comprobante_url`, `estado`, `estado_verificacion`, `fecha_pago`, `fecha_registro`, `fecha_verificacion`, `monto_pagado`, `numero_operacion`, `numero_pago`, `observaciones`, `id_metodo_pago`, `id_suscripcion`, `verificado_por`) VALUES
(44, NULL, '/uploads/comprobantes/suscripciones/381d14f1-a2ab-4994-9c1b-e788a1824594.jpg', 0, 'PENDIENTE', '2026-01-01', '2026-03-06 06:28:47.000000', NULL, 120.00, '000001', 'PAGO-00044', 'Pago programado automáticamente - Período 1 de 12', 2, 27, NULL),
(45, NULL, '/uploads/comprobantes/suscripciones/682cc8a1-38c0-412c-8793-62075cdacd4d.jpg', 0, 'PENDIENTE', '2026-02-01', '2026-03-06 06:28:47.000000', NULL, 120.00, '000002', 'PAGO-00045', 'Pago programado automáticamente - Período 2 de 12', 3, 27, NULL),
(46, NULL, '/uploads/comprobantes/suscripciones/ea18fff0-953d-4b1f-a49c-4250295db2c1.jpeg', 1, 'VERIFICADO', '2026-03-01', '2026-03-06 06:28:47.000000', '2026-03-06 06:32:15', 120.00, '000003', 'PAGO-00046', 'Pago programado automáticamente - Período 3 de 12', 1, 27, 1),
(47, NULL, NULL, 0, 'PENDIENTE', '2026-04-01', '2026-03-06 06:28:47.000000', NULL, 120.00, NULL, 'PAGO-00047', 'Pago programado automáticamente - Período 4 de 12', NULL, 27, NULL),
(48, NULL, NULL, 0, 'PENDIENTE', '2026-05-01', '2026-03-06 06:28:47.000000', NULL, 120.00, NULL, 'PAGO-00048', 'Pago programado automáticamente - Período 5 de 12', NULL, 27, NULL),
(49, NULL, NULL, 0, 'PENDIENTE', '2026-06-01', '2026-03-06 06:28:47.000000', NULL, 120.00, NULL, 'PAGO-00049', 'Pago programado automáticamente - Período 6 de 12', NULL, 27, NULL),
(50, NULL, NULL, 0, 'PENDIENTE', '2026-07-01', '2026-03-06 06:28:47.000000', NULL, 120.00, NULL, 'PAGO-00050', 'Pago programado automáticamente - Período 7 de 12', NULL, 27, NULL),
(51, NULL, NULL, 0, 'PENDIENTE', '2026-08-01', '2026-03-06 06:28:47.000000', NULL, 120.00, NULL, 'PAGO-00051', 'Pago programado automáticamente - Período 8 de 12', NULL, 27, NULL),
(52, NULL, NULL, 0, 'PENDIENTE', '2026-09-01', '2026-03-06 06:28:47.000000', NULL, 120.00, NULL, 'PAGO-00052', 'Pago programado automáticamente - Período 9 de 12', NULL, 27, NULL),
(53, NULL, NULL, 0, 'PENDIENTE', '2026-10-01', '2026-03-06 06:28:47.000000', NULL, 120.00, NULL, 'PAGO-00053', 'Pago programado automáticamente - Período 10 de 12', NULL, 27, NULL),
(54, NULL, NULL, 0, 'PENDIENTE', '2026-11-01', '2026-03-06 06:28:47.000000', NULL, 120.00, NULL, 'PAGO-00054', 'Pago programado automáticamente - Período 11 de 12', NULL, 27, NULL),
(55, NULL, NULL, 0, 'PENDIENTE', '2026-12-01', '2026-03-06 06:28:47.000000', NULL, 120.00, NULL, 'PAGO-00055', 'Pago programado automáticamente - Período 12 de 12', NULL, 27, NULL),
(56, NULL, NULL, 1, 'PENDIENTE', '2026-01-01', '2026-03-06 06:34:40.000000', NULL, 120.00, NULL, 'PAGO-00056', 'Pago programado automáticamente - Período 1 de 12', NULL, 27, NULL),
(57, NULL, NULL, 1, 'PENDIENTE', '2026-02-01', '2026-03-06 06:34:40.000000', NULL, 120.00, NULL, 'PAGO-00057', 'Pago programado automáticamente - Período 2 de 12', NULL, 27, NULL),
(58, NULL, NULL, 1, 'PENDIENTE', '2026-03-01', '2026-03-06 06:34:40.000000', NULL, 120.00, NULL, 'PAGO-00058', 'Pago programado automáticamente - Período 3 de 12', NULL, 27, NULL),
(59, NULL, NULL, 1, 'PENDIENTE', '2026-04-01', '2026-03-06 06:34:40.000000', NULL, 120.00, NULL, 'PAGO-00059', 'Pago programado automáticamente - Período 4 de 12', NULL, 27, NULL),
(60, NULL, NULL, 1, 'PENDIENTE', '2026-05-01', '2026-03-06 06:34:40.000000', NULL, 120.00, NULL, 'PAGO-00060', 'Pago programado automáticamente - Período 5 de 12', NULL, 27, NULL),
(61, NULL, NULL, 1, 'PENDIENTE', '2026-06-01', '2026-03-06 06:34:40.000000', NULL, 120.00, NULL, 'PAGO-00061', 'Pago programado automáticamente - Período 6 de 12', NULL, 27, NULL),
(62, NULL, NULL, 1, 'PENDIENTE', '2026-07-01', '2026-03-06 06:34:40.000000', NULL, 120.00, NULL, 'PAGO-00062', 'Pago programado automáticamente - Período 7 de 12', NULL, 27, NULL),
(63, NULL, NULL, 1, 'PENDIENTE', '2026-08-01', '2026-03-06 06:34:40.000000', NULL, 120.00, NULL, 'PAGO-00063', 'Pago programado automáticamente - Período 8 de 12', NULL, 27, NULL),
(64, NULL, NULL, 1, 'PENDIENTE', '2026-09-01', '2026-03-06 06:34:40.000000', NULL, 120.00, NULL, 'PAGO-00064', 'Pago programado automáticamente - Período 9 de 12', NULL, 27, NULL),
(65, NULL, NULL, 1, 'PENDIENTE', '2026-10-01', '2026-03-06 06:34:40.000000', NULL, 120.00, NULL, 'PAGO-00065', 'Pago programado automáticamente - Período 10 de 12', NULL, 27, NULL),
(66, NULL, NULL, 1, 'PENDIENTE', '2026-11-01', '2026-03-06 06:34:40.000000', NULL, 120.00, NULL, 'PAGO-00066', 'Pago programado automáticamente - Período 11 de 12', NULL, 27, NULL),
(67, NULL, NULL, 1, 'PENDIENTE', '2026-12-01', '2026-03-06 06:34:40.000000', NULL, 120.00, NULL, 'PAGO-00067', 'Pago programado automáticamente - Período 12 de 12', NULL, 27, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pago_detalle`
--

CREATE TABLE `pago_detalle` (
  `id_pago_detalle` bigint(20) UNSIGNED NOT NULL,
  `id_pago` bigint(20) UNSIGNED NOT NULL,
  `id_deuda` bigint(20) UNSIGNED NOT NULL,
  `monto_aplicado` decimal(38,2) NOT NULL,
  `estado` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `perfil_docente`
--

CREATE TABLE `perfil_docente` (
  `id_docente` bigint(20) UNSIGNED NOT NULL,
  `id_usuario` bigint(20) UNSIGNED NOT NULL,
  `id_especialidad` bigint(20) UNSIGNED NOT NULL,
  `grado_academico` varchar(255) DEFAULT NULL,
  `fecha_contratacion` date NOT NULL,
  `estado_laboral` varchar(255) DEFAULT NULL,
  `estado` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `periodos`
--

CREATE TABLE `periodos` (
  `id_periodo` bigint(20) UNSIGNED NOT NULL,
  `id_anio` bigint(20) UNSIGNED NOT NULL,
  `nombre_periodo` varchar(50) NOT NULL,
  `fecha_inicio` date NOT NULL,
  `fecha_fin` date NOT NULL,
  `estado` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `permisos`
--

CREATE TABLE `permisos` (
  `id_permiso` bigint(20) UNSIGNED NOT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  `codigo` varchar(255) DEFAULT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `id_modulo` bigint(20) UNSIGNED DEFAULT NULL,
  `estado` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `planes`
--

CREATE TABLE `planes` (
  `id_plan` bigint(20) UNSIGNED NOT NULL,
  `nombre_plan` varchar(255) DEFAULT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `precio_mensual` double DEFAULT NULL,
  `precio_anual` double DEFAULT NULL,
  `limite_alumnos` int(11) DEFAULT NULL,
  `limite_sedes` int(11) DEFAULT 1,
  `estado` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `planes`
--

INSERT INTO `planes` (`id_plan`, `nombre_plan`, `descripcion`, `precio_mensual`, `precio_anual`, `limite_alumnos`, `limite_sedes`, `estado`) VALUES
(1, 'Plan Emprendedor (Primaria Pequeña)', '', 150, 1500, 600, 1, 1),
(2, 'Plan Profesional (Primaria Multisede)', '', 350, 3500, 2400, 3, 1),
(3, 'Plan Personalizado (A Medida)', NULL, 0, 0, NULL, NULL, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `promedios_periodo`
--

CREATE TABLE `promedios_periodo` (
  `id_promedio` bigint(20) UNSIGNED NOT NULL,
  `id_asignacion` bigint(20) UNSIGNED NOT NULL,
  `id_matricula` bigint(20) UNSIGNED NOT NULL,
  `id_periodo` bigint(20) UNSIGNED NOT NULL,
  `nota_final_area` varchar(10) NOT NULL,
  `comentario_libreta` varchar(255) DEFAULT NULL,
  `estado_cierre` enum('Abierto','Cerrado_Enviado') DEFAULT NULL,
  `estado` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `registros`
--

CREATE TABLE `registros` (
  `idregistro` int(11) NOT NULL,
  `nombres` varchar(255) NOT NULL,
  `apellidos` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `cliente_id` varchar(255) NOT NULL,
  `llave_secreta` varchar(255) NOT NULL,
  `access_token` varchar(255) NOT NULL,
  `estado` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `registros`
--

INSERT INTO `registros` (`idregistro`, `nombres`, `apellidos`, `email`, `cliente_id`, `llave_secreta`, `access_token`, `estado`) VALUES
(53, 'Bizantino', 'Herzen', 'admin@alexatech.com', '922c259c27b31c98106400f0d8b0a5cfed4763c1b7f5a3668f10e707bbbfef64', '$2a$10$V..nXDLy1OTqMeR5bchOe.tebJzaPgfOMCvxzgLaZY/eLZGFNS4va', 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI5MjJjMjU5YzI3YjMxYzk4MTA2NDAwZjBkOGIwYTVjZmVkNDc2M2MxYjdmNWEzNjY4ZjEwZTcwN2JiYmZlZjY0IiwiaWF0IjoxNzcyNTk1NzkwLCJleHAiOjQ5MjYxOTU3OTB9.n-7Lsq_SpeSJzQVEv7LFxz3H-R7xFDmI-2Z6BuVnzVc', 1),
(54, 'Luis Alberto', 'Yajahuanca Fernandez', 'luisalbertoyajahuancafernandez@gmail.com', 'd74efe61db9f9e134ed4aeae861a450cc3d1cf7e3b3da95d45d23d14149c04ae', '$2a$10$n1YnI3t1RywCm7XKiNS0gevk4gwhyg1HAYo3rOrtvqRPFR7Q99dni', 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJkNzRlZmU2MWRiOWY5ZTEzNGVkNGFlYWU4NjFhNDUwY2MzZDFjZjdlM2IzZGE5NWQ0NWQyM2QxNDE0OWMwNGFlIiwiaWF0IjoxNzcyNjA1OTY2LCJleHAiOjQ5MjYyMDU5NjZ9.5MjibOO-kVZl4-8NibwGrmauZS2sD3R5gU9GmnyqPw4', 1),
(55, 'Luis Alberto', 'Yajahuanca Fernandez', 'luisalbertoyajahuancafernandez@gmail.com', 'd74efe61db9f9e134ed4aeae861a450cc3d1cf7e3b3da95d45d23d14149c04ae', '$2a$10$K1w/gjEnpnQeMQtLDQzV/e2i9dF94o78Q2AHCKgYoD/qKZDGXte/e', '', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `requisitos_documentos`
--

CREATE TABLE `requisitos_documentos` (
  `id_requisito` bigint(20) UNSIGNED NOT NULL,
  `nombre_documento` varchar(100) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `es_obligatorio` tinyint(1) DEFAULT 0,
  `estado` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `requisitos_documentos`
--

INSERT INTO `requisitos_documentos` (`id_requisito`, `nombre_documento`, `descripcion`, `es_obligatorio`, `estado`) VALUES
(1, 'DNI del Alumno', 'Copia legible de ambas caras (DNI azul o electrónico)', 1, 1),
(2, 'DNI del Apoderado', 'Copia legible del padre, madre o tutor legal', 1, 1),
(3, 'Certificado de Estudios', 'Documento original del año de procedencia', 1, 1),
(4, 'Constancia de Matrícula SIAGIE OFICIAL', 'Documento oficial generado por el portal SIAGIE', 0, 1),
(5, 'Ficha Médica / Certificado de Salud', 'Estado de salud actual del estudiante', 0, 1),
(6, 'Fotos Tamaño Carné', '4 fotos con fondo blanco', 0, 1),
(7, 'Constancia de BECADO SUNEDU OFICIAL', 'Documento oficial generado por SUNEDU', 0, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

CREATE TABLE `roles` (
  `id_rol` bigint(20) UNSIGNED NOT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  `estado` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `roles`
--

INSERT INTO `roles` (`id_rol`, `nombre`, `estado`) VALUES
(1, 'ADMINISTRADOR', 1),
(2, 'PROFESOR', 1),
(3, 'SECRETARIA', 1),
(10, 'COORDINADOR', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rol_modulo`
--

CREATE TABLE `rol_modulo` (
  `id_rol_modulo` bigint(20) UNSIGNED NOT NULL,
  `id_rol` bigint(20) UNSIGNED NOT NULL,
  `id_modulo` bigint(20) UNSIGNED NOT NULL,
  `estado` int(11) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `rol_modulo`
--

INSERT INTO `rol_modulo` (`id_rol_modulo`, `id_rol`, `id_modulo`, `estado`) VALUES
(12, 3, 1, 1),
(13, 3, 8, 1),
(14, 10, 3, 1),
(32, 1, 1, 1),
(33, 1, 2, 1),
(34, 1, 3, 1),
(35, 1, 4, 1),
(36, 1, 5, 1),
(37, 1, 6, 1),
(38, 1, 7, 1),
(39, 1, 8, 1),
(40, 2, 4, 1),
(41, 2, 7, 1),
(42, 2, 6, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rol_modulo_permiso`
--

CREATE TABLE `rol_modulo_permiso` (
  `id_rmp` bigint(20) NOT NULL,
  `estado` int(11) DEFAULT NULL,
  `id_modulo` bigint(20) DEFAULT NULL,
  `id_permiso` bigint(20) DEFAULT NULL,
  `id_rol` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `secciones`
--

CREATE TABLE `secciones` (
  `id_seccion` bigint(20) UNSIGNED NOT NULL,
  `id_grado` bigint(20) UNSIGNED NOT NULL,
  `id_sede` bigint(20) UNSIGNED NOT NULL,
  `nombre_seccion` varchar(10) NOT NULL,
  `vacantes` int(11) DEFAULT NULL,
  `estado` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sedes`
--

CREATE TABLE `sedes` (
  `id_sede` bigint(20) UNSIGNED NOT NULL,
  `id_institucion` bigint(20) UNSIGNED NOT NULL,
  `nombre_sede` varchar(100) NOT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `distrito` varchar(100) DEFAULT NULL,
  `provincia` varchar(100) DEFAULT NULL,
  `departamento` varchar(100) DEFAULT NULL,
  `ugel` varchar(100) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `correo_institucional` varchar(100) DEFAULT NULL,
  `estado` int(11) DEFAULT NULL,
  `codigo_establecimiento` varchar(4) DEFAULT NULL,
  `es_sede_principal` bit(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `sedes`
--

INSERT INTO `sedes` (`id_sede`, `id_institucion`, `nombre_sede`, `direccion`, `distrito`, `provincia`, `departamento`, `ugel`, `telefono`, `correo_institucional`, `estado`, `codigo_establecimiento`, `es_sede_principal`) VALUES
(13, 30, 'Sede Judith', 'Jr. San Pedrito 231', 'Tarapoto', 'Tarapoto', 'San Martin', 'UGEL 21', '950345123', 'sedejudith@gmail.com', 1, '0000', b'1'),
(14, 30, 'Sede Cristina', 'Jr. 9 de abril 331', 'Tarapoto', 'Tarapoto', 'San Martin', 'UGEL TARAPOTO', '960562285', 'cris@gmail.com', 1, '0000', b'0');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `super_admins`
--

CREATE TABLE `super_admins` (
  `id_admin` bigint(20) UNSIGNED NOT NULL,
  `nombres` varchar(255) DEFAULT NULL,
  `apellidos` varchar(255) DEFAULT NULL,
  `correo` varchar(255) DEFAULT NULL,
  `usuario` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `rol_plataforma` varchar(255) DEFAULT NULL,
  `estado` int(11) DEFAULT NULL,
  `foto_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `super_admins`
--

INSERT INTO `super_admins` (`id_admin`, `nombres`, `apellidos`, `correo`, `usuario`, `password`, `rol_plataforma`, `estado`, `foto_url`) VALUES
(1, 'Judith Mari', 'Contreras Bernilla', 'judithmarianella@unsm.edu.pe', 'judithmar', '$2a$10$P/QT5Bq.B1.iGh3TlZU8JefkC46nTt5huOQ9Kro84e2BTxNaSMDAO', 'SUPER_ADMIN', 1, '/uploads/perfiles/f16fb018-ed02-47a1-bd3c-ebe8bf7dc223.jpeg'),
(2, 'Cristina', 'Berru Lozano', 'cristina.berru2909@gmail.com', 'Oicapse', '$2a$10$/hDSfEN2G.wpYVot7Y2Oe.R21jVVIKGxYOf8vISeEF3crYymg0A5W', 'SUPER_ADMIN', 1, '/uploads/perfiles/764bd668-7b02-4c6a-9a6c-9bd51ccd70b6.jpg'),
(3, 'Martin', 'Muñoz', 'Martin@gmail.com', 'Marki', '$2a$10$CUI4zR5fe9fKillz97DHB.1SxCosglMacAuA/JYRcfRzl2kRoucw2', 'ADMIN', 1, NULL),
(4, 'Nayelli Yuley ', 'Arevalo Romero', 'nay@gmail.com', 'Nay', '$2a$10$TGpoFgm5GQ6PzNerFX.bD.WYzBSR3Nx16.IbqIe3hhsJMMg.OEkwq', 'ADMIN', 1, NULL),
(5, 'Luis Alberto', 'Yajahuanca Fernandez', 'luis@gmail.com', 'Luis', '$2a$10$ArIDogqZTOWL6.qwGtGeru3qlRkupn4ay/HKQUqJhutMiZXYO87WW', 'ADMIN', 1, NULL),
(6, 'Herzen Layan', 'Rojas Perez', 'herzen@gmail.com', 'Biza', '$2a$10$j/7hzILJrXp1HDMrMKmniucJ8Hi2TJqBOzMrSAzC2Veyfw5dDn2ma', 'ADMIN', 1, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `suscripciones`
--

CREATE TABLE `suscripciones` (
  `id_suscripcion` bigint(20) UNSIGNED NOT NULL,
  `id_institucion` bigint(20) UNSIGNED NOT NULL,
  `id_plan` bigint(20) UNSIGNED NOT NULL,
  `id_ciclo` bigint(20) UNSIGNED NOT NULL,
  `id_estado` bigint(20) UNSIGNED NOT NULL,
  `limite_alumnos_contratado` int(11) NOT NULL,
  `limite_sedes_contratadas` int(11) NOT NULL,
  `precio_acordado` decimal(38,2) DEFAULT NULL,
  `fecha_inicio` date NOT NULL,
  `fecha_vencimiento` date NOT NULL,
  `estado` int(11) DEFAULT NULL,
  `tipo_distribucion_limite` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `suscripciones`
--

INSERT INTO `suscripciones` (`id_suscripcion`, `id_institucion`, `id_plan`, `id_ciclo`, `id_estado`, `limite_alumnos_contratado`, `limite_sedes_contratadas`, `precio_acordado`, `fecha_inicio`, `fecha_vencimiento`, `estado`, `tipo_distribucion_limite`) VALUES
(27, 30, 3, 1, 1, 10, 2, 120.00, '2026-01-01', '2027-01-01', 1, 'EQUITATIVA');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipos_evaluacion`
--

CREATE TABLE `tipos_evaluacion` (
  `id_tipo_evaluacion` bigint(20) UNSIGNED NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `estado` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tipos_evaluacion`
--

INSERT INTO `tipos_evaluacion` (`id_tipo_evaluacion`, `nombre`, `estado`) VALUES
(1, 'Examen Bimestral', 1),
(2, 'Examen Mensual', 1),
(3, 'Revisión de Cuaderno', 1),
(4, 'Tarea para la casa, laboratorio', 1),
(5, 'Exposición / Proyecto', 1),
(6, 'Tabla de multipplicacion, examen oral', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipos_nota`
--

CREATE TABLE `tipos_nota` (
  `id_tipo_nota` bigint(20) UNSIGNED NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `formato` enum('NUMERO','LETRA','SIMBOLO') DEFAULT NULL,
  `valor_minimo` varchar(10) DEFAULT NULL,
  `valor_maximo` varchar(10) DEFAULT NULL,
  `estado` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tipos_nota`
--

INSERT INTO `tipos_nota` (`id_tipo_nota`, `nombre`, `formato`, `valor_minimo`, `valor_maximo`, `estado`) VALUES
(1, 'Vigesimal Peruano', 'NUMERO', '0', '20', 1),
(2, 'Literal MINEDU', 'LETRA', 'C', 'AD', 1),
(3, 'Estrellas Infantiles', 'SIMBOLO', '1', '5', 1),
(4, 'Lunas', 'SIMBOLO', '1', '5', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipo_documentos`
--

CREATE TABLE `tipo_documentos` (
  `id_documento` bigint(20) UNSIGNED NOT NULL,
  `abreviatura` varchar(255) DEFAULT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `longitud_maxima` int(11) NOT NULL,
  `es_longitud_exacta` int(11) DEFAULT NULL,
  `estado` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tipo_documentos`
--

INSERT INTO `tipo_documentos` (`id_documento`, `abreviatura`, `descripcion`, `longitud_maxima`, `es_longitud_exacta`, `estado`) VALUES
(1, 'DNI', 'Documento de indentidad', 8, 1, 1),
(2, 'CE', 'Carné Extranjería', 9, 1, 1),
(3, 'PAS', 'Pasaporte', 15, 0, 1),
(4, 'DNIE', 'Documento de indentidad Electronica', 9, 1, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id_usuario` bigint(20) UNSIGNED NOT NULL,
  `id_sede` bigint(20) UNSIGNED NOT NULL,
  `id_rol` bigint(20) UNSIGNED NOT NULL,
  `id_tipo_doc` bigint(20) UNSIGNED NOT NULL,
  `numero_documento` varchar(255) DEFAULT NULL,
  `apellidos` varchar(255) DEFAULT NULL,
  `nombres` varchar(255) DEFAULT NULL,
  `correo` varchar(255) DEFAULT NULL,
  `usuario` varchar(255) DEFAULT NULL,
  `contraseña` varchar(255) NOT NULL,
  `foto_perfil` varchar(255) DEFAULT NULL,
  `estado` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id_usuario`, `id_sede`, `id_rol`, `id_tipo_doc`, `numero_documento`, `apellidos`, `nombres`, `correo`, `usuario`, `contraseña`, `foto_perfil`, `estado`) VALUES
(28, 13, 1, 1, '77219351', 'CONTRERAS BERNILLA', 'JUDITH MARIANELLA', 'judithmarianella@unsm.edu.pe', 'Mari', '$2a$10$TiE8MW0bA.myKhCCjopnBuqigDO4PKGYIuI.damjZfQYHJYrhHNeK', '', 1),
(29, 14, 1, 1, '74654276', 'BERRU LOZANO', 'CRISTINA', 'cristina.berru2909@gmail.com', 'Cristina', '$2a$10$AKuKD0girXyJm1JNzspXceixP4qgnfnIAsK7fj3faq6QulVXmWF86', '', 1),
(30, 13, 2, 1, '85632147', 'Contreras', 'Frank', 'frank@gmail.com', 'frank', '$2a$10$c50M5o28UIOZNPXiwhmb/.wkedKcvrtixcz15SE8QG4MHXeEhRO3y', NULL, 1);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `alumnos`
--
ALTER TABLE `alumnos`
  ADD PRIMARY KEY (`id_alumno`),
  ADD UNIQUE KEY `uq_documento_alumno` (`id_sede`,`id_tipo_doc`,`numero_documento`),
  ADD KEY `fk_alumno_tipodoc` (`id_tipo_doc`);

--
-- Indices de la tabla `alumno_apoderado`
--
ALTER TABLE `alumno_apoderado`
  ADD PRIMARY KEY (`id_alum_apod`),
  ADD UNIQUE KEY `uq_alumno_apoderado` (`id_alumno`,`id_apoderado`),
  ADD KEY `fk_rel_apoderado` (`id_apoderado`);

--
-- Indices de la tabla `anio_escolar`
--
ALTER TABLE `anio_escolar`
  ADD PRIMARY KEY (`id_anio_escolar`),
  ADD KEY `fk_anio_sede_rel` (`id_sede`);

--
-- Indices de la tabla `apoderados`
--
ALTER TABLE `apoderados`
  ADD PRIMARY KEY (`id_apoderado`),
  ADD UNIQUE KEY `uq_documento_apoderado` (`id_sede`,`id_tipo_doc`,`numero_documento`),
  ADD KEY `fk_apoderado_tipodoc` (`id_tipo_doc`);

--
-- Indices de la tabla `areas`
--
ALTER TABLE `areas`
  ADD PRIMARY KEY (`id_area`),
  ADD KEY `fk_area_sede` (`id_sede`);

--
-- Indices de la tabla `asignacion_docente`
--
ALTER TABLE `asignacion_docente`
  ADD PRIMARY KEY (`id_asignacion`),
  ADD UNIQUE KEY `uq_asignacion_unica` (`id_seccion`,`id_curso`,`id_anio`),
  ADD KEY `fk_asig_docente` (`id_docente`),
  ADD KEY `fk_asig_curso` (`id_curso`),
  ADD KEY `fk_asig_anio` (`id_anio`);

--
-- Indices de la tabla `asistencias`
--
ALTER TABLE `asistencias`
  ADD PRIMARY KEY (`id_asistencia`),
  ADD UNIQUE KEY `uq_asistencia_diaria` (`id_asignacion`,`id_matricula`,`fecha`),
  ADD KEY `fk_asis_matricula` (`id_matricula`);

--
-- Indices de la tabla `aulas`
--
ALTER TABLE `aulas`
  ADD PRIMARY KEY (`id_aula`),
  ADD KEY `fk_aula_sede` (`id_sede`);

--
-- Indices de la tabla `calificaciones`
--
ALTER TABLE `calificaciones`
  ADD PRIMARY KEY (`id_calificacion`),
  ADD UNIQUE KEY `uq_calificacion_alumno` (`id_evaluacion`,`id_matricula`),
  ADD KEY `fk_calif_matricula` (`id_matricula`);

--
-- Indices de la tabla `ciclos_facturacion`
--
ALTER TABLE `ciclos_facturacion`
  ADD PRIMARY KEY (`id_ciclo`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- Indices de la tabla `conceptos_pago`
--
ALTER TABLE `conceptos_pago`
  ADD PRIMARY KEY (`id_concepto`),
  ADD KEY `fk_concepto_inst` (`id_institucion`),
  ADD KEY `fk_concepto_grado` (`id_grado`);

--
-- Indices de la tabla `cursos`
--
ALTER TABLE `cursos`
  ADD PRIMARY KEY (`id_curso`),
  ADD KEY `fk_curso_area` (`id_area`);

--
-- Indices de la tabla `deudas_alumno`
--
ALTER TABLE `deudas_alumno`
  ADD PRIMARY KEY (`id_deuda`),
  ADD KEY `fk_deuda_matricula` (`id_matricula`),
  ADD KEY `fk_deuda_concepto` (`id_concepto`);

--
-- Indices de la tabla `documentos_alumno`
--
ALTER TABLE `documentos_alumno`
  ADD PRIMARY KEY (`id_doc_alumno`),
  ADD KEY `fk_doc_alumno` (`id_alumno`),
  ADD KEY `fk_doc_requisito` (`id_requisito`);

--
-- Indices de la tabla `especialidades`
--
ALTER TABLE `especialidades`
  ADD PRIMARY KEY (`id_especialidad`),
  ADD UNIQUE KEY `nombre_especialidad` (`nombre_especialidad`);

--
-- Indices de la tabla `estados_suscripcion`
--
ALTER TABLE `estados_suscripcion`
  ADD PRIMARY KEY (`id_estado`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- Indices de la tabla `evaluaciones`
--
ALTER TABLE `evaluaciones`
  ADD PRIMARY KEY (`id_evaluacion`),
  ADD KEY `fk_eval_asignacion` (`id_asignacion`),
  ADD KEY `fk_eval_periodo` (`id_periodo`),
  ADD KEY `fk_eval_tiponota` (`id_tipo_nota`),
  ADD KEY `fk_eval_tipoeval` (`id_tipo_evaluacion`);

--
-- Indices de la tabla `grados`
--
ALTER TABLE `grados`
  ADD PRIMARY KEY (`id_grado`),
  ADD KEY `fk_grado_sede` (`id_sede`);

--
-- Indices de la tabla `horarios`
--
ALTER TABLE `horarios`
  ADD PRIMARY KEY (`id_horario`),
  ADD KEY `fk_horario_asignacion` (`id_asignacion`),
  ADD KEY `fk_horario_aula` (`id_aula`);

--
-- Indices de la tabla `institucion`
--
ALTER TABLE `institucion`
  ADD PRIMARY KEY (`id_institucion`),
  ADD UNIQUE KEY `cod_modular` (`cod_modular`),
  ADD UNIQUE KEY `UK7hvosqjv2w66jh7eoema9l53p` (`ruc`);

--
-- Indices de la tabla `limites_sedes_suscripcion`
--
ALTER TABLE `limites_sedes_suscripcion`
  ADD PRIMARY KEY (`id_limite_sede`);

--
-- Indices de la tabla `malla_curricular`
--
ALTER TABLE `malla_curricular`
  ADD PRIMARY KEY (`id_malla`),
  ADD KEY `fk_malla_anio` (`id_anio`),
  ADD KEY `fk_malla_grado` (`id_grado`),
  ADD KEY `fk_malla_curso` (`id_curso`);

--
-- Indices de la tabla `matriculas`
--
ALTER TABLE `matriculas`
  ADD PRIMARY KEY (`id_matricula`),
  ADD UNIQUE KEY `uq_matricula_unica` (`id_alumno`,`id_anio`),
  ADD KEY `fk_mat_seccion` (`id_seccion`),
  ADD KEY `fk_mat_anio` (`id_anio`);

--
-- Indices de la tabla `metodos_pago`
--
ALTER TABLE `metodos_pago`
  ADD PRIMARY KEY (`id_metodo`),
  ADD UNIQUE KEY `nombre_metodo` (`nombre_metodo`);

--
-- Indices de la tabla `modulos`
--
ALTER TABLE `modulos`
  ADD PRIMARY KEY (`id_modulo`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- Indices de la tabla `pagos_caja`
--
ALTER TABLE `pagos_caja`
  ADD PRIMARY KEY (`id_pago`),
  ADD KEY `fk_pago_caja_metodo` (`id_metodo`),
  ADD KEY `fk_pago_caja_usuario` (`id_usuario`);

--
-- Indices de la tabla `pagos_suscripcion`
--
ALTER TABLE `pagos_suscripcion`
  ADD PRIMARY KEY (`id_pago`),
  ADD UNIQUE KEY `UKl6ra7m0l20rwclg8hnnwx6ruk` (`numero_pago`);

--
-- Indices de la tabla `pago_detalle`
--
ALTER TABLE `pago_detalle`
  ADD PRIMARY KEY (`id_pago_detalle`),
  ADD KEY `fk_detalle_pago` (`id_pago`),
  ADD KEY `fk_detalle_deuda` (`id_deuda`);

--
-- Indices de la tabla `perfil_docente`
--
ALTER TABLE `perfil_docente`
  ADD PRIMARY KEY (`id_docente`),
  ADD UNIQUE KEY `uq_docente_usuario` (`id_usuario`),
  ADD KEY `fk_docente_especialidad` (`id_especialidad`);

--
-- Indices de la tabla `periodos`
--
ALTER TABLE `periodos`
  ADD PRIMARY KEY (`id_periodo`),
  ADD KEY `fk_periodo_anio_rel` (`id_anio`);

--
-- Indices de la tabla `permisos`
--
ALTER TABLE `permisos`
  ADD PRIMARY KEY (`id_permiso`),
  ADD UNIQUE KEY `nombre` (`nombre`),
  ADD UNIQUE KEY `codigo` (`codigo`),
  ADD KEY `id_modulo` (`id_modulo`);

--
-- Indices de la tabla `planes`
--
ALTER TABLE `planes`
  ADD PRIMARY KEY (`id_plan`),
  ADD UNIQUE KEY `nombre_plan` (`nombre_plan`);

--
-- Indices de la tabla `promedios_periodo`
--
ALTER TABLE `promedios_periodo`
  ADD PRIMARY KEY (`id_promedio`),
  ADD UNIQUE KEY `uq_promedio_unico` (`id_asignacion`,`id_matricula`,`id_periodo`),
  ADD KEY `fk_prom_matricula` (`id_matricula`),
  ADD KEY `fk_prom_periodo` (`id_periodo`);

--
-- Indices de la tabla `registros`
--
ALTER TABLE `registros`
  ADD PRIMARY KEY (`idregistro`);

--
-- Indices de la tabla `requisitos_documentos`
--
ALTER TABLE `requisitos_documentos`
  ADD PRIMARY KEY (`id_requisito`);

--
-- Indices de la tabla `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id_rol`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- Indices de la tabla `rol_modulo`
--
ALTER TABLE `rol_modulo`
  ADD PRIMARY KEY (`id_rol_modulo`),
  ADD UNIQUE KEY `uk_rol_modulo` (`id_rol`,`id_modulo`),
  ADD KEY `fk_rol_modulo_rol` (`id_rol`),
  ADD KEY `fk_rol_modulo_modulo` (`id_modulo`);

--
-- Indices de la tabla `rol_modulo_permiso`
--
ALTER TABLE `rol_modulo_permiso`
  ADD PRIMARY KEY (`id_rmp`);

--
-- Indices de la tabla `secciones`
--
ALTER TABLE `secciones`
  ADD PRIMARY KEY (`id_seccion`),
  ADD KEY `fk_seccion_grado` (`id_grado`),
  ADD KEY `fk_seccion_sede` (`id_sede`);

--
-- Indices de la tabla `sedes`
--
ALTER TABLE `sedes`
  ADD PRIMARY KEY (`id_sede`),
  ADD KEY `fk_sede_institucion` (`id_institucion`);

--
-- Indices de la tabla `super_admins`
--
ALTER TABLE `super_admins`
  ADD PRIMARY KEY (`id_admin`),
  ADD UNIQUE KEY `correo` (`correo`),
  ADD UNIQUE KEY `usuario` (`usuario`);

--
-- Indices de la tabla `suscripciones`
--
ALTER TABLE `suscripciones`
  ADD PRIMARY KEY (`id_suscripcion`),
  ADD KEY `fk_suscripcion_institucion` (`id_institucion`),
  ADD KEY `fk_suscripcion_plan` (`id_plan`),
  ADD KEY `fk_suscripcion_ciclo` (`id_ciclo`),
  ADD KEY `fk_suscripcion_estado` (`id_estado`);

--
-- Indices de la tabla `tipos_evaluacion`
--
ALTER TABLE `tipos_evaluacion`
  ADD PRIMARY KEY (`id_tipo_evaluacion`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- Indices de la tabla `tipos_nota`
--
ALTER TABLE `tipos_nota`
  ADD PRIMARY KEY (`id_tipo_nota`);

--
-- Indices de la tabla `tipo_documentos`
--
ALTER TABLE `tipo_documentos`
  ADD PRIMARY KEY (`id_documento`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `correo` (`correo`),
  ADD UNIQUE KEY `usuario` (`usuario`),
  ADD UNIQUE KEY `uq_documento_usuario` (`id_tipo_doc`,`numero_documento`),
  ADD KEY `fk_usuario_sede` (`id_sede`),
  ADD KEY `fk_usuario_rol` (`id_rol`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `alumnos`
--
ALTER TABLE `alumnos`
  MODIFY `id_alumno` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT de la tabla `alumno_apoderado`
--
ALTER TABLE `alumno_apoderado`
  MODIFY `id_alum_apod` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `anio_escolar`
--
ALTER TABLE `anio_escolar`
  MODIFY `id_anio_escolar` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `apoderados`
--
ALTER TABLE `apoderados`
  MODIFY `id_apoderado` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `areas`
--
ALTER TABLE `areas`
  MODIFY `id_area` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `asignacion_docente`
--
ALTER TABLE `asignacion_docente`
  MODIFY `id_asignacion` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `asistencias`
--
ALTER TABLE `asistencias`
  MODIFY `id_asistencia` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `aulas`
--
ALTER TABLE `aulas`
  MODIFY `id_aula` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT de la tabla `calificaciones`
--
ALTER TABLE `calificaciones`
  MODIFY `id_calificacion` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `ciclos_facturacion`
--
ALTER TABLE `ciclos_facturacion`
  MODIFY `id_ciclo` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `conceptos_pago`
--
ALTER TABLE `conceptos_pago`
  MODIFY `id_concepto` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `cursos`
--
ALTER TABLE `cursos`
  MODIFY `id_curso` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `deudas_alumno`
--
ALTER TABLE `deudas_alumno`
  MODIFY `id_deuda` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `documentos_alumno`
--
ALTER TABLE `documentos_alumno`
  MODIFY `id_doc_alumno` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `especialidades`
--
ALTER TABLE `especialidades`
  MODIFY `id_especialidad` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `estados_suscripcion`
--
ALTER TABLE `estados_suscripcion`
  MODIFY `id_estado` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `evaluaciones`
--
ALTER TABLE `evaluaciones`
  MODIFY `id_evaluacion` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `grados`
--
ALTER TABLE `grados`
  MODIFY `id_grado` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT de la tabla `horarios`
--
ALTER TABLE `horarios`
  MODIFY `id_horario` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `institucion`
--
ALTER TABLE `institucion`
  MODIFY `id_institucion` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT de la tabla `limites_sedes_suscripcion`
--
ALTER TABLE `limites_sedes_suscripcion`
  MODIFY `id_limite_sede` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `malla_curricular`
--
ALTER TABLE `malla_curricular`
  MODIFY `id_malla` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `matriculas`
--
ALTER TABLE `matriculas`
  MODIFY `id_matricula` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `metodos_pago`
--
ALTER TABLE `metodos_pago`
  MODIFY `id_metodo` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `modulos`
--
ALTER TABLE `modulos`
  MODIFY `id_modulo` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `pagos_caja`
--
ALTER TABLE `pagos_caja`
  MODIFY `id_pago` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `pagos_suscripcion`
--
ALTER TABLE `pagos_suscripcion`
  MODIFY `id_pago` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=68;

--
-- AUTO_INCREMENT de la tabla `pago_detalle`
--
ALTER TABLE `pago_detalle`
  MODIFY `id_pago_detalle` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `perfil_docente`
--
ALTER TABLE `perfil_docente`
  MODIFY `id_docente` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `periodos`
--
ALTER TABLE `periodos`
  MODIFY `id_periodo` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `permisos`
--
ALTER TABLE `permisos`
  MODIFY `id_permiso` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT de la tabla `planes`
--
ALTER TABLE `planes`
  MODIFY `id_plan` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `promedios_periodo`
--
ALTER TABLE `promedios_periodo`
  MODIFY `id_promedio` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `registros`
--
ALTER TABLE `registros`
  MODIFY `idregistro` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=56;

--
-- AUTO_INCREMENT de la tabla `requisitos_documentos`
--
ALTER TABLE `requisitos_documentos`
  MODIFY `id_requisito` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `roles`
--
ALTER TABLE `roles`
  MODIFY `id_rol` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `rol_modulo`
--
ALTER TABLE `rol_modulo`
  MODIFY `id_rol_modulo` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- AUTO_INCREMENT de la tabla `rol_modulo_permiso`
--
ALTER TABLE `rol_modulo_permiso`
  MODIFY `id_rmp` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `secciones`
--
ALTER TABLE `secciones`
  MODIFY `id_seccion` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `sedes`
--
ALTER TABLE `sedes`
  MODIFY `id_sede` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT de la tabla `super_admins`
--
ALTER TABLE `super_admins`
  MODIFY `id_admin` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `suscripciones`
--
ALTER TABLE `suscripciones`
  MODIFY `id_suscripcion` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT de la tabla `tipos_evaluacion`
--
ALTER TABLE `tipos_evaluacion`
  MODIFY `id_tipo_evaluacion` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `tipos_nota`
--
ALTER TABLE `tipos_nota`
  MODIFY `id_tipo_nota` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `tipo_documentos`
--
ALTER TABLE `tipo_documentos`
  MODIFY `id_documento` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `alumnos`
--
ALTER TABLE `alumnos`
  ADD CONSTRAINT `fk_alumno_sede` FOREIGN KEY (`id_sede`) REFERENCES `sedes` (`id_sede`),
  ADD CONSTRAINT `fk_alumno_tipodoc` FOREIGN KEY (`id_tipo_doc`) REFERENCES `tipo_documentos` (`id_documento`);

--
-- Filtros para la tabla `alumno_apoderado`
--
ALTER TABLE `alumno_apoderado`
  ADD CONSTRAINT `fk_rel_alumno` FOREIGN KEY (`id_alumno`) REFERENCES `alumnos` (`id_alumno`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_rel_apoderado` FOREIGN KEY (`id_apoderado`) REFERENCES `apoderados` (`id_apoderado`) ON DELETE CASCADE;

--
-- Filtros para la tabla `anio_escolar`
--
ALTER TABLE `anio_escolar`
  ADD CONSTRAINT `fk_anio_sede_rel` FOREIGN KEY (`id_sede`) REFERENCES `sedes` (`id_sede`) ON DELETE CASCADE;

--
-- Filtros para la tabla `apoderados`
--
ALTER TABLE `apoderados`
  ADD CONSTRAINT `fk_apoderado_sede` FOREIGN KEY (`id_sede`) REFERENCES `sedes` (`id_sede`),
  ADD CONSTRAINT `fk_apoderado_tipodoc` FOREIGN KEY (`id_tipo_doc`) REFERENCES `tipo_documentos` (`id_documento`);

--
-- Filtros para la tabla `areas`
--
ALTER TABLE `areas`
  ADD CONSTRAINT `fk_area_sede` FOREIGN KEY (`id_sede`) REFERENCES `sedes` (`id_sede`) ON DELETE CASCADE;

--
-- Filtros para la tabla `asignacion_docente`
--
ALTER TABLE `asignacion_docente`
  ADD CONSTRAINT `fk_asig_anio` FOREIGN KEY (`id_anio`) REFERENCES `anio_escolar` (`id_anio_escolar`),
  ADD CONSTRAINT `fk_asig_curso` FOREIGN KEY (`id_curso`) REFERENCES `cursos` (`id_curso`),
  ADD CONSTRAINT `fk_asig_docente` FOREIGN KEY (`id_docente`) REFERENCES `perfil_docente` (`id_docente`),
  ADD CONSTRAINT `fk_asig_seccion` FOREIGN KEY (`id_seccion`) REFERENCES `secciones` (`id_seccion`);

--
-- Filtros para la tabla `asistencias`
--
ALTER TABLE `asistencias`
  ADD CONSTRAINT `fk_asis_asignacion` FOREIGN KEY (`id_asignacion`) REFERENCES `asignacion_docente` (`id_asignacion`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_asis_matricula` FOREIGN KEY (`id_matricula`) REFERENCES `matriculas` (`id_matricula`) ON DELETE CASCADE;

--
-- Filtros para la tabla `aulas`
--
ALTER TABLE `aulas`
  ADD CONSTRAINT `fk_aula_sede` FOREIGN KEY (`id_sede`) REFERENCES `sedes` (`id_sede`) ON DELETE CASCADE;

--
-- Filtros para la tabla `calificaciones`
--
ALTER TABLE `calificaciones`
  ADD CONSTRAINT `fk_calif_evaluacion` FOREIGN KEY (`id_evaluacion`) REFERENCES `evaluaciones` (`id_evaluacion`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_calif_matricula` FOREIGN KEY (`id_matricula`) REFERENCES `matriculas` (`id_matricula`) ON DELETE CASCADE;

--
-- Filtros para la tabla `conceptos_pago`
--
ALTER TABLE `conceptos_pago`
  ADD CONSTRAINT `fk_concepto_grado` FOREIGN KEY (`id_grado`) REFERENCES `grados` (`id_grado`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_concepto_inst` FOREIGN KEY (`id_institucion`) REFERENCES `institucion` (`id_institucion`) ON DELETE CASCADE;

--
-- Filtros para la tabla `cursos`
--
ALTER TABLE `cursos`
  ADD CONSTRAINT `fk_curso_area` FOREIGN KEY (`id_area`) REFERENCES `areas` (`id_area`) ON DELETE CASCADE;

--
-- Filtros para la tabla `deudas_alumno`
--
ALTER TABLE `deudas_alumno`
  ADD CONSTRAINT `fk_deuda_concepto` FOREIGN KEY (`id_concepto`) REFERENCES `conceptos_pago` (`id_concepto`),
  ADD CONSTRAINT `fk_deuda_matricula` FOREIGN KEY (`id_matricula`) REFERENCES `matriculas` (`id_matricula`) ON DELETE CASCADE;

--
-- Filtros para la tabla `documentos_alumno`
--
ALTER TABLE `documentos_alumno`
  ADD CONSTRAINT `fk_doc_alumno` FOREIGN KEY (`id_alumno`) REFERENCES `alumnos` (`id_alumno`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_doc_requisito` FOREIGN KEY (`id_requisito`) REFERENCES `requisitos_documentos` (`id_requisito`);

--
-- Filtros para la tabla `evaluaciones`
--
ALTER TABLE `evaluaciones`
  ADD CONSTRAINT `fk_eval_asignacion` FOREIGN KEY (`id_asignacion`) REFERENCES `asignacion_docente` (`id_asignacion`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_eval_periodo` FOREIGN KEY (`id_periodo`) REFERENCES `periodos` (`id_periodo`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_eval_tipoeval` FOREIGN KEY (`id_tipo_evaluacion`) REFERENCES `tipos_evaluacion` (`id_tipo_evaluacion`),
  ADD CONSTRAINT `fk_eval_tiponota` FOREIGN KEY (`id_tipo_nota`) REFERENCES `tipos_nota` (`id_tipo_nota`);

--
-- Filtros para la tabla `grados`
--
ALTER TABLE `grados`
  ADD CONSTRAINT `fk_grado_sede` FOREIGN KEY (`id_sede`) REFERENCES `sedes` (`id_sede`) ON DELETE CASCADE;

--
-- Filtros para la tabla `horarios`
--
ALTER TABLE `horarios`
  ADD CONSTRAINT `fk_horario_asignacion` FOREIGN KEY (`id_asignacion`) REFERENCES `asignacion_docente` (`id_asignacion`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_horario_aula` FOREIGN KEY (`id_aula`) REFERENCES `aulas` (`id_aula`) ON DELETE SET NULL;

--
-- Filtros para la tabla `malla_curricular`
--
ALTER TABLE `malla_curricular`
  ADD CONSTRAINT `fk_malla_anio` FOREIGN KEY (`id_anio`) REFERENCES `anio_escolar` (`id_anio_escolar`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_malla_curso` FOREIGN KEY (`id_curso`) REFERENCES `cursos` (`id_curso`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_malla_grado` FOREIGN KEY (`id_grado`) REFERENCES `grados` (`id_grado`) ON DELETE CASCADE;

--
-- Filtros para la tabla `matriculas`
--
ALTER TABLE `matriculas`
  ADD CONSTRAINT `fk_mat_alumno` FOREIGN KEY (`id_alumno`) REFERENCES `alumnos` (`id_alumno`),
  ADD CONSTRAINT `fk_mat_anio` FOREIGN KEY (`id_anio`) REFERENCES `anio_escolar` (`id_anio_escolar`),
  ADD CONSTRAINT `fk_mat_seccion` FOREIGN KEY (`id_seccion`) REFERENCES `secciones` (`id_seccion`);

--
-- Filtros para la tabla `pagos_caja`
--
ALTER TABLE `pagos_caja`
  ADD CONSTRAINT `fk_pago_caja_metodo` FOREIGN KEY (`id_metodo`) REFERENCES `metodos_pago` (`id_metodo`),
  ADD CONSTRAINT `fk_pago_caja_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`);

--
-- Filtros para la tabla `pago_detalle`
--
ALTER TABLE `pago_detalle`
  ADD CONSTRAINT `fk_detalle_deuda` FOREIGN KEY (`id_deuda`) REFERENCES `deudas_alumno` (`id_deuda`),
  ADD CONSTRAINT `fk_detalle_pago` FOREIGN KEY (`id_pago`) REFERENCES `pagos_caja` (`id_pago`) ON DELETE CASCADE;

--
-- Filtros para la tabla `perfil_docente`
--
ALTER TABLE `perfil_docente`
  ADD CONSTRAINT `fk_docente_especialidad` FOREIGN KEY (`id_especialidad`) REFERENCES `especialidades` (`id_especialidad`),
  ADD CONSTRAINT `fk_docente_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE;

--
-- Filtros para la tabla `periodos`
--
ALTER TABLE `periodos`
  ADD CONSTRAINT `fk_periodo_anio_rel` FOREIGN KEY (`id_anio`) REFERENCES `anio_escolar` (`id_anio_escolar`) ON DELETE CASCADE;

--
-- Filtros para la tabla `permisos`
--
ALTER TABLE `permisos`
  ADD CONSTRAINT `permisos_ibfk_1` FOREIGN KEY (`id_modulo`) REFERENCES `modulos` (`id_modulo`) ON DELETE SET NULL;

--
-- Filtros para la tabla `promedios_periodo`
--
ALTER TABLE `promedios_periodo`
  ADD CONSTRAINT `fk_prom_asignacion` FOREIGN KEY (`id_asignacion`) REFERENCES `asignacion_docente` (`id_asignacion`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_prom_matricula` FOREIGN KEY (`id_matricula`) REFERENCES `matriculas` (`id_matricula`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_prom_periodo` FOREIGN KEY (`id_periodo`) REFERENCES `periodos` (`id_periodo`) ON DELETE CASCADE;

--
-- Filtros para la tabla `rol_modulo`
--
ALTER TABLE `rol_modulo`
  ADD CONSTRAINT `fk_rol_modulo_modulo` FOREIGN KEY (`id_modulo`) REFERENCES `modulos` (`id_modulo`),
  ADD CONSTRAINT `fk_rol_modulo_rol` FOREIGN KEY (`id_rol`) REFERENCES `roles` (`id_rol`);

--
-- Filtros para la tabla `secciones`
--
ALTER TABLE `secciones`
  ADD CONSTRAINT `fk_seccion_grado` FOREIGN KEY (`id_grado`) REFERENCES `grados` (`id_grado`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_seccion_sede` FOREIGN KEY (`id_sede`) REFERENCES `sedes` (`id_sede`) ON DELETE CASCADE;

--
-- Filtros para la tabla `sedes`
--
ALTER TABLE `sedes`
  ADD CONSTRAINT `fk_sede_institucion` FOREIGN KEY (`id_institucion`) REFERENCES `institucion` (`id_institucion`) ON DELETE CASCADE;

--
-- Filtros para la tabla `suscripciones`
--
ALTER TABLE `suscripciones`
  ADD CONSTRAINT `fk_suscripcion_ciclo` FOREIGN KEY (`id_ciclo`) REFERENCES `ciclos_facturacion` (`id_ciclo`),
  ADD CONSTRAINT `fk_suscripcion_estado` FOREIGN KEY (`id_estado`) REFERENCES `estados_suscripcion` (`id_estado`),
  ADD CONSTRAINT `fk_suscripcion_institucion` FOREIGN KEY (`id_institucion`) REFERENCES `institucion` (`id_institucion`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_suscripcion_plan` FOREIGN KEY (`id_plan`) REFERENCES `planes` (`id_plan`);

--
-- Filtros para la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `fk_usuario_rol` FOREIGN KEY (`id_rol`) REFERENCES `roles` (`id_rol`),
  ADD CONSTRAINT `fk_usuario_sede` FOREIGN KEY (`id_sede`) REFERENCES `sedes` (`id_sede`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_usuario_tipodoc` FOREIGN KEY (`id_tipo_doc`) REFERENCES `tipo_documentos` (`id_documento`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
