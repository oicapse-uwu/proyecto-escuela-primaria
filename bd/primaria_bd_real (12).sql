-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost:3306
-- Tiempo de generación: 11-03-2026 a las 04:26:39
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

--
-- Volcado de datos para la tabla `alumnos`
--

INSERT INTO `alumnos` (`id_alumno`, `id_sede`, `id_tipo_doc`, `numero_documento`, `nombres`, `apellidos`, `fecha_nacimiento`, `genero`, `direccion`, `telefono_contacto`, `foto_url`, `observaciones_salud`, `tipo_ingreso`, `estado_alumno`, `estado`) VALUES
(25, 18, 1, '40240623', 'Samuel', 'Contreras Bernilla', '2018-02-13', 'M', '201-4037 Massa Carretera', '956481233', '', 'No padece de ninguna enfermedad', 'Reinicio', 'ACTIVO', 1),
(26, 20, 1, '09101111', 'Laurissa', 'Jaramillo Lozano', '2016-06-21', 'F', 'Jr. 9 de abril 331', '960562285', '/uploads/perfiles/c1bca6d2-35b1-4cc9-b169-7fe71a769232.png', 'Es alergica a la penisilina', NULL, NULL, 1),
(27, 18, 1, '61555555', 'Isaisas contreras bernilla', 'contreras bernilla', '2016-08-28', 'M', 'jr primavera 334', '952614821', '', '', NULL, NULL, 1),
(28, 18, 1, '61555789', 'Lucas Manuel', 'contreras bernilla', '2016-09-28', 'M', 'jr primavera 334', '952614870', '', '', NULL, NULL, 1),
(29, 18, 1, '45623515', 'Gabriel', 'Contreras', '2015-06-02', 'M', '', '', '', '', NULL, NULL, 1);

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
(7, 25, 7, 'Madre', 0, 1, 1),
(8, 26, 8, 'Madre', 1, 1, 1),
(9, 27, 7, 'Madre', 0, 1, 1),
(10, 29, 9, 'Tia', 1, 1, 1);

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
(6, 18, '2026', 1, 1),
(7, 17, '2026', 1, 1),
(8, 17, '2054444444', 1, 0),
(9, 17, '2027', 0, 1),
(10, 16, '2026', -2147483648, 1),
(11, 20, '2026', 1, 1),
(12, 20, '2027', 1, 1),
(13, 20, '2028', 0, 1),
(14, 19, '2026', 1, 1),
(15, 18, '2028', -2147483648, 0);

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
(7, 18, 1, '43629899', 'NELY', 'BERNILLA CARRILLO', '983352479', 'nelybernilla@gmail.com', 'Ama de casa', 1, NULL),
(8, 20, 1, '46719921', 'DAILITH', 'LOZANO BALSECA', '978812911', 'dailith@gmail.com', 'Empresa Independiente - Jr. 9 de Abril 331', 1, NULL),
(9, 18, 1, '25614523', 'Luciana maria', 'Flores', '965214895', 'nfloresa@gmail.com', 'Ama de casa', 1, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `areas`
--

CREATE TABLE `areas` (
  `id_area` bigint(20) UNSIGNED NOT NULL,
  `nombre_area` varchar(255) DEFAULT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `estado` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `areas`
--

INSERT INTO `areas` (`id_area`, `nombre_area`, `descripcion`, `estado`) VALUES
(1, 'MATEMÁTICA', 'Área de Matemática según currículo nacional', 1),
(2, 'COMUNICACIÓN', 'Área de Comunicación según currículo nacional', 1),
(3, 'INGLÉS', 'Área de Inglés como lengua extranjera', 1),
(4, 'ARTE Y CULTURA', 'Área de Arte y Cultura', 1),
(5, 'PERSONAL SOCIAL', 'Área de Personal Social', 1),
(6, 'EDUCACIÓN FÍSICA', 'Área de Educación Física', 1),
(7, 'EDUCACIÓN RELIGIOSA', 'Área de Educación Religiosa', 1),
(8, 'CIENCIA Y TECNOLOGÍA', 'Área de Ciencia y Tecnología', 1);

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

--
-- Volcado de datos para la tabla `aulas`
--

INSERT INTO `aulas` (`id_aula`, `id_sede`, `nombre_aula`, `capacidad`, `estado`) VALUES
(16, 18, 'UNICA', 20, 1),
(17, 18, 'NO UNICA', 20, 1),
(18, 17, 'Aula 101', 30, 0),
(19, 17, 'Aula 101', 30, 1),
(20, 17, 'Laboratorio 01', 30, 1),
(21, 20, 'Aula 01', 30, 1),
(22, 19, 'Aula 101', 30, 1),
(23, 18, 'AULA 30', 30, 0);

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
  `estado` int(11) DEFAULT NULL,
  `id_sede` bigint(20) DEFAULT NULL
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

--
-- Volcado de datos para la tabla `documentos_alumno`
--

INSERT INTO `documentos_alumno` (`id_doc_alumno`, `id_alumno`, `id_requisito`, `ruta_archivo`, `fecha_subida`, `estado_revision`, `observaciones`, `estado`) VALUES
(6, 25, 1, '/uploads/documentos/7527f1ee-283d-4bb3-8c9f-dad307f85975.jpg', '2026-03-08 00:00:00', NULL, 'jj', 1),
(7, 25, 2, '/uploads/documentos/90a3d18d-3f85-4a29-99fc-97add0a16d87.pdf', '2026-03-08 00:00:00', NULL, 'jojo', 1),
(8, 25, 3, '/uploads/documentos/41748bdf-28c2-4b8f-86a5-0859a2e705ee.pdf', '2026-03-08 00:00:00', NULL, 'juju', 1),
(9, 27, 1, '/uploads/documentos/172653e0-d139-43bd-9380-6099b83c0de7.pdf', '2026-03-10 00:00:00', NULL, '', 1),
(10, 27, 2, '/uploads/documentos/863e501e-8020-41dd-89c8-3771c1d510f9.pdf', '2026-03-10 00:00:00', NULL, '', 1),
(11, 27, 3, '/uploads/documentos/ae01d9e5-dae5-4807-a3d5-9a29d8aef651.pdf', '2026-03-10 00:00:00', NULL, '', 1);

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
(5, 'Arte y Cultura', NULL, 1),
(6, 'Matematicas', '', 1),
(7, 'Comunicación', '', 1);

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

--
-- Volcado de datos para la tabla `grados`
--

INSERT INTO `grados` (`id_grado`, `id_sede`, `nombre_grado`, `estado`) VALUES
(18, 18, 'PRIMER GRADO', 1),
(19, 18, 'SEGUNDO GRADO', 1),
(20, 18, 'TERCER GRADO', 1),
(21, 17, 'Primer grado', 1),
(22, 17, 'segundo grado', 1),
(23, 17, 'TERCER GRADO', 1),
(24, 17, 'CUARTO GRADO', 1),
(25, 17, 'quinto grado', 1),
(26, 18, 'CUARTO GRADO', 1),
(27, 18, 'QUINTO GRADO', 1),
(28, 18, 'SEXTO GRADO', 1),
(29, 17, 'sexto grado', 1),
(30, 19, 'Cuarto Grado', 0),
(31, 17, 'tercer grado', 0),
(32, 17, 'azul', 0),
(33, 16, 'PRIMER GRADO', 1),
(34, 16, 'SEGUNDO GRADO', 1),
(35, 20, 'Primer Grado', 1),
(36, 20, 'Segundo Grado', 1),
(37, 20, 'Tercer Grado', 1),
(38, 19, 'Primer Grado', 1),
(39, 20, 'Cuarto Grado', 1),
(40, 20, 'Quinto Grado', 1),
(41, 20, 'Sexto Grado', 1);

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
(33, 'Institución Educativa Dionicio Ocampo Chavez', '7686879', 'Pública', 'R.D. N° 1234-2024-DRELM', NULL, '/uploads/logos/3171a328-7cdf-4caa-94fe-451e8548cc96.webp', 'la.yajahuanca@unsm.edu.pe', 'Jr. Amargura 321', 'Institución Educativa Dionicio Ocampo Chavez', 'Luis Alberto Yajahuanca Fernandez', '10768687931', '963864860', 1),
(34, 'Institución Educativa Juan Jimenez Pimentel', '0001121', 'Pública', 'R.G.R. N° 9822-1992-GRE-SANMARTIN', NULL, '/uploads/logos/24c837a4-18d5-4ab6-9ce8-773f0eacd511.png', 'juanjimenezpimentel@gmail.com', 'JIRÓN ORELLANA CUADRA 3', 'Institución Educativa Juan Jimenez Pimentel', 'Cristina Berrú Lozano', '10768687912', '960562285', 1),
(35, 'Institución Educativa Santa Rosa 0199', '1230567', 'Pública', 'R.G.R. N° 5678-2005-GRE-BELLAVISTA', NULL, '/uploads/logos/92e0b8f7-6417-4477-8da5-1dd544f7877c.jpeg', 'santarosa@gmail.com', 'Jr. Yurimaguas 123', 'Institución Educativa Santa Rosa', 'Nayelli Yuley Arevalo Romero', '12345678910', '930033324', 1),
(36, 'Institución Educativa San Jose del Alto Mayo', '0246711', 'Pública', 'R.D.R. N° 013456-1991-DRE-NARANJILLO', NULL, '/uploads/logos/1926e255-6dab-43f7-8324-e68e7a9f57ec.jpeg', 'altomayo@gmail.com', 'Jr. Naranjillo 901', 'Institución Educativa San Jose del Alto Mayo', 'Judith Marianella Contreras Bernilla', '28111283911', '981783661', 1),
(37, 'Annie Soper Christian School', '0912811', 'Privada', 'R.D.R. N° 123056-2001-DRE-MOYOBAMBA', NULL, '/uploads/logos/7cf7090b-e30d-41a7-a204-c91bac023c6f.jpeg', 'anniecoper@gmail.com', 'Jr. Alonso de Albarado - Cdra. 1', 'Annie Soper Christian School', 'Martin Muñoz Mozombite', '90118271111', '900128883', 1);

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

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `malla_curricular`
--

CREATE TABLE `malla_curricular` (
  `id_malla` bigint(20) UNSIGNED NOT NULL,
  `id_anio` bigint(20) UNSIGNED NOT NULL,
  `id_grado` bigint(20) UNSIGNED NOT NULL,
  `id_curso` bigint(20) UNSIGNED NOT NULL,
  `estado` int(11) DEFAULT NULL,
  `id_sede` bigint(20) DEFAULT NULL
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
  `estado_matricula` enum('Pendiente_Pago','Activa','Finalizada','Cancelada') NOT NULL,
  `observaciones_matricula` text DEFAULT NULL,
  `fecha_retiro` date DEFAULT NULL,
  `motivo_retiro` text DEFAULT NULL,
  `colegio_destino` varchar(150) DEFAULT NULL,
  `estado` int(11) DEFAULT NULL,
  `fecha_pago_matricula` datetime(6) DEFAULT NULL,
  `fecha_vencimiento_pago` datetime(6) DEFAULT NULL,
  `observaciones` text DEFAULT NULL,
  `tipo_ingreso` enum('Nuevo','Promovido','Repitente','Trasladado_Entrante') NOT NULL,
  `vacante_garantizada` bit(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `matriculas`
--

INSERT INTO `matriculas` (`id_matricula`, `id_alumno`, `id_seccion`, `id_anio`, `codigo_matricula`, `fecha_matricula`, `situacion_academica_previa`, `estado_matricula`, `observaciones_matricula`, `fecha_retiro`, `motivo_retiro`, `colegio_destino`, `estado`, `fecha_pago_matricula`, `fecha_vencimiento_pago`, `observaciones`, `tipo_ingreso`, `vacante_garantizada`) VALUES
(10, 25, 14, 6, 'MAT-2026-5149', '2026-03-08 10:11:37', 'Promovido', 'Activa', NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, 'Nuevo', NULL),
(11, 27, 15, 6, 'MAT-2026-5133', '2026-03-10 14:24:41', 'Promovido', 'Activa', '--', NULL, NULL, NULL, 1, NULL, NULL, NULL, 'Promovido', NULL);

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
-- Estructura de tabla para la tabla `movimientos_alumno`
--

CREATE TABLE `movimientos_alumno` (
  `id_movimiento` bigint(20) NOT NULL,
  `colegio_destino` varchar(200) DEFAULT NULL,
  `documentos_url` varchar(255) DEFAULT NULL,
  `estado` int(11) DEFAULT NULL,
  `estado_solicitud` enum('Pendiente','Aprobada','Rechazada') DEFAULT NULL,
  `fecha_aprobacion` datetime(6) DEFAULT NULL,
  `fecha_movimiento` date NOT NULL,
  `fecha_solicitud` datetime(6) DEFAULT NULL,
  `id_usuario_aprobador` bigint(20) DEFAULT NULL,
  `id_usuario_registro` bigint(20) DEFAULT NULL,
  `motivo` text NOT NULL,
  `observaciones` text DEFAULT NULL,
  `tipo_movimiento` enum('Retiro','Traslado_Saliente','Cambio_Seccion') NOT NULL,
  `id_matricula` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

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
(1, NULL, '271cb14f-4662-473d-a4f8-a0555372a112.jpeg', 1, 'VERIFICADO', '2026-03-07', '2026-03-07 14:50:25.000000', '2026-03-07 15:14:40', 10.00, '000049100', 'PAGO-00001', 'Pago programado automáticamente - Período 1 de 3', 2, 30, 1),
(2, NULL, NULL, 1, 'PENDIENTE', '2026-04-07', '2026-03-07 14:50:25.000000', NULL, 10.00, NULL, 'PAGO-00002', 'Pago programado automáticamente - Período 2 de 3', NULL, 30, NULL),
(3, NULL, NULL, 1, 'PENDIENTE', '2026-05-07', '2026-03-07 14:50:25.000000', NULL, 10.00, NULL, 'PAGO-00003', 'Pago programado automáticamente - Período 3 de 3', NULL, 30, NULL),
(4, NULL, NULL, 0, 'PENDIENTE', '2025-01-01', '2026-03-07 20:31:53.000000', NULL, 100.00, NULL, 'PAGO-00004', 'Pago programado automáticamente - Período 1 de 3', NULL, 31, NULL),
(5, NULL, NULL, 0, 'PENDIENTE', '2026-01-01', '2026-03-07 20:31:53.000000', NULL, 100.00, NULL, 'PAGO-00005', 'Pago programado automáticamente - Período 2 de 3', NULL, 31, NULL),
(6, NULL, NULL, 0, 'PENDIENTE', '2027-01-01', '2026-03-07 20:31:53.000000', NULL, 100.00, NULL, 'PAGO-00006', 'Pago programado automáticamente - Período 3 de 3', NULL, 31, NULL),
(92, NULL, '2826e70c-cd00-4769-806a-f6900cdbd293.webp', 1, 'VERIFICADO', '2026-03-01', '2026-03-07 20:41:45.000000', '2026-03-07 20:44:10', 100.00, '000049101', 'PAGO-00092', 'Pago programado automáticamente - Período 1 de 2', 1, 31, 1),
(93, NULL, NULL, 1, 'PENDIENTE', '2027-01-01', '2026-03-07 20:41:45.000000', NULL, 100.00, NULL, 'PAGO-00093', 'Pago programado automáticamente - Período 2 de 2', NULL, 31, NULL),
(94, NULL, '7aa855ac-1382-46db-8845-61f0b4b7ec8d.webp', 1, 'VERIFICADO', '2026-03-01', '2026-03-07 21:02:41.000000', '2026-03-07 21:07:20', 15.00, '000004', 'PAGO-00094', 'Pago programado automáticamente - Período 1 de 10', 1, 32, 1),
(95, NULL, NULL, 1, 'PENDIENTE', '2026-04-01', '2026-03-07 21:02:41.000000', NULL, 15.00, NULL, 'PAGO-00095', 'Pago programado automáticamente - Período 2 de 10', NULL, 32, NULL),
(96, NULL, NULL, 1, 'PENDIENTE', '2026-05-01', '2026-03-07 21:02:41.000000', NULL, 15.00, NULL, 'PAGO-00096', 'Pago programado automáticamente - Período 3 de 10', NULL, 32, NULL),
(97, NULL, NULL, 1, 'PENDIENTE', '2026-06-01', '2026-03-07 21:02:41.000000', NULL, 15.00, NULL, 'PAGO-00097', 'Pago programado automáticamente - Período 4 de 10', NULL, 32, NULL),
(98, NULL, NULL, 1, 'PENDIENTE', '2026-07-01', '2026-03-07 21:02:41.000000', NULL, 15.00, NULL, 'PAGO-00098', 'Pago programado automáticamente - Período 5 de 10', NULL, 32, NULL),
(99, NULL, NULL, 1, 'PENDIENTE', '2026-08-01', '2026-03-07 21:02:41.000000', NULL, 15.00, NULL, 'PAGO-00099', 'Pago programado automáticamente - Período 6 de 10', NULL, 32, NULL),
(100, NULL, NULL, 1, 'PENDIENTE', '2026-09-01', '2026-03-07 21:02:41.000000', NULL, 15.00, NULL, 'PAGO-00100', 'Pago programado automáticamente - Período 7 de 10', NULL, 32, NULL),
(101, NULL, NULL, 1, 'PENDIENTE', '2026-10-01', '2026-03-07 21:02:41.000000', NULL, 15.00, NULL, 'PAGO-00101', 'Pago programado automáticamente - Período 8 de 10', NULL, 32, NULL),
(102, NULL, NULL, 1, 'PENDIENTE', '2026-11-01', '2026-03-07 21:02:41.000000', NULL, 15.00, NULL, 'PAGO-00102', 'Pago programado automáticamente - Período 9 de 10', NULL, 32, NULL),
(103, NULL, NULL, 1, 'PENDIENTE', '2026-12-01', '2026-03-07 21:02:41.000000', NULL, 15.00, NULL, 'PAGO-00103', 'Pago programado automáticamente - Período 10 de 10', NULL, 32, NULL),
(104, NULL, '5710e3e9-743e-4046-8874-0932f20c50bc.webp', 1, 'VERIFICADO', '2026-03-07', '2026-03-07 21:14:18.000000', '2026-03-07 21:14:51', 120.00, '000005', 'PAGO-00104', 'Pago programado automáticamente - Período 1 de 2', 1, 33, 1),
(105, NULL, NULL, 1, 'PENDIENTE', '2026-04-07', '2026-03-07 21:14:18.000000', NULL, 120.00, NULL, 'PAGO-00105', 'Pago programado automáticamente - Período 2 de 2', NULL, 33, NULL),
(106, NULL, '05af0804-11e8-465f-9339-8d0d5610d273.webp', 1, 'VERIFICADO', '2026-03-01', '2026-03-07 21:18:56.000000', '2026-03-07 21:21:02', 190.00, '000006', 'PAGO-00106', 'Pago programado automáticamente - Período 1 de 13', 1, 34, 1),
(107, NULL, '34561049-1924-4059-8a4b-3e9807afb54b.webp', 1, 'VERIFICADO', '2026-04-01', '2026-03-07 21:18:56.000000', '2026-03-08 03:24:41', 190.00, '000001', 'PAGO-00107', 'Pago programado automáticamente - Período 2 de 13', 1, 34, 1),
(108, NULL, NULL, 1, 'PENDIENTE', '2026-05-01', '2026-03-07 21:18:56.000000', NULL, 190.00, NULL, 'PAGO-00108', 'Pago programado automáticamente - Período 3 de 13', NULL, 34, NULL),
(109, NULL, NULL, 1, 'PENDIENTE', '2026-06-01', '2026-03-07 21:18:56.000000', NULL, 190.00, NULL, 'PAGO-00109', 'Pago programado automáticamente - Período 4 de 13', NULL, 34, NULL),
(110, NULL, NULL, 1, 'PENDIENTE', '2026-07-01', '2026-03-07 21:18:56.000000', NULL, 190.00, NULL, 'PAGO-00110', 'Pago programado automáticamente - Período 5 de 13', NULL, 34, NULL),
(111, NULL, NULL, 1, 'PENDIENTE', '2026-08-01', '2026-03-07 21:18:56.000000', NULL, 190.00, NULL, 'PAGO-00111', 'Pago programado automáticamente - Período 6 de 13', NULL, 34, NULL),
(112, NULL, NULL, 1, 'PENDIENTE', '2026-09-01', '2026-03-07 21:18:56.000000', NULL, 190.00, NULL, 'PAGO-00112', 'Pago programado automáticamente - Período 7 de 13', NULL, 34, NULL),
(113, NULL, NULL, 1, 'PENDIENTE', '2026-10-01', '2026-03-07 21:18:56.000000', NULL, 190.00, NULL, 'PAGO-00113', 'Pago programado automáticamente - Período 8 de 13', NULL, 34, NULL),
(114, NULL, NULL, 1, 'PENDIENTE', '2026-11-01', '2026-03-07 21:18:56.000000', NULL, 190.00, NULL, 'PAGO-00114', 'Pago programado automáticamente - Período 9 de 13', NULL, 34, NULL),
(115, NULL, NULL, 1, 'PENDIENTE', '2026-12-01', '2026-03-07 21:18:56.000000', NULL, 190.00, NULL, 'PAGO-00115', 'Pago programado automáticamente - Período 10 de 13', NULL, 34, NULL),
(116, NULL, NULL, 1, 'PENDIENTE', '2027-01-01', '2026-03-07 21:18:56.000000', NULL, 190.00, NULL, 'PAGO-00116', 'Pago programado automáticamente - Período 11 de 13', NULL, 34, NULL),
(117, NULL, NULL, 1, 'PENDIENTE', '2027-02-01', '2026-03-07 21:18:56.000000', NULL, 190.00, NULL, 'PAGO-00117', 'Pago programado automáticamente - Período 12 de 13', NULL, 34, NULL),
(118, NULL, NULL, 1, 'PENDIENTE', '2027-03-01', '2026-03-07 21:18:56.000000', NULL, 190.00, NULL, 'PAGO-00118', 'Pago programado automáticamente - Período 13 de 13', NULL, 34, NULL);

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

--
-- Volcado de datos para la tabla `perfil_docente`
--

INSERT INTO `perfil_docente` (`id_docente`, `id_usuario`, `id_especialidad`, `grado_academico`, `fecha_contratacion`, `estado_laboral`, `estado`) VALUES
(8, 40, 1, '1', '2026-03-10', 'Activo', 1);

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
(11, 6, 'Primer Bimestre', '2026-02-27', '2026-04-10', 1),
(12, 7, 'primer bimestre', '2026-03-04', '2026-12-23', 0),
(13, 7, 'segundo bimestre', '2026-03-10', '2026-06-17', 0),
(14, 7, 'primer bimestre', '2026-03-16', '2026-05-29', 1),
(15, 7, 'segundo bimestre', '2026-06-01', '2026-07-31', 1),
(16, 7, 'tercer bimestre', '2026-10-01', '2026-11-12', 1),
(17, 11, 'Primer Bimestre', '2026-03-21', '2026-05-21', 1),
(18, 7, 'Cuarto bimestre', '2026-11-16', '2026-12-31', 1),
(19, 12, 'Primer Bimestre', '2026-03-21', '2026-05-21', 0),
(20, 12, 'Primer Trimestre', '2026-03-21', '2026-06-21', 1),
(21, 14, 'Primer Bimestre', '2026-03-28', '2026-05-28', 1);

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
(77, 'Oicapse', 'Raletse', 'cristina.berru2909@gmail.com', 'a3f6dce08f697343638e24738b8fea591c4b7f7bf691750dde801f658cc0777a', '$2a$10$wtrV3DRrgOf0SlsgeEjsTuZzfnNVeFe5pewRh55QVogjRjulEAP/2', 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhM2Y2ZGNlMDhmNjk3MzQzNjM4ZTI0NzM4YjhmZWE1OTFjNGI3ZjdiZjY5MTc1MGRkZTgwMWY2NThjYzA3NzdhIiwiaWF0IjoxNzczMDg5NTA0LCJleHAiOjQ5MjY2ODk1MDR9.o03QAAGm5Itir4n7N0BEdpfnAPtEnPUiCFfB5k8I-P4', 1),
(78, 'bebesita', 'owo', 'bebesitaowo@gmail.com', 'f9d565878eeb7078c3a6df8c965e82a21e9a6cb1fee79af4062a1518e957a8d8', '$2a$10$dO3nDcLx5zBrs0O2JqDWM.RaBljMvMBjYStJbfv4ROc5FOHWFc3ae', 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJmOWQ1NjU4NzhlZWI3MDc4YzNhNmRmOGM5NjVlODJhMjFlOWE2Y2IxZmVlNzlhZjQwNjJhMTUxOGU5NTdhOGQ4IiwiaWF0IjoxNzczMDkwMTQ3LCJleHAiOjQ5MjY2OTAxNDd9.ay5KiTmDQGoLXNYQJNI_30lsVymomdNvNpcyPZeRX_o', 1),
(79, 'Luis Alberto', 'Yajahuanca Fernandez', 'luisalbertoyajahuancafernandez@gmail.com', 'd74efe61db9f9e134ed4aeae861a450cc3d1cf7e3b3da95d45d23d14149c04ae', '$2a$10$.OcrBGAPKBwHoqGScOHVZOZUf7xWqqkNotUZBjkGZzQTFLcIkmZOm', 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJkNzRlZmU2MWRiOWY5ZTEzNGVkNGFlYWU4NjFhNDUwY2MzZDFjZjdlM2IzZGE5NWQ0NWQyM2QxNDE0OWMwNGFlIiwiaWF0IjoxNzczMTE2NzMyLCJleHAiOjQ5MjY3MTY3MzJ9.mbqznFBhhfs4Bpu4L3az2ENsPqTgSUDgtwb3XY5XlOA', 1),
(80, 'Luis Alberto', 'Yajahuanca Fernandez', 'luisalbertoyajahuancafernandez@gmail.com', 'd74efe61db9f9e134ed4aeae861a450cc3d1cf7e3b3da95d45d23d14149c04ae', '$2a$10$jpcqHMkHdS1cMZASefXTf.XaN0a/rpbtgZKsoDZzKh9LwSXZV2VrO', '', 1),
(81, 'Luis ', 'Yajahuanca', 'luajahuancafernandez@gmail.com', 'b881f274333107752599aad1e9d4cad154e465a7a67e84593595e25b0222a557', '$2a$10$isKL.4DyAwjWhi2Xj4K2GOh.abWOPa9PRaWNGVUDzoEwU/x3fe8uS', 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJiODgxZjI3NDMzMzEwNzc1MjU5OWFhZDFlOWQ0Y2FkMTU0ZTQ2NWE3YTY3ZTg0NTkzNTk1ZTI1YjAyMjJhNTU3IiwiaWF0IjoxNzczMTE2NzcyLCJleHAiOjQ5MjY3MTY3NzJ9.MkHGdSxmLVpWNE4DdjJ6zB1QJgXDU6xgEsKhnAdMr0o', 1),
(82, 'Samuel', 'chois', 'choisue@gmail.com', '675294c92564e474de5d13712337f9710576f8aed249c3c784f1434367433411', '$2a$10$tvv/YglHbIOAK0vVims2VevgrCwxSMoR1pRdCLRv5h1/2KHRdIomu', 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI2NzUyOTRjOTI1NjRlNDc0ZGU1ZDEzNzEyMzM3Zjk3MTA1NzZmOGFlZDI0OWMzYzc4NGYxNDM0MzY3NDMzNDExIiwiaWF0IjoxNzczMTE2OTU3LCJleHAiOjQ5MjY3MTY5NTd9.PivjjOzyXaIahyBkFqy_o46FBvQbhar8XmghdyrOgFA', 1),
(83, 'brrr', 'brrr', 'brrr@gmail.com', 'ac781632cee4038b15a4eaa9e07b2a3c3b0db37645feefae5479715102702a6f', '$2a$10$ua3MeiqhD2el9AjuLwJO1OK0JMB7SeugAtEf1svj8IsxXK19L1d8u', 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhYzc4MTYzMmNlZTQwMzhiMTVhNGVhYTllMDdiMmEzYzNiMGRiMzc2NDVmZWVmYWU1NDc5NzE1MTAyNzAyYTZmIiwiaWF0IjoxNzczMTY3NDc4LCJleHAiOjQ5MjY3Njc0Nzh9.wT48YyskqIdpFJigxgRs2KR5sGmvDksNsBz8jAM9arI', 1),
(84, 'aaaa', 'q', 'aaaq@gmail.com', '93e85a5cd1fdcf06afc01efe97179f684f4eb454517baf87423abe5b93b3c3dc', '$2a$10$qJ.g8ZDrZ2d7tdmuK/AqIuUawU3MTuUu.gIYpoeHRVZk7GfooJY2e', 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI5M2U4NWE1Y2QxZmRjZjA2YWZjMDFlZmU5NzE3OWY2ODRmNGViNDU0NTE3YmFmODc0MjNhYmU1YjkzYjNjM2RjIiwiaWF0IjoxNzczMTk4MjgzLCJleHAiOjQ5MjY3OTgyODN9.nIpZOGrB3AvV_9PeDZvb6lxtEmGdPuVRX-aaJ0q7IMI', 1);

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
(14, 10, 3, 1),
(32, 1, 1, 1),
(33, 1, 2, 1),
(34, 1, 3, 1),
(35, 1, 4, 1),
(36, 1, 5, 1),
(37, 1, 6, 1),
(38, 1, 7, 1),
(39, 1, 8, 1),
(56, 3, 5, 1),
(57, 2, 7, 1);

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
(14, 18, 18, 'A', 20, 1),
(15, 18, 18, 'B', 20, 1),
(16, 18, 18, 'C', 20, 1),
(17, 21, 17, 'A', 30, 1),
(18, 21, 17, 'B', 30, 1),
(19, 22, 17, 'B', 30, 1),
(20, 21, 17, 'ROJO', 30, 1),
(21, 29, 17, 'azul', 30, 1),
(22, 21, 17, 'C', 30, 1),
(23, 23, 17, 'verde', 30, 1),
(24, 33, 16, 'A', 30, 1),
(25, 33, 16, 'B', 30, 1),
(26, 35, 20, 'Sección A', 2, 1),
(28, 35, 20, 'Sección B', 8, 1),
(29, 38, 19, 'A', 10, 1);

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
(16, 33, 'Sede Luis', 'jr.amargura', 'Yantalo', 'Moyobamba', 'San Martin', 'UGEL 01', '963864860', 'sede@yantalo.com', 1, '0000', b'1'),
(17, 35, 'Sede Nayelli', 'Jr. Centro Poblado de Bellavista 211', 'Bellavista', 'Bellavista', 'San Martin', 'UGEL SAN MARTIN', '921672345', 'santarosa@gmail.com', 1, '0000', b'1'),
(18, 36, 'Sede Judith', 'Centro Poblado Naranjillo', 'Nueva Cajamarca', 'Rioja', 'San Martin', 'UGEL SAN MARTIN', '911021145', 'sedejudith@gmail.com', 1, '0000', b'1'),
(19, 37, 'Sede Martin', 'Jiron Alonso de Alvarado C1', 'Moyobamba', 'Moyobamba', 'San Martin', 'UGEL MOYOBAMBA', '912761388', 'sedemartin@gmail.com', 1, '0000', b'1'),
(20, 34, 'Sede Cristina', 'Jr. 9 de abril 331', 'Tarapoto', 'Tarapoto', 'San Martin', 'UGEL SAN MARTIN', '960562285', 'sedecristina@gmail.com', 1, '0000', b'1');

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
(1, 'Judith Mari', 'Contreras Bernilla', 'judithmarianella@unsm.edu.pe', 'judithmar', '$2a$10$P/QT5Bq.B1.iGh3TlZU8JefkC46nTt5huOQ9Kro84e2BTxNaSMDAO', 'SUPER_ADMIN', 1, '/uploads/perfiles/f932e7ee-086e-4005-88d3-8d612c8458e7.jpeg'),
(2, 'Cristina', 'Berru Lozano', 'cristina.berru2909@gmail.com', 'Oicapse', '$2a$10$/hDSfEN2G.wpYVot7Y2Oe.R21jVVIKGxYOf8vISeEF3crYymg0A5W', 'SUPER_ADMIN', 1, '/uploads/perfiles/2230bed9-fc1c-455e-aee9-d111eac29edf.jpeg'),
(3, 'Martin', 'Muñoz', 'Martin@gmail.com', 'Marki', '$2a$10$CUI4zR5fe9fKillz97DHB.1SxCosglMacAuA/JYRcfRzl2kRoucw2', 'ADMIN', 1, NULL),
(4, 'Nayelli Yuley ', 'Arevalo Romero', 'nay@gmail.com', 'Nay', '$2a$10$TGpoFgm5GQ6PzNerFX.bD.WYzBSR3Nx16.IbqIe3hhsJMMg.OEkwq', 'ADMIN', 1, NULL),
(5, 'Luis', 'YF', 'luisalbertoyajahuancafernandez@gmail.com', 'alberto', '$2a$10$1L4y68zZpK3b8WX59z998epSn.fndtgYLuyADtGku1ZkZ8KvC7qIe', 'ADMIN', 1, ''),
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
(30, 33, 3, 1, 1, 5, 1, 10.00, '2026-03-07', '2026-06-07', 1, 'EQUITATIVA'),
(31, 35, 3, 2, 1, 10, 1, 100.00, '2026-01-01', '2028-01-01', 1, 'EQUITATIVA'),
(32, 36, 3, 1, 1, 10, 1, 15.00, '2026-03-01', '2027-01-01', 1, 'EQUITATIVA'),
(33, 37, 3, 1, 1, 10, 2, 120.00, '2026-03-07', '2026-05-07', 1, 'EQUITATIVA'),
(34, 34, 3, 1, 1, 10, 2, 190.00, '2026-03-01', '2027-04-01', 1, 'EQUITATIVA');

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
(1, 16, 1, 1, '76868793', 'YAJAHUANCA FERNANDEZ', 'LUIS ALBERTO', 'luisalbertoyajahuancafernandez@gmail.com', 'luis', '$2a$10$6oAG0zgT8b8cIzVvlRvFJOzdJtJSF.ezF7Hc4GlPJgvP3DcH.lXiK', '', 1),
(33, 17, 1, 1, '76269185', 'AREVALO ROMERO', 'NAYELLI YULEY', 'ny.arevaloro@unsm.edu.pe', 'Nay', '$2a$10$2QEgmsAeHRm0fKDHRdR3eu50/O/bDJhhrj5TL4mi9fCThx.Rt4UJa', '', 1),
(34, 18, 1, 1, '77219351', 'CONTRERAS BERNILLA', 'JUDITH MARIANELLA', 'jm.contrerasbe@unsm.edu.pe', 'Mari', '$2a$10$sPWwnybQ1Rxg2ECy2Xx9eeQ.wa.CP.hltlkritILlwgKV8pk2Iq8O', '/uploads/logos/04cf002d-114d-44cc-b2cb-ab9cd2d11bbb.jpg', 1),
(35, 19, 1, 1, '72240942', 'MUÑOZ MOZOMBITE', 'MARTIN', 'm.munozmo@unsm.edu.pe', 'Marki', '$2a$10$C1ONoK7QbjJoD071lgMEcuP3YOZjFfvBoFRkr.veWk4Y8vjdZLgdm', '', 1),
(36, 20, 1, 1, '74654276', 'BERRU LOZANO', 'CRISTINA', 'c.berrulo@unsm.edu.pe', 'Cristina', '$2a$10$n/VetLlNLpYD4YzbmjQgLOWzWS1jMyHAfkOl5vgqVq1iJ6dnXiYTC', '/uploads/perfiles/ccee2997-a49f-43d7-a2ed-773de7b65c78.jpg', 1),
(37, 16, 2, 1, '44551223', 'yajahuanca', 'LUCHO 2', 'luchoyaja@gmail.com', 'profesor1', 'profesor123', NULL, 1),
(38, 18, 2, 1, '74512698', 'profe', 'pepito', 'pepito@unsm.edu.pe', 'pepito', '$2a$10$p2CuAejpkRJGsolEdYCJOeoNEKjWDxUITejiaXgU6AoUTRRZS0IWW', NULL, 1),
(39, 18, 2, 1, '45621398', 'Flores', 'Juan', 'juancitoflore@gmail.com', 'juancito', '$2a$10$/8nMMTOpfeKmRCEfm/LCoOeGWYuW47vWO5MFA5C4zROJJkRaXQ3F2', NULL, 1),
(40, 20, 3, 1, '74654271', 'Raletse', 'Oicapse', 'cristina@gmail.com', 'Pwp', '$2a$10$OAS5jxnq7ieibD4ylFe4vOlIi03oI54lcqPDiH0cGnI/bJmolqS5q', NULL, 1),
(41, 16, 2, 1, '74522253', 'setooo', 'juan', 'juanceto@gmail.com', 'juancetoo', 'juancetoo123', NULL, 1);

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
  ADD PRIMARY KEY (`id_area`);

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
  ADD KEY `fk_curso_area` (`id_area`),
  ADD KEY `idx_cursos_sede` (`id_sede`),
  ADD KEY `idx_cursos_area` (`id_area`);

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
-- Indices de la tabla `movimientos_alumno`
--
ALTER TABLE `movimientos_alumno`
  ADD PRIMARY KEY (`id_movimiento`);

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
  MODIFY `id_alumno` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT de la tabla `alumno_apoderado`
--
ALTER TABLE `alumno_apoderado`
  MODIFY `id_alum_apod` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `anio_escolar`
--
ALTER TABLE `anio_escolar`
  MODIFY `id_anio_escolar` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `apoderados`
--
ALTER TABLE `apoderados`
  MODIFY `id_apoderado` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `areas`
--
ALTER TABLE `areas`
  MODIFY `id_area` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `asignacion_docente`
--
ALTER TABLE `asignacion_docente`
  MODIFY `id_asignacion` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `asistencias`
--
ALTER TABLE `asistencias`
  MODIFY `id_asistencia` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `aulas`
--
ALTER TABLE `aulas`
  MODIFY `id_aula` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT de la tabla `calificaciones`
--
ALTER TABLE `calificaciones`
  MODIFY `id_calificacion` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

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
  MODIFY `id_curso` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT de la tabla `deudas_alumno`
--
ALTER TABLE `deudas_alumno`
  MODIFY `id_deuda` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `documentos_alumno`
--
ALTER TABLE `documentos_alumno`
  MODIFY `id_doc_alumno` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `especialidades`
--
ALTER TABLE `especialidades`
  MODIFY `id_especialidad` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `estados_suscripcion`
--
ALTER TABLE `estados_suscripcion`
  MODIFY `id_estado` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `evaluaciones`
--
ALTER TABLE `evaluaciones`
  MODIFY `id_evaluacion` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `grados`
--
ALTER TABLE `grados`
  MODIFY `id_grado` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- AUTO_INCREMENT de la tabla `horarios`
--
ALTER TABLE `horarios`
  MODIFY `id_horario` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `institucion`
--
ALTER TABLE `institucion`
  MODIFY `id_institucion` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT de la tabla `limites_sedes_suscripcion`
--
ALTER TABLE `limites_sedes_suscripcion`
  MODIFY `id_limite_sede` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `malla_curricular`
--
ALTER TABLE `malla_curricular`
  MODIFY `id_malla` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT de la tabla `matriculas`
--
ALTER TABLE `matriculas`
  MODIFY `id_matricula` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

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
-- AUTO_INCREMENT de la tabla `movimientos_alumno`
--
ALTER TABLE `movimientos_alumno`
  MODIFY `id_movimiento` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `pagos_caja`
--
ALTER TABLE `pagos_caja`
  MODIFY `id_pago` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `pagos_suscripcion`
--
ALTER TABLE `pagos_suscripcion`
  MODIFY `id_pago` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=119;

--
-- AUTO_INCREMENT de la tabla `pago_detalle`
--
ALTER TABLE `pago_detalle`
  MODIFY `id_pago_detalle` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `perfil_docente`
--
ALTER TABLE `perfil_docente`
  MODIFY `id_docente` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `periodos`
--
ALTER TABLE `periodos`
  MODIFY `id_periodo` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

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
  MODIFY `idregistro` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=85;

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
  MODIFY `id_rol_modulo` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=58;

--
-- AUTO_INCREMENT de la tabla `secciones`
--
ALTER TABLE `secciones`
  MODIFY `id_seccion` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT de la tabla `sedes`
--
ALTER TABLE `sedes`
  MODIFY `id_sede` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT de la tabla `super_admins`
--
ALTER TABLE `super_admins`
  MODIFY `id_admin` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT de la tabla `suscripciones`
--
ALTER TABLE `suscripciones`
  MODIFY `id_suscripcion` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

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
  MODIFY `id_usuario` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

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
