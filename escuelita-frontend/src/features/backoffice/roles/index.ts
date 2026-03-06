// Exportaciones principales del módulo de Roles y Módulos (Arquitectura Simplificada)

// Types
export * from './types';

// API
export {
    obtenerModulosRol,
    asignarModulosRol
} from './api/rolesMatrizApi';

// Hooks
export { useMatrizRol } from './hooks/useMatrizRol';

// Components
export { default as ModulosAsignacionEditor } from './components/ModulosAsignacionEditor';

// Pages
export { default as MatrizRolesPage } from './pages/MatrizRolesPage';

// Routes
export { default as RolesRoutes } from './routes/RolesRoutes';
