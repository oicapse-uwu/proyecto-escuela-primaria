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
        // Obtener token del localStorage
        const token = localStorage.getItem('token');
        
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
            localStorage.removeItem('token');
        // Redirigir a página de token (cambiar ruta)
            window.location.href = '/token';
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