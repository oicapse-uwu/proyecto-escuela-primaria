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
    ALUMNOS: '/restful/alumnos',
    APODERADOS: '/restful/apoderados',
    CURSOS: '/restful/cursos',
    
    // Agregar otros endpoints aquí según se vaya implementando
};

// Configuración adicional de la aplicación
export const APP_CONFIG = {
    NAME: 'Escuela Primaria',
    VERSION: '1.0.0',
};