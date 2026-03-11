import axios from 'axios';
import { adminAuthService } from '../services/adminAuth.service';
import { escuelaAuthService } from '../services/escuelaAuth.service';

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
        // Determinar el token correcto según el contexto de la URL actual
        let token: string | null = null;
        const currentPath = window.location.pathname;
        
        // Si estamos en rutas de admin (/admin/* o /login), usar token de admin
        if (currentPath.startsWith('/admin') || currentPath === '/login') {
            token = adminAuthService.getToken();
            if (!token) {
                token = localStorage.getItem('admin_token');
            }
        } 
        // Si estamos en rutas de escuela (/escuela/*), usar token de escuela
        else if (currentPath.startsWith('/escuela')) {
            token = escuelaAuthService.getToken();
            if (!token) {
                token = localStorage.getItem('escuela_token');
            }
        }
        // Fallback: usar cualquier token disponible
        else {
            if (escuelaAuthService.isAuthenticated()) {
                token = escuelaAuthService.getToken();
            } else if (adminAuthService.isAuthenticated()) {
                token = adminAuthService.getToken();
            } else {
                token = localStorage.getItem('escuela_token') || localStorage.getItem('admin_token');
            }
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
        const requestUrl = error.config?.url || '';

        // No interceptar 401/403 en endpoints de autenticación (login)
        const isAuthEndpoint = requestUrl.includes('/auth/');

        if (!isAuthEndpoint && (error.response?.status === 401 || error.response?.status === 403)) {
            localStorage.removeItem('escuela_token');
            localStorage.removeItem('escuela_user');
            localStorage.removeItem('admin_token');
            localStorage.removeItem('admin_user');

            const currentPath = window.location.pathname;

            if (currentPath.startsWith('/admin') || currentPath === '/login') {
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
    MOVIMIENTOS_ALUMNO: '/restful/movimientos-alumno',
    CURSOS: '/restful/cursos',
    GRADOS: '/restful/grados',
    SECCIONES: '/restful/secciones',
    AULAS: '/restful/aulas',
    AREAS: '/restful/areas',
    HORARIOS: '/restful/horarios',
    ASIGNACION_DOCENTE: '/restful/asignaciondocente',
    PERFIL_DOCENTE: '/restful/perfildocente',
    MALLA_CURRICULAR: '/restful/mallacurricular',
    MALLA_CURRICULAR_GRADOS: '/restful/mallacurricular/grados',
    MALLA_CURRICULAR_ANIOS: '/restful/mallacurricular/anios',
    ESPECIALIDADES: '/restful/especialidades',

    // ===== INFRAESTRUCTURA =====
    ANIO_ESCOLAR: '/restful/anioescolar',
    PERIODOS: '/restful/periodos',
    REQUISITOS_DOCUMENTOS: '/restful/requisitosdocumentos',
    DOCUMENTOS_ALUMNO: '/restful/documentosalumno',

    // ===== EVALUACIONES Y CALIFICACIONES =====
    CALIFICACIONES: '/restful/calificaciones',
    PROMEDIOS: '/restful/promediosperiodo',
    ASISTENCIAS: '/restful/asistencias',
    TIPOS_NOTA: '/restful/tiposnota',
    EVALUACIONES: '/restful/evaluaciones',
    TIPOS_EVALUACION: '/restful/tiposevaluacion',

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