// Exportaciones principales del módulo de Usuarios del Sistema

// Types
export * from './types';

// API
export {
    actualizarUsuarioSistema,
    actualizarRol,
    actualizarSuperAdmin,
    crearUsuarioSistema,
    crearRol,
    crearSuperAdmin,
    eliminarUsuarioSistema,
    eliminarRol,
    eliminarSuperAdmin,
    obtenerRoles,
    obtenerSedes,
    obtenerSuperAdmins,
    obtenerTiposDocumento,
    obtenerUsuariosSistema
} from './api/usuariosApi';

// Hooks
export { useRoles } from './hooks/useRoles';
export { useSuperAdmins } from './hooks/useSuperAdmins';
export { useUsuariosSistema } from './hooks/useUsuariosSistema';

// Components
export { default as AdministradorForm } from './components/AdministradorForm';
export { default as RolForm } from './components/RolForm';
export { default as SuperAdminForm } from './components/SuperAdminForm';

// Pages
export { default as AdministradoresPage } from './pages/AdministradoresPage';
export { default as RolesPermisosPage } from './pages/RolesPermisosPage';
export { default as SuperAdminsPage } from './pages/SuperAdminsPage';

// Routes
export { default as UsuariosRoutes } from './routes/UsuariosRoutes';
