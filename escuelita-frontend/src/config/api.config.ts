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
        // Detectar el contexto según la ruta actual del navegador
        const currentPath = window.location.pathname;
        let token = null;
        
        if (currentPath.startsWith('/admin')) {
            // Si estamos en rutas de admin, usar el token de admin
            token = localStorage.getItem('admin_token');
        } else if (currentPath.startsWith('/escuela')) {
            // Si estamos en rutas de escuela, usar el token de escuela
            token = localStorage.getItem('escuela_token');
        } else {
            // Fallback: usar el que esté disponible
            token = localStorage.getItem('admin_token') || localStorage.getItem('escuela_token');
        }
        
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Maneja errores globales
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Si el token es inválido o expiró (401)
        if (error.response?.status === 401) {
            // Limpiar tokens
            localStorage.removeItem('escuela_token');
            localStorage.removeItem('escuela_user');
            localStorage.removeItem('admin_token');
            localStorage.removeItem('admin_user');
            
            // Redirigir al login correspondiente según la ruta actual
            const currentPath = window.location.pathname;
            if (currentPath.startsWith('/admin')) {
                window.location.href = '/login';
            } else if (currentPath.startsWith('/escuela')) {
                window.location.href = '/escuela/login';
            } else {
                // Por defecto, redirigir al login de escuela
                window.location.href = '/escuela/login';
            }
        }
        return Promise.reject(error);
    }
);

// Endpoints de la API
export const API_ENDPOINTS = {
    // Endpoints backoffice (super-admins)
    INSTITUCIONES: '/restful/institucion',
    SUSCRIPCIONES: '/restful/suscripciones',
    USUARIOS: '/restful/usuarios',
    SUPER_ADMINS: '/restful/superadmins',
    PAGOS_CAJA: '/restful/pagoscaja',
    PLANES: '/restful/planes',
    ESTADOS_SUSCRIPCION: '/restful/estadossuscripcion',
    CICLOS_FACTURACION: '/restful/ciclosfacturacion',
    METODOS_PAGO: '/restful/metodospago',
    SEDES: '/restful/sedes',
    TIPOS_DOCUMENTO: '/restful/tipodocumentos',
    ROLES: '/restful/roles',
    FILES_UPLOAD: '/restful/files/upload',

    // Endpoints portal (escuelas)
    ALUMNOS: '/restful/alumnos',
    APODERADOS: '/restful/apoderados',
    ALUMNO_APODERADO: '/restful/alumnoapoderado',
    MATRICULAS: '/restful/matriculas',
    SECCIONES: '/restful/secciones',
    ANIO_ESCOLAR: '/restful/anioescolar',
    REQUISITOS_DOCUMENTOS: '/restful/requisitosdocumentos',
    DOCUMENTOS_ALUMNO: '/restful/documentosalumno',
    CURSOS: '/restful/cursos',
};

// Configuración adicional de la aplicación
export const APP_CONFIG = {
    NAME: 'Escuela Primaria',
    VERSION: '1.0.0',
};