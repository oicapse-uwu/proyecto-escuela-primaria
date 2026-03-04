// Exportaciones principales del módulo de Roles y Matriz de Permisos

// Types
export * from './types';

// API
export {
    obtenerMatrizRol,
    actualizarMatrizRol
} from './api/rolesMatrizApi';

// Hooks
export { useMatrizRol } from './hooks/useMatrizRol';

// Components
export { default as MatrizRolEditor } from './components/MatrizRolEditor';

// Pages
export { default as MatrizRolesPage } from './pages/MatrizRolesPage';

// Routes
export { default as RolesRoutes } from './routes/RolesRoutes';
