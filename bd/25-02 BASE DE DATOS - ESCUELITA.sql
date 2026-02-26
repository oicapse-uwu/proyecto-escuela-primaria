-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost:3306
-- Tiempo de generación: 26-02-2026 a las 01:10:27
-- Versión del servidor: 10.11.16-MariaDB
-- Versión de PHP: 8.4.17

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

--
-- Volcado de datos para la tabla `alumnos`
--

INSERT INTO `alumnos` (`id_alumno`, `id_sede`, `id_tipo_doc`, `numero_documento`, `nombres`, `apellidos`, `fecha_nacimiento`, `genero`, `direccion`, `telefono_contacto`, `foto_url`, `observaciones_salud`, `tipo_ingreso`, `estado_alumno`, `estado`) VALUES
(1, 1, 1, '88776655', 'Pedrito', 'Perez', '2015-05-10', 'M', NULL, NULL, NULL, NULL, NULL, NULL, 1),
(2, 2, 1, '81234567', 'Lucia', 'Torres', '2015-08-20', 'F', NULL, NULL, NULL, NULL, NULL, NULL, 1),
(3, 2, 1, '82345678', 'Miguel', 'Perez', '2016-01-15', 'M', NULL, NULL, NULL, NULL, NULL, NULL, 1),
(4, 3, 1, '83456789', 'Sofia', 'Vargas', '2015-11-30', 'F', NULL, NULL, NULL, NULL, NULL, NULL, 1);

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

--
-- Volcado de datos para la tabla `alumno_apoderado`
--

INSERT INTO `alumno_apoderado` (`id_alum_apod`, `id_alumno`, `id_apoderado`, `parentesco`, `es_representante_financiero`, `vive_con_estudiante`, `estado`) VALUES
(1, 1, 1, 'Padre', 0, 1, 1),
(2, 2, 2, 'Madre', 0, 1, 1),
(3, 4, 3, 'Padre', 0, 1, 1);

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

--
-- Volcado de datos para la tabla `anio_escolar`
--

INSERT INTO `anio_escolar` (`id_anio_escolar`, `id_sede`, `nombre_anio`, `activo`, `estado`) VALUES
(1, 1, '2026', 1, 1),
(2, 2, '2026', 1, 1);

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

--
-- Volcado de datos para la tabla `apoderados`
--

INSERT INTO `apoderados` (`id_apoderado`, `id_sede`, `id_tipo_doc`, `numero_documento`, `nombres`, `apellidos`, `telefono_principal`, `correo`, `lugar_trabajo`, `estado`, `lugarTrabajo`) VALUES
(1, 1, 1, '44556677', 'Juan', 'Perez Padre', '987654321', NULL, NULL, 1, NULL),
(2, 2, 1, '10203040', 'Elena', 'Torres', '999888777', NULL, NULL, 1, NULL),
(3, 3, 1, '50607080', 'Mario', 'Vargas', '988776655', NULL, NULL, 1, NULL);

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

--
-- Volcado de datos para la tabla `areas`
--

INSERT INTO `areas` (`id_area`, `id_sede`, `nombre_area`, `descripcion`, `estado`) VALUES
(1, 1, 'Matemáticas', NULL, 1),
(2, 2, 'Comunicación', NULL, 1),
(3, 3, 'Ciencias', NULL, 1);

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
  `estado` int(11) DEFAULT NULL,
  `id_anio_escolar` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `asignacion_docente`
--

INSERT INTO `asignacion_docente` (`id_asignacion`, `id_docente`, `id_seccion`, `id_curso`, `id_anio`, `estado`, `id_anio_escolar`) VALUES
(1, 1, 1, 1, 1, 1, NULL),
(2, 2, 3, 2, 2, 1, NULL),
(3, 3, 4, 3, 2, 1, NULL);

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

--
-- Volcado de datos para la tabla `asistencias`
--

INSERT INTO `asistencias` (`id_asistencia`, `id_asignacion`, `id_matricula`, `fecha`, `estado_asistencia`, `observaciones`, `estado`) VALUES
(1, 1, 1, '2026-03-02', 'Presente', NULL, 1);

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

--
-- Volcado de datos para la tabla `aulas`
--

INSERT INTO `aulas` (`id_aula`, `id_sede`, `nombre_aula`, `capacidad`, `estado`) VALUES
(1, 1, 'Aula 101', 30, 1),
(2, 1, 'Aula 102', 30, 1),
(3, 1, 'Aula 103', 30, 1),
(4, 1, 'Aula 104', 30, 1);

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

--
-- Volcado de datos para la tabla `calificaciones`
--

