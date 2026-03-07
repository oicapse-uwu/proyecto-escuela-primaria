import axios from 'axios';

// Configuración de la instancia de Axios para la API
export const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://primaria.spring.informaticapp.com:4040',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor de solicitudes para agregar token de autenticación
api.interceptors.request.use(
    (config) => {
        const currentPath = window.location.pathname;
        let token = null;

        if (currentPath.startsWith('/admin')) {
            token = localStorage.getItem('admin_token');
        } else if (currentPath.startsWith('/escuela')) {
            token = localStorage.getItem('escuela_token');
        } else {
            token =
                localStorage.getItem('admin_token') ||
                localStorage.getItem('escuela_token');
        }

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Maneja errores globales
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
            localStorage.removeItem('escuela_token');
            localStorage.removeItem('escuela_user');
            localStorage.removeItem('admin_token');
            localStorage.removeItem('admin_user');

            const currentPath = window.location.pathname;

            if (currentPath.startsWith('/admin')) {
                window.location.href = '/login';
            } else {
                window.location.href = '/escuela/login';
            }
        }

        return Promise.reject(error);
    }
);

// ================= ENDPOINTS =================
export const API_ENDPOINTS = {
    // ===== BACKOFFICE (SUPER ADMIN) =====
    INSTITUCIONES: '/restful/institucion',
    SUSCRIPCIONES: '/restful/suscripciones',
    USUARIOS: '/restful/usuarios',
    SUPER_ADMINS: '/restful/superadmins',
    PAGOS_CAJA: '/restful/pagoscaja',
    PLANES: '/restful/planes',
    ESTADOS_SUSCRIPCION: '/restful/estadossuscripcion',
    CICLOS_FACTURACION: '/restful/ciclosfacturacion',
    SEDES: '/restful/sedes',
    TIPOS_DOCUMENTO: '/restful/tipodocumentos',
    ROLES: '/restful/roles',
    PERMISOS: '/restful/permisos',
    MODULOS: '/restful/modulos',
    ROL_MODULO_PERMISO: '/restful/rolmodulopermiso',
    FILES_UPLOAD: '/restful/files/upload',

    // ===== PORTAL ESCUELA =====
    ALUMNOS: '/restful/alumnos',
    APODERADOS: '/restful/apoderados',
    ALUMNO_APODERADO: '/restful/alumnoapoderado',
    MATRICULAS: '/restful/matriculas',
    CURSOS: '/restful/cursos',

    // ===== INFRAESTRUCTURA =====
    ANIO_ESCOLAR: '/restful/anioescolar',
    PERIODOS: '/restful/periodos',
    GRADOS: '/restful/grados',
    SECCIONES: '/restful/secciones',
    AULAS: '/restful/aulas',
    REQUISITOS_DOCUMENTOS: '/restful/requisitosdocumentos',
    DOCUMENTOS_ALUMNO: '/restful/documentosalumno',

    // ===== TESORERÍA =====
    CONCEPTOS_PAGO: '/restful/conceptospago',
    DEUDAS_ALUMNO: '/restful/deudasalumno',
    METODOS_PAGO: '/restful/metodospago',
    PAGOS: '/restful/pagoscaja',
};

// Configuración adicional
export const APP_CONFIG = {
    NAME: 'Escuela Primaria',
    VERSION: '1.0.0',
};