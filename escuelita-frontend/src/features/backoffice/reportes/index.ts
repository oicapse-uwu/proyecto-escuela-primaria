// Exportaciones principales del módulo de Reportes

// Types
export * from './types';

// API
export {
    obtenerInstitucionesReporte,
    obtenerSuperAdminsReporte,
    obtenerSuscripcionesReporte,
    obtenerUsuariosReporte
} from './api/reportesApi';

// Hooks
export { useReportes } from './hooks/useReportes';

// Pages
export { default as EstadisticasGeneralesPage } from './pages/EstadisticasGeneralesPage.tsx';
export { default as UsoSistemaPage } from './pages/UsoSistemaPage.tsx';
export { default as IngresosPage } from './pages/IngresosPage.tsx';

// Routes
export { default as ReportesRoutes } from './routes/ReportesRoutes';