INSERT INTO `calificaciones` (`id_calificacion`, `id_evaluacion`, `id_matricula`, `nota_obtenida`, `observaciones`, `fecha_calificacion`, `estado`) VALUES
(1, 1, 1, '18', NULL, '2026-02-23 12:46:12', 1);

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
(2, 'Trimestral', 3, 1),
(3, 'Semestral', 6, 1),
(4, 'Anual', 12, 1);

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

--
-- Volcado de datos para la tabla `conceptos_pago`
--

INSERT INTO `conceptos_pago` (`id_concepto`, `id_institucion`, `id_grado`, `nombre_concepto`, `monto`, `estado_concepto`, `estado`) VALUES
(1, 1, NULL, 'Pensión Mensual Regular', 250.00, NULL, 1),
(2, 2, NULL, 'Matrícula 2026', 150.00, NULL, 1),
(3, 2, NULL, 'Pensión Abril', 250.00, NULL, 1),
(4, 2, NULL, 'Materiales Educativos', 50.00, NULL, 1);

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

--
-- Volcado de datos para la tabla `cursos`
--

INSERT INTO `cursos` (`id_curso`, `id_area`, `nombre_curso`, `estado`) VALUES
(1, 1, 'Aritmética Básica', 1),
(2, 2, 'Lenguaje', 1),
(3, 3, 'Ciencia y Ambiente', 1);

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

--
-- Volcado de datos para la tabla `deudas_alumno`
--

INSERT INTO `deudas_alumno` (`id_deuda`, `id_matricula`, `id_concepto`, `descripcion_cuota`, `monto_total`, `fecha_emision`, `fecha_vencimiento`, `estado_deuda`, `fecha_pago_total`, `estado`) VALUES
(1, 1, 1, 'Pensión Marzo', 250.00, '2026-03-01', '2026-03-10', 'Pendiente', NULL, 1),
(2, 2, 2, 'Matrícula 2026 - Lucia', 150.00, '2026-01-15', '2026-02-15', 'Pendiente', NULL, 1),
(3, 2, 3, 'Pensión Abril - Lucia', 250.00, '2026-04-01', '2026-04-10', 'Pendiente', NULL, 1),
(4, 3, 2, 'Matrícula 2026 - Miguel', 150.00, '2026-01-15', '2026-02-15', 'Pagado', NULL, 1),
(5, 4, 2, 'Matrícula 2026 - Sofia', 150.00, '2026-01-15', '2026-02-15', 'Pendiente', NULL, 1);

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

--
-- Volcado de datos para la tabla `documentos_alumno`
--

INSERT INTO `documentos_alumno` (`id_doc_alumno`, `id_alumno`, `id_requisito`, `ruta_archivo`, `fecha_subida`, `estado_revision`, `observaciones`, `estado`) VALUES
(1, 1, 1, '/archivos/dni_pedrito.pdf', '2026-02-23 12:46:12', NULL, NULL, 1);

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
(4, 'Cancelada', 1);

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

--
-- Volcado de datos para la tabla `evaluaciones`
--

INSERT INTO `evaluaciones` (`id_evaluacion`, `id_asignacion`, `id_periodo`, `id_tipo_nota`, `id_tipo_evaluacion`, `tema_especifico`, `fecha_evaluacion`, `estado`) VALUES
(1, 1, 1, 1, 1, 'Suma y Resta Llevando', '2026-04-15', 1);

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

--
-- Volcado de datos para la tabla `grados`
--

INSERT INTO `grados` (`id_grado`, `id_sede`, `nombre_grado`, `estado`) VALUES
(1, 1, 'Primer Grado', 1),
(2, 2, 'Segundo Grado', 1),
(3, 3, 'Primer Grado', 1);

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

--
-- Volcado de datos para la tabla `horarios`
--

INSERT INTO `horarios` (`id_horario`, `id_asignacion`, `id_aula`, `dia_semana`, `hora_inicio`, `hora_fin`, `estado`) VALUES
(1, 1, 1, 'Lunes', '08:00:00', '09:30:00', 1);

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
  `estado_suscripcion` varchar(50) DEFAULT NULL,
  `fecha_inicio_suscripcion` date DEFAULT NULL,
  `fecha_vencimiento_licencia` date DEFAULT NULL,
  `plan_contratado` varchar(50) DEFAULT 'Plan Básico',
  `estado` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `institucion`
--

INSERT INTO `institucion` (`id_institucion`, `nombre`, `cod_modular`, `tipo_gestion`, `resolucion_creacion`, `nombre_director`, `logo_path`, `estado_suscripcion`, `fecha_inicio_suscripcion`, `fecha_vencimiento_licencia`, `plan_contratado`, `estado`) VALUES
(1, 'Colegio Primaria San Marcos', '1234567', 'Privada', NULL, NULL, NULL, NULL, NULL, NULL, 'Plan Básico', 1),
(2, 'Colegio Primaria San Juan', '9876543', 'Pública', NULL, NULL, NULL, NULL, NULL, NULL, 'Plan Básico', 1);

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

