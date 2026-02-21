-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost:3306
-- Tiempo de generación: 21-02-2026 a las 19:45:19
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
  `tipo_ingreso` enum('Nuevo','Regular','Traslado','Reingreso') DEFAULT 'Regular',
  `estado_alumno` enum('Activo','Egresado','Retirado','Expulsado') DEFAULT 'Activo',
  `estado` tinyint(1) DEFAULT 1
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
  `estado` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `anio_escolar`
--

CREATE TABLE `anio_escolar` (
  `id_anio_escolar` bigint(20) UNSIGNED NOT NULL,
  `id_sede` bigint(20) UNSIGNED NOT NULL,
  `nombre_anio` varchar(4) NOT NULL,
  `activo` tinyint(1) DEFAULT 1,
  `estado` tinyint(1) DEFAULT 1
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
  `estado` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `areas`
--

CREATE TABLE `areas` (
  `id_area` bigint(20) UNSIGNED NOT NULL,
  `id_sede` bigint(20) UNSIGNED NOT NULL,
  `nombre_area` varchar(100) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `estado` tinyint(1) DEFAULT 1
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
  `estado` tinyint(1) DEFAULT 1
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
  `estado_asistencia` enum('Presente','Falta','Tardanza','Justificado') NOT NULL DEFAULT 'Presente',
  `observaciones` varchar(255) DEFAULT NULL,
  `estado` tinyint(1) DEFAULT 1
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
  `estado` tinyint(1) DEFAULT 1
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
  `estado` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ciclos_facturacion`
--

CREATE TABLE `ciclos_facturacion` (
  `id_ciclo` bigint(20) UNSIGNED NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `meses_duracion` int(11) NOT NULL,
  `estado` tinyint(1) DEFAULT 1
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
  `nombre_concepto` varchar(100) NOT NULL,
  `monto` decimal(10,2) NOT NULL,
  `estado_concepto` tinyint(1) DEFAULT 1,
  `estado` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cursos`
--

CREATE TABLE `cursos` (
  `id_curso` bigint(20) UNSIGNED NOT NULL,
  `id_area` bigint(20) UNSIGNED NOT NULL,
  `nombre_curso` varchar(100) NOT NULL,
  `estado` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `deudas_alumno`
--

CREATE TABLE `deudas_alumno` (
  `id_deuda` bigint(20) UNSIGNED NOT NULL,
  `id_matricula` bigint(20) UNSIGNED NOT NULL,
  `id_concepto` bigint(20) UNSIGNED NOT NULL,
  `descripcion_cuota` varchar(50) NOT NULL,
  `monto_total` decimal(10,2) NOT NULL,
  `fecha_emision` date NOT NULL,
  `fecha_vencimiento` date NOT NULL,
  `estado_deuda` enum('Pendiente','Pagado','Abono_Parcial','Anulado') DEFAULT 'Pendiente',
  `fecha_pago_total` datetime DEFAULT NULL,
  `estado` tinyint(1) DEFAULT 1
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
  `estado_revision` enum('Pendiente','Aprobado','Rechazado') DEFAULT 'Pendiente',
  `observaciones` text DEFAULT NULL,
  `estado` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `especialidades`
--

CREATE TABLE `especialidades` (
  `id_especialidad` bigint(20) UNSIGNED NOT NULL,
  `nombre_especialidad` varchar(100) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `estado` tinyint(1) DEFAULT 1
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
  `nombre` varchar(50) NOT NULL,
  `estado` tinyint(1) DEFAULT 1
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
  `estado` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `grados`
--

CREATE TABLE `grados` (
  `id_grado` bigint(20) UNSIGNED NOT NULL,
  `id_sede` bigint(20) UNSIGNED NOT NULL,
  `nombre_grado` varchar(50) NOT NULL,
  `estado` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `horarios`
--

CREATE TABLE `horarios` (
  `id_horario` bigint(20) UNSIGNED NOT NULL,
  `id_asignacion` bigint(20) UNSIGNED NOT NULL,
  `id_aula` bigint(20) UNSIGNED DEFAULT NULL,
  `dia_semana` enum('Lunes','Martes','Miércoles','Jueves','Viernes','Sábado') NOT NULL,
  `hora_inicio` time NOT NULL,
  `hora_fin` time NOT NULL,
  `estado` tinyint(1) DEFAULT 1
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
  `estado_suscripcion` enum('ACTIVO','SUSPENDIDO','DEMO','CANCELADO') DEFAULT 'DEMO',
  `fecha_inicio_suscripcion` date DEFAULT NULL,
  `fecha_vencimiento_licencia` date DEFAULT NULL,
  `plan_contratado` varchar(50) DEFAULT 'Plan Básico',
  `estado` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `malla_curricular`
--

CREATE TABLE `malla_curricular` (
  `id_malla` bigint(20) UNSIGNED NOT NULL,
  `id_anio` bigint(20) UNSIGNED NOT NULL,
  `id_grado` bigint(20) UNSIGNED NOT NULL,
  `id_curso` bigint(20) UNSIGNED NOT NULL,
  `estado` tinyint(1) DEFAULT 1
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
  `situacion_academica_previa` enum('Promovido','Repitente','Ingresante') NOT NULL DEFAULT 'Promovido',
  `estado_matricula` enum('Activa','Retirada','Trasladado_Saliente') DEFAULT 'Activa',
  `observaciones_matricula` text DEFAULT NULL,
  `fecha_retiro` date DEFAULT NULL,
  `motivo_retiro` text DEFAULT NULL,
  `colegio_destino` varchar(150) DEFAULT NULL,
  `estado` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `metodos_pago`
--

CREATE TABLE `metodos_pago` (
  `id_metodo` bigint(20) UNSIGNED NOT NULL,
  `nombre_metodo` varchar(50) NOT NULL,
  `requiere_comprobante` tinyint(1) DEFAULT 1,
  `estado` tinyint(1) DEFAULT 1
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
  `nombre` varchar(50) NOT NULL,
  `url_base` varchar(100) DEFAULT NULL,
  `estado` tinyint(1) DEFAULT 1
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
  `monto_total_pagado` decimal(10,2) NOT NULL,
  `comprobante_numero` varchar(50) DEFAULT NULL,
  `observacion_pago` text DEFAULT NULL,
  `estado` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pago_detalle`
--

CREATE TABLE `pago_detalle` (
  `id_pago_detalle` bigint(20) UNSIGNED NOT NULL,
  `id_pago` bigint(20) UNSIGNED NOT NULL,
  `id_deuda` bigint(20) UNSIGNED NOT NULL,
  `monto_aplicado` decimal(10,2) NOT NULL,
  `estado` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `perfil_docente`
--

CREATE TABLE `perfil_docente` (
  `id_docente` bigint(20) UNSIGNED NOT NULL,
  `id_usuario` bigint(20) UNSIGNED NOT NULL,
  `id_especialidad` bigint(20) UNSIGNED NOT NULL,
  `grado_academico` varchar(50) DEFAULT NULL,
  `fecha_contratacion` date NOT NULL,
  `estado_laboral` enum('Activo','Licencia','Cesado') DEFAULT 'Activo',
  `estado` tinyint(1) DEFAULT 1
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
  `estado` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `permisos`
--

CREATE TABLE `permisos` (
  `id_permiso` bigint(20) UNSIGNED NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `estado` tinyint(1) DEFAULT 1
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
  `nombre_plan` varchar(100) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `precio_mensual` decimal(10,2) NOT NULL,
  `precio_anual` decimal(10,2) NOT NULL,
  `limite_alumnos` int(11) DEFAULT NULL,
  `limite_sedes` int(11) DEFAULT 1,
  `estado` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `planes`
--

INSERT INTO `planes` (`id_plan`, `nombre_plan`, `descripcion`, `precio_mensual`, `precio_anual`, `limite_alumnos`, `limite_sedes`, `estado`) VALUES
(1, 'Plan Emprendedor (Primaria Pequeña)', NULL, 150.00, 1500.00, 200, 1, 1),
(2, 'Plan Profesional (Primaria Multisede)', NULL, 350.00, 3500.00, 1000, 3, 1),
(3, 'Plan Personalizado (A Medida)', NULL, 0.00, 0.00, NULL, NULL, 1);

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
  `estado_cierre` enum('Abierto','Cerrado_Enviado') DEFAULT 'Abierto',
  `estado` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `registros_api`
--

CREATE TABLE `registros_api` (
  `id_registro` bigint(20) UNSIGNED NOT NULL,
  `id_admin` bigint(20) UNSIGNED NOT NULL,
  `token_generado` text NOT NULL,
  `clave_secreta` varchar(255) NOT NULL,
  `descripcion` varchar(150) DEFAULT 'Token API SaaS',
  `fecha_emision` datetime DEFAULT current_timestamp(),
  `fecha_expiracion` datetime DEFAULT NULL,
  `estado_token` enum('Activo','Revocado','Expirado') DEFAULT 'Activo',
  `estado` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `requisitos_documentos`
--

CREATE TABLE `requisitos_documentos` (
  `id_requisito` bigint(20) UNSIGNED NOT NULL,
  `nombre_documento` varchar(100) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `es_obligatorio` tinyint(1) DEFAULT 0,
  `estado` tinyint(1) DEFAULT 1
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
  `nombre` varchar(50) NOT NULL,
  `estado` tinyint(1) DEFAULT 1
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
  `estado` tinyint(1) DEFAULT 1
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
  `estado` tinyint(1) DEFAULT 1
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
  `estado` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `super_admins`
--

CREATE TABLE `super_admins` (
  `id_admin` bigint(20) UNSIGNED NOT NULL,
  `nombres` varchar(100) NOT NULL,
  `apellidos` varchar(100) NOT NULL,
  `correo` varchar(100) NOT NULL,
  `usuario` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `rol_plataforma` enum('SUPER_ADMIN','SOPORTE_TECNICO','VENTAS') DEFAULT 'SUPER_ADMIN',
  `estado` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
  `precio_acordado` decimal(10,2) NOT NULL,
  `fecha_inicio` date NOT NULL,
  `fecha_vencimiento` date NOT NULL,
  `estado` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipos_evaluacion`
--

CREATE TABLE `tipos_evaluacion` (
  `id_tipo_evaluacion` bigint(20) UNSIGNED NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `estado` tinyint(1) DEFAULT 1
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
  `formato` enum('NUMERO','LETRA','SIMBOLO') NOT NULL,
  `valor_minimo` varchar(10) DEFAULT NULL,
  `valor_maximo` varchar(10) DEFAULT NULL,
  `estado` tinyint(1) DEFAULT 1
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
  `abreviatura` varchar(10) NOT NULL,
  `descripcion` varchar(100) NOT NULL,
  `longitud_maxima` int(11) NOT NULL,
  `es_longitud_exacta` tinyint(1) DEFAULT 1,
  `estado` tinyint(1) DEFAULT 1
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
  `numero_documento` varchar(20) NOT NULL,
  `apellidos` varchar(100) NOT NULL,
  `nombres` varchar(150) NOT NULL,
  `correo` varchar(100) NOT NULL,
  `usuario` varchar(50) NOT NULL,
  `contraseña` varchar(255) NOT NULL,
  `foto_perfil` varchar(255) DEFAULT NULL,
  `estado` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
-- Indices de la tabla `registros_api`
--
ALTER TABLE `registros_api`
  ADD PRIMARY KEY (`id_registro`),
  ADD KEY `fk_api_super_admins` (`id_admin`);

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
  MODIFY `id_alumno` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `alumno_apoderado`
--
ALTER TABLE `alumno_apoderado`
  MODIFY `id_alum_apod` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `anio_escolar`
--
ALTER TABLE `anio_escolar`
  MODIFY `id_anio_escolar` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `apoderados`
--
ALTER TABLE `apoderados`
  MODIFY `id_apoderado` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `areas`
--
ALTER TABLE `areas`
  MODIFY `id_area` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `asignacion_docente`
--
ALTER TABLE `asignacion_docente`
  MODIFY `id_asignacion` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `asistencias`
--
ALTER TABLE `asistencias`
  MODIFY `id_asistencia` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `aulas`
--
ALTER TABLE `aulas`
  MODIFY `id_aula` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `calificaciones`
--
ALTER TABLE `calificaciones`
  MODIFY `id_calificacion` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `ciclos_facturacion`
--
ALTER TABLE `ciclos_facturacion`
  MODIFY `id_ciclo` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `conceptos_pago`
--
ALTER TABLE `conceptos_pago`
  MODIFY `id_concepto` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `cursos`
--
ALTER TABLE `cursos`
  MODIFY `id_curso` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `deudas_alumno`
--
ALTER TABLE `deudas_alumno`
  MODIFY `id_deuda` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `documentos_alumno`
--
ALTER TABLE `documentos_alumno`
  MODIFY `id_doc_alumno` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

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
  MODIFY `id_evaluacion` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `grados`
--
ALTER TABLE `grados`
  MODIFY `id_grado` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `horarios`
--
ALTER TABLE `horarios`
  MODIFY `id_horario` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `institucion`
--
ALTER TABLE `institucion`
  MODIFY `id_institucion` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `malla_curricular`
--
ALTER TABLE `malla_curricular`
  MODIFY `id_malla` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `matriculas`
--
ALTER TABLE `matriculas`
  MODIFY `id_matricula` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `metodos_pago`
--
ALTER TABLE `metodos_pago`
  MODIFY `id_metodo` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `modulos`
--
ALTER TABLE `modulos`
  MODIFY `id_modulo` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `pagos_caja`
--
ALTER TABLE `pagos_caja`
  MODIFY `id_pago` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `pago_detalle`
--
ALTER TABLE `pago_detalle`
  MODIFY `id_pago_detalle` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `perfil_docente`
--
ALTER TABLE `perfil_docente`
  MODIFY `id_docente` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `periodos`
--
ALTER TABLE `periodos`
  MODIFY `id_periodo` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

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
  MODIFY `id_promedio` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `registros_api`
--
ALTER TABLE `registros_api`
  MODIFY `id_registro` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

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
  MODIFY `id_seccion` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `sedes`
--
ALTER TABLE `sedes`
  MODIFY `id_sede` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `super_admins`
--
ALTER TABLE `super_admins`
  MODIFY `id_admin` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `suscripciones`
--
ALTER TABLE `suscripciones`
  MODIFY `id_suscripcion` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

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
  MODIFY `id_usuario` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

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
-- Filtros para la tabla `registros_api`
--
ALTER TABLE `registros_api`
  ADD CONSTRAINT `fk_api_super_admins` FOREIGN KEY (`id_admin`) REFERENCES `super_admins` (`id_admin`) ON DELETE CASCADE;

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