--
-- Volcado de datos para la tabla `malla_curricular`
--

INSERT INTO `malla_curricular` (`id_malla`, `id_anio`, `id_grado`, `id_curso`, `estado`) VALUES
(1, 1, 1, 1, 1);

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

--
-- Volcado de datos para la tabla `matriculas`
--

INSERT INTO `matriculas` (`id_matricula`, `id_alumno`, `id_seccion`, `id_anio`, `codigo_matricula`, `fecha_matricula`, `situacion_academica_previa`, `estado_matricula`, `observaciones_matricula`, `fecha_retiro`, `motivo_retiro`, `colegio_destino`, `estado`) VALUES
(1, 1, 1, 1, NULL, '2026-02-23 12:46:12', 'Promovido', 'Activa', NULL, NULL, NULL, NULL, 1),
(2, 2, 3, 2, NULL, '2026-02-23 12:59:08', 'Promovido', 'Activa', NULL, NULL, NULL, NULL, 1),
(3, 3, 3, 2, NULL, '2026-02-23 12:59:08', 'Promovido', 'Activa', NULL, NULL, NULL, NULL, 1),
(4, 4, 4, 2, NULL, '2026-02-23 12:59:08', 'Ingresante', 'Activa', NULL, NULL, NULL, NULL, 1),
(7, 4, 1, 1, 'MAT-2026-005', '2026-02-23 12:46:12', 'Promovido', 'Activa', NULL, NULL, NULL, NULL, 1);

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
(5, 'Tarjeta de Crédito / Débito', 1, 1),
(6, 'Dale', 1, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `modulos`
--

CREATE TABLE `modulos` (
  `id_modulo` bigint(20) UNSIGNED NOT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  `url_base` varchar(255) DEFAULT NULL,
  `estado` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `modulos`
--

INSERT INTO `modulos` (`id_modulo`, `nombre`, `url_base`, `estado`) VALUES
(1, 'ALUMNOS', '/alumnos', 1),
(2, 'NOTAS', '/notas', 1);

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

--
-- Volcado de datos para la tabla `pagos_caja`
--

INSERT INTO `pagos_caja` (`id_pago`, `id_metodo`, `id_usuario`, `fecha_pago`, `monto_total_pagado`, `comprobante_numero`, `observacion_pago`, `estado`) VALUES
(3, 1, 1, '2026-02-23 12:46:12', 250.00, NULL, 'Pago puntual en ventanilla', 1),
(4, 2, 3, '2026-02-23 12:59:08', 150.00, NULL, 'Pago Matrícula Miguel Yape', 1),
(5, 1, 1, '2026-02-23 13:06:17', 150.00, NULL, 'Pago de pension 65', 1),
(6, 1, 1, '2026-02-23 15:11:04', 150.00, NULL, 'Pago de prueba con DTO', 1),
(7, 1, 1, '2026-02-23 15:16:33', 150.00, NULL, 'Pago de prueba con DTO', 1);

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

--
-- Volcado de datos para la tabla `pago_detalle`
--

INSERT INTO `pago_detalle` (`id_pago_detalle`, `id_pago`, `id_deuda`, `monto_aplicado`, `estado`) VALUES
(2, 3, 1, 250.00, 1),
(3, 4, 4, 150.00, 1);

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

--
-- Volcado de datos para la tabla `perfil_docente`
--

INSERT INTO `perfil_docente` (`id_docente`, `id_usuario`, `id_especialidad`, `grado_academico`, `fecha_contratacion`, `estado_laboral`, `estado`) VALUES
(1, 2, 1, 'Maestro', '2026-02-01', 'Pasante', 1),
(2, 4, 3, 'Licenciado', '2026-02-01', 'Contratado', 1),
(3, 5, 4, NULL, '2026-02-10', NULL, 1);

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

--
-- Volcado de datos para la tabla `periodos`
--

INSERT INTO `periodos` (`id_periodo`, `id_anio`, `nombre_periodo`, `fecha_inicio`, `fecha_fin`, `estado`) VALUES
(1, 1, 'Primer Bimestre', '2026-03-01', '2026-05-15', 1),
(2, 1, 'segundo Bimestre', '2026-05-20', '2026-07-15', 1),
(3, 1, 'Tercer Bimestre', '2026-07-20', '2026-09-30', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `permisos`
--

CREATE TABLE `permisos` (
  `id_permiso` bigint(20) UNSIGNED NOT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  `estado` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `permisos`
--

INSERT INTO `permisos` (`id_permiso`, `nombre`, `estado`) VALUES
(1, 'CREATE', 1),
(2, 'READ', 1),
(3, 'UPDATE', 1),
(4, 'DELETE', 1);

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
(1, 'Plan Emprendedor (Primaria Pequeña)', NULL, 150, 1500, 200, 1, 1),
(2, 'Plan Profesional (Primaria Multisede)', NULL, 350, 3500, 1000, 3, 1),
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

--
-- Volcado de datos para la tabla `promedios_periodo`
--

INSERT INTO `promedios_periodo` (`id_promedio`, `id_asignacion`, `id_matricula`, `id_periodo`, `nota_final_area`, `comentario_libreta`, `estado_cierre`, `estado`) VALUES
(1, 1, 1, 1, '18', NULL, 'Abierto', 1);

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
(1, 'Estrellita', 'Greyzman', 'estrellitadondeestas@gmail.com', 'c286046d40244d2771e1d7d76b4f15dde02c82972b9d8124befcb385f7703f06', 'e0d367094b3ceb2c64a08a570974b5d2c1c95b81eaabb1d739f9ed0f37d1c353', '', 1),
(2, 'Cristian', 'García-Estrella', 'cgarcia@gmail.com', 'b8b40f0664e3a40a44e6f81ae8ad80e0de142b1c6f2d125b7cb9d17f5404bdfe', '9de8b4ccaec5adbe8c7b31242929e7a2885e361a1eaf43caa772d39a891826e6', '', 1),
(3, 'Santiago', 'Ayachi Ponce', 'tiaguitoponce@unsm.edu.pe', 'f5af205d0582c8ca3654acddbf4ef001d005a96d3d76992f14420e2f4b568fd9', '$2a$10$2nA3pLJE3r7jw6PrrxLCTuTiPN4QrCX10wXytSs1VvZ19iqc3wA0m', '', 1),
(4, 'Juan Antonio', 'Santacruz Cisnero', 'jantonio@gmail.com', 'c0a76e2e77855b0cf054b3f2715fe52f1da44f8b37b0465dec6bc5764172cd0b', '$2a$10$4Vlajdf.j5DHUwrgVDklWetVMkd9nT7T7YmTuBY2L/WQNyShVfKm2', 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJjMGE3NmUyZTc3ODU1YjBjZjA1NGIzZjI3MTVmZTUyZjFkYTQ0ZjhiMzdiMDQ2NWRlYzZiYzU3NjQxNzJjZDBiIiwiaWF0IjoxNzcwMDU0ODIwLCJleHAiOjQ5MjM2NTQ4MjB9.fEGVULOjn2wWihz0JhWtCs-7gq_iyTIGURdOPWTI7Zw', 1),
(5, 'Carlos Willy', 'Abanto Ponce', 'car.will.abanto.ponce@unsm.edu.pe', '8110cd644b0a4a4f4e504da78b139acc62041ce0ad75dd155f0a783eccab2041', '$2a$10$OtoRr0ZRERxuGvR0oU4vTOxh/IbODhGmwsJLv4YGFDH0v.6xFvffK', 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI4MTEwY2Q2NDRiMGE0YTRmNGU1MDRkYTc4YjEzOWFjYzYyMDQxY2UwYWQ3NWRkMTU1ZjBhNzgzZWNjYWIyMDQxIiwiaWF0IjoxNzcwNzM4OTYwLCJleHAiOjQ5MjQzMzg5NjB9.B56iq4dEirtAyjkfoDkS91gfuebdxK1inW8Elz6_Zks', 1),
(6, 'Cristian W', 'García-Estrella', 'cgarciaestrella@unsm.edu.pe', '2ec9225ff5a310f2a8b2a10efaacdd94aeba1f525a3f21d00834a28f4ecbe758', '$2a$10$9o9L232cvIYQ8SeytgDjLeWFbLeXx.cSF8qnVNi1ajUwznrLQaiTi', '', 1),
(7, 'Martín ', 'Sisniegas Peches', 'martin.sispe@unsm.edu.pe', '3dd2030c8efae4e4efa0f2ca6edad72194a11d90b3e6f177669339cb1c492c6c', '$2a$10$bSs.IJMS4.OX/8JksDOPAuYBU7gMwU9PAkv.PX5Nf2pyVbY6mWFoC', 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIzZGQyMDMwYzhlZmFlNGU0ZWZhMGYyY2E2ZWRhZDcyMTk0YTExZDkwYjNlNmYxNzc2NjkzMzljYjFjNDkyYzZjIiwiaWF0IjoxNzcwNzQwMTkyLCJleHAiOjQ5MjQzNDAxOTJ9.Amm-uCSAdnLqwSS-2q_7xTyejGSJVA5CEa4qyN_MIpE', 1),
(8, 'Cristina', 'Berru Lozano', 'c.berrulo@unsm.edu.pe', '3206ee66171c0639358967316ae82bbad3c6685483894694633f18bf228bdddc', '$2a$10$.MvBkkzQGTT8opKnnoEQJuLVWqrifRXqyfQE9Y5RatOLf8g.7lL6m', 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIzMjA2ZWU2NjE3MWMwNjM5MzU4OTY3MzE2YWU4MmJiYWQzYzY2ODU0ODM4OTQ2OTQ2MzNmMThiZjIyOGJkZGRjIiwiaWF0IjoxNzcxODQ1NDcwLCJleHAiOjQ5MjU0NDU0NzB9.yrOFdHcfWGEwqzFe3Pw-F8axRMcyqD3z51f0yzBhiG8', 1),
(9, 'Oicapse', 'Lozano', 'c.berrulo@unsm.edu.pe', 'b7d1b1774999350d2e1e5c7685326db62eace48b90bb173e306b199efae64c09', '$2a$10$oOW82n9/UsaLACKHHxL2xOfTgHyKA4oPJ471pPqaLc7vmm5FZ22GK', 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJiN2QxYjE3NzQ5OTkzNTBkMmUxZTVjNzY4NTMyNmRiNjJlYWNlNDhiOTBiYjE3M2UzMDZiMTk5ZWZhZTY0YzA5IiwiaWF0IjoxNzcxODQ2MDA2LCJleHAiOjQ5MjU0NDYwMDZ9.SNEr3WwLHnFoCnilt3BOtWFYeR3e-SC4gf5SL-LM8HE', 1),
(10, 'Keyth', 'Lozano', 'keloba@gmail.com', 'b6e9801dbcd68e039a06248efeb0c21d4f5b7492eaf003bbceb150b0100eddb9', '$2a$10$cxEwG7XJ846SX08aUpMRleaN3QHyOirpb/1/9E2ls/GJK91XWrcFi', 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJiNmU5ODAxZGJjZDY4ZTAzOWEwNjI0OGVmZWIwYzIxZDRmNWI3NDkyZWFmMDAzYmJjZWIxNTBiMDEwMGVkZGI5IiwiaWF0IjoxNzcxODQ2MDk0LCJleHAiOjQ5MjU0NDYwOTR9.JyUhq_wfsq_dEARGlRiVs06mly_ccSHchpRxMHt50l8', 1),
(11, 'MARTÍN', 'MOZOMBITE', 'm.munozmo@unsm.edu.pe', '8b37d65f8050099ca5530856daadfbf948be0b1db0995dd168e8351c3ba3be8c', '$2a$10$zPmq.WuHncHZP0u2s0w78e5laT6HOJMYlP7BFZ0Iq2nWSW8B6dvx6', 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI4YjM3ZDY1ZjgwNTAwOTljYTU1MzA4NTZkYWFkZmJmOTQ4YmUwYjFkYjA5OTVkZDE2OGU4MzUxYzNiYTNiZThjIiwiaWF0IjoxNzcxODQ4NDAxLCJleHAiOjQ5MjU0NDg0MDF9.SHG1AOiKYAtaqbcHW8YOQkD7VXoI7m9NiC1dVtHpEq4', 1),
(12, 'juguito', 'de piña', 'nay.arevalo@outlook.com', '15b009092bc6e39605a2901aca758ac628392074d67ce81b7ba03d779ed5810f', '$2a$10$z0hvWzA7FmDe4m/ujYX1HOrGH0t11IPLon4vsP5/RqbjkqnOqxWI2', 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxNWIwMDkwOTJiYzZlMzk2MDVhMjkwMWFjYTc1OGFjNjI4MzkyMDc0ZDY3Y2U4MWI3YmEwM2Q3NzllZDU4MTBmIiwiaWF0IjoxNzcxODU2NTg3LCJleHAiOjQ5MjU0NTY1ODd9.01MF_bMD86rmlRIgHvMitLkqu7-B2JV9bqRw6NhlODE', 1),
(13, 'Nayelli Yuley', 'Arevalo Romero', 'yulearevalor@gmail.com', '9b054832aefe4c2296a9bf67e2eb9c91da8faa7f733db7d8b5d74c9a80a11b71', '$2a$10$xvyNTSdegSqcM6mXHCbG0.l6M0MDz5MNsVp3w3Dg5f0pcj9XFODs6', 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI5YjA1NDgzMmFlZmU0YzIyOTZhOWJmNjdlMmViOWM5MWRhOGZhYTdmNzMzZGI3ZDhiNWQ3NGM5YTgwYTExYjcxIiwiaWF0IjoxNzcxODU3MzczLCJleHAiOjQ5MjU0NTczNzN9.kDZ4EmrW5QKXQhAODv5ddpCcQTyAzLPaNdacbsj6Hb4', 1),
(14, 'Cristina', 'Lozano', 'cristina.berru2909@gmail.com', '30e48bf4537aed7d9457b525451591b18178459452bcd3665ad27fcd0a29e7f3', '$2a$10$epUth4h6IUqfl9L2nn3u/eRaNjysinL6cIjOG4uRHox/e/LE5kb06', 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIzMGU0OGJmNDUzN2FlZDdkOTQ1N2I1MjU0NTE1OTFiMTgxNzg0NTk0NTJiY2QzNjY1YWQyN2ZjZDBhMjllN2YzIiwiaWF0IjoxNzcxODU4NDEzLCJleHAiOjQ5MjU0NTg0MTN9.Gtb1-7q9AgmZwRzktKYCdK3YXFjqnUHLpL3cAxpfbgo', 1),
(15, 'Cristina', 'Lozano', 'cristina.berru2909@gmail.com', '30e48bf4537aed7d9457b525451591b18178459452bcd3665ad27fcd0a29e7f3', '$2a$10$S7iY.3cLrAn36FJJsak6UOqhfMmK2fT6A7httwi5NKm1Bq6RbH5mq', '', 1),
(16, 'Nely Bernilla', 'Carrillo Bernilla', 'bernillacarrillo@gmail.com', '7ab177e68f689130a6d7e5f5e7967ea4632823a98ac3ded1619a9acbcd61f34e', '$2a$10$zHLCVI2LeLWAlmg9MpFzwOncHcrOtNKFGPOcmAst8dVzQoerFC/NW', 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI3YWIxNzdlNjhmNjg5MTMwYTZkN2U1ZjVlNzk2N2VhNDYzMjgyM2E5OGFjM2RlZDE2MTlhOWFjYmNkNjFmMzRlIiwiaWF0IjoxNzcxODU4NTY4LCJleHAiOjQ5MjU0NTg1Njh9.ZtHgPSe9ntbA03IUGMXQDHwSm83zLnXIqF4mNUn9bys', 1),
(17, 'Pepitoo ', 'Muelas Dientes', 'muelas@gmail.com', '400622db3dcc092a6ca71d1ca929f53e4560718f5551fb0108423eb1ae8f9786', '$2a$10$mEXqWs6aMM9jY3mt9QMheee0GhHokSgZleXEovt1dFBO5dm96h1Im', 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI0MDA2MjJkYjNkY2MwOTJhNmNhNzFkMWNhOTI5ZjUzZTQ1NjA3MThmNTU1MWZiMDEwODQyM2ViMWFlOGY5Nzg2IiwiaWF0IjoxNzcxODU4Nzc1LCJleHAiOjQ5MjU0NTg3NzV9.hnOx3trH6Xy3hZkmiEXR-EeHhIfzNRVOqx4JcmyjwEA', 1),
(18, 'Estrellita', 'Mejor Profe', 'strellitailoveyou@gmail.com', 'e20aeae95705847d5b10113814d8895d9b454ae1fa590e26595dde9d652d11f4', '$2a$10$30FDGDIoD80is9ugKYbhmOCVipihVgIb1p8eV6N0Gqg4YGYY0VpIm', 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJlMjBhZWFlOTU3MDU4NDdkNWIxMDExMzgxNGQ4ODk1ZDliNDU0YWUxZmE1OTBlMjY1OTVkZGU5ZDY1MmQxMWY0IiwiaWF0IjoxNzcxODYwODkwLCJleHAiOjQ5MjU0NjA4OTB9.LeTs-Ve0Cf65BJXelNNoVjofVshZto2CM-Azi24v4aM', 1),
(19, 'Prueba', 'API', 'pruebita1@gmail.com', 'f542600a56a90ec147e5d72c47ea093a2dfcc648b1a234857cb6889058762125', '$2a$10$.ScEn2A3vMcFlGHGTWYuIOh5AMvP8eGqdEbSBabZ6/JW2RKuGLfqq', 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJmNTQyNjAwYTU2YTkwZWMxNDdlNWQ3MmM0N2VhMDkzYTJkZmNjNjQ4YjFhMjM0ODU3Y2I2ODg5MDU4NzYyMTI1IiwiaWF0IjoxNzcxOTY3Mzg2LCJleHAiOjQ5MjU1NjczODZ9.RGNFceHt1eyP4UFyH7jCRfOlBQFfQYy7mWA2fOX1D_0', 1);

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
(4, 'Constancia de Matrícula SIAGIE', 'Documento oficial generado por el portal SIAGIE', 0, 1),
(5, 'Ficha Médica / Certificado de Salud', 'Estado de salud actual del estudiante', 0, 1),
(6, 'Fotos Tamaño Carné', '4 fotos con fondo blanco', 0, 1);

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
(1, 'ADMIN', 1),
(2, 'PROFESOR', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rol_modulo_permiso`
--

CREATE TABLE `rol_modulo_permiso` (
  `id_rmp` bigint(20) UNSIGNED NOT NULL,
  `id_rol` bigint(20) UNSIGNED NOT NULL,
  `id_modulo` bigint(20) UNSIGNED NOT NULL,
  `id_permiso` bigint(20) UNSIGNED NOT NULL,
  `estado` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `rol_modulo_permiso`
--

INSERT INTO `rol_modulo_permiso` (`id_rmp`, `id_rol`, `id_modulo`, `id_permiso`, `estado`) VALUES
(1, 1, 1, 1, 1),
(2, 1, 1, 2, 1),
(3, 1, 1, 3, 1),
(4, 1, 1, 4, 1),
(8, 2, 2, 2, 1),
(9, 2, 2, 3, 1);

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

--
-- Volcado de datos para la tabla `secciones`
--

INSERT INTO `secciones` (`id_seccion`, `id_grado`, `id_sede`, `nombre_seccion`, `vacantes`, `estado`) VALUES
(1, 1, 1, 'A', 30, 1),
(2, 2, 2, 'A', 30, 1),
(3, 2, 2, 'B', 30, 1),
(4, 3, 3, 'A', 25, 1);

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
  `estado` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `sedes`
--

INSERT INTO `sedes` (`id_sede`, `id_institucion`, `nombre_sede`, `direccion`, `distrito`, `provincia`, `departamento`, `ugel`, `telefono`, `correo_institucional`, `estado`) VALUES
(1, 1, 'Sede Principal', 'Av. Los Estudiantes 123', NULL, NULL, NULL, NULL, NULL, NULL, 1),
(2, 2, 'Sede Norte', 'Av. Las Palmeras 456', NULL, NULL, NULL, NULL, NULL, NULL, 1),
(3, 2, 'Sede Central San Juan', 'Jr. Los Pinos 789', NULL, NULL, NULL, NULL, NULL, NULL, 1);

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
  `estado` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `super_admins`
--

INSERT INTO `super_admins` (`id_admin`, `nombres`, `apellidos`, `correo`, `usuario`, `password`, `rol_plataforma`, `estado`) VALUES
(1, 'Super', 'Admin', 'admin@sanmarcos.edu.pe', 'superadmin', '123456', NULL, 1);

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
  `estado` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `suscripciones`
--

INSERT INTO `suscripciones` (`id_suscripcion`, `id_institucion`, `id_plan`, `id_ciclo`, `id_estado`, `limite_alumnos_contratado`, `limite_sedes_contratadas`, `precio_acordado`, `fecha_inicio`, `fecha_vencimiento`, `estado`) VALUES
(1, 1, 1, 1, 1, 500, 1, NULL, '2026-01-01', '2026-12-31', 1),
(2, 2, 2, 4, 1, 600, 2, NULL, '2026-01-02', '2026-12-25', 1);

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
(4, 'Tarea para la casa', 1),
(5, 'Exposición / Proyecto', 1);

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
(3, 'Estrellas Infantil', 'SIMBOLO', '1', '5', 1);

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
(1, 'DNI', 'DNI', 8, 1, 1),
(2, 'CE', 'Carné Extranjería', 9, 1, 1),
(3, 'PAS', 'Pasaporte', 15, 0, 1);

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
(1, 1, 1, 1, '76543210', 'Cajero', 'Carlos', NULL, 'ccajero', '123456', NULL, 1),
(2, 1, 2, 1, '11223344', 'Profe', 'Luis', NULL, 'lprofe', '123456', NULL, 1),
(3, 3, 1, 1, '71112223', 'Gomez', 'Maria', NULL, 'mgomez', '123456', NULL, 1),
(4, 2, 2, 1, '41234567', 'Bellido', 'Ana', NULL, 'abellido', '123456', NULL, 1),
(5, 3, 2, 1, '49876543', 'Carlos', 'Roberto', NULL, 'rcarlos', '123456', NULL, 1);

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
  ADD UNIQUE KEY `cod_modular` (`cod_modular`);

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
  ADD UNIQUE KEY `nombre` (`nombre`);

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
-- Indices de la tabla `rol_modulo_permiso`
--
ALTER TABLE `rol_modulo_permiso`
  ADD PRIMARY KEY (`id_rmp`),
  ADD UNIQUE KEY `unique_rol_mod_per` (`id_rol`,`id_modulo`,`id_permiso`),
  ADD KEY `fk_modulo` (`id_modulo`),
  ADD KEY `fk_permiso` (`id_permiso`);

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
  MODIFY `id_alumno` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `alumno_apoderado`
--
ALTER TABLE `alumno_apoderado`
  MODIFY `id_alum_apod` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `anio_escolar`
--
ALTER TABLE `anio_escolar`
  MODIFY `id_anio_escolar` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `apoderados`
--
ALTER TABLE `apoderados`
  MODIFY `id_apoderado` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `areas`
--
ALTER TABLE `areas`
  MODIFY `id_area` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `asignacion_docente`
--
ALTER TABLE `asignacion_docente`
  MODIFY `id_asignacion` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `asistencias`
--
ALTER TABLE `asistencias`
  MODIFY `id_asistencia` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `aulas`
--
ALTER TABLE `aulas`
  MODIFY `id_aula` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `calificaciones`
--
ALTER TABLE `calificaciones`
  MODIFY `id_calificacion` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `ciclos_facturacion`
--
ALTER TABLE `ciclos_facturacion`
  MODIFY `id_ciclo` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `conceptos_pago`
--
ALTER TABLE `conceptos_pago`
  MODIFY `id_concepto` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `cursos`
--
ALTER TABLE `cursos`
  MODIFY `id_curso` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `deudas_alumno`
--
ALTER TABLE `deudas_alumno`
  MODIFY `id_deuda` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `documentos_alumno`
--
ALTER TABLE `documentos_alumno`
  MODIFY `id_doc_alumno` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `especialidades`
--
ALTER TABLE `especialidades`
  MODIFY `id_especialidad` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `estados_suscripcion`
--
ALTER TABLE `estados_suscripcion`
  MODIFY `id_estado` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `evaluaciones`
--
ALTER TABLE `evaluaciones`
  MODIFY `id_evaluacion` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `grados`
--
ALTER TABLE `grados`
  MODIFY `id_grado` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `horarios`
--
ALTER TABLE `horarios`
  MODIFY `id_horario` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `institucion`
--
ALTER TABLE `institucion`
  MODIFY `id_institucion` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `malla_curricular`
--
ALTER TABLE `malla_curricular`
  MODIFY `id_malla` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `matriculas`
--
ALTER TABLE `matriculas`
  MODIFY `id_matricula` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `metodos_pago`
--
ALTER TABLE `metodos_pago`
  MODIFY `id_metodo` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `modulos`
--
ALTER TABLE `modulos`
  MODIFY `id_modulo` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `pagos_caja`
--
ALTER TABLE `pagos_caja`
  MODIFY `id_pago` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

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
  MODIFY `id_periodo` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `permisos`
--
ALTER TABLE `permisos`
  MODIFY `id_permiso` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `planes`
--
ALTER TABLE `planes`
  MODIFY `id_plan` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `promedios_periodo`
--
ALTER TABLE `promedios_periodo`
  MODIFY `id_promedio` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `registros`
--
ALTER TABLE `registros`
  MODIFY `idregistro` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT de la tabla `requisitos_documentos`
--
ALTER TABLE `requisitos_documentos`
  MODIFY `id_requisito` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `roles`
--
ALTER TABLE `roles`
  MODIFY `id_rol` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `rol_modulo_permiso`
--
ALTER TABLE `rol_modulo_permiso`
  MODIFY `id_rmp` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `secciones`
--
ALTER TABLE `secciones`
  MODIFY `id_seccion` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `sedes`
--
ALTER TABLE `sedes`
  MODIFY `id_sede` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `super_admins`
--
ALTER TABLE `super_admins`
  MODIFY `id_admin` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `suscripciones`
--
ALTER TABLE `suscripciones`
  MODIFY `id_suscripcion` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `tipos_evaluacion`
--
ALTER TABLE `tipos_evaluacion`
  MODIFY `id_tipo_evaluacion` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `tipos_nota`
--
ALTER TABLE `tipos_nota`
  MODIFY `id_tipo_nota` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `tipo_documentos`
--
ALTER TABLE `tipo_documentos`
  MODIFY `id_documento` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

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
-- Filtros para la tabla `promedios_periodo`
--
ALTER TABLE `promedios_periodo`
  ADD CONSTRAINT `fk_prom_asignacion` FOREIGN KEY (`id_asignacion`) REFERENCES `asignacion_docente` (`id_asignacion`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_prom_matricula` FOREIGN KEY (`id_matricula`) REFERENCES `matriculas` (`id_matricula`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_prom_periodo` FOREIGN KEY (`id_periodo`) REFERENCES `periodos` (`id_periodo`) ON DELETE CASCADE;

--
-- Filtros para la tabla `rol_modulo_permiso`
--
ALTER TABLE `rol_modulo_permiso`
  ADD CONSTRAINT `fk_modulo` FOREIGN KEY (`id_modulo`) REFERENCES `modulos` (`id_modulo`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_permiso` FOREIGN KEY (`id_permiso`) REFERENCES `permisos` (`id_permiso`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_rol` FOREIGN KEY (`id_rol`) REFERENCES `roles` (`id_rol`) ON DELETE CASCADE;

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
