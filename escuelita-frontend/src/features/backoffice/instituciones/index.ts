// Exportaciones del módulo de Instituciones

// Types
export type { Institucion, InstitucionDTO, InstitucionFormData } from './types';

// API
export {
    actualizarInstitucion, crearInstitucion, eliminarInstitucion, obtenerInstitucionPorId, obtenerTodasInstituciones
} from './api/institucionesApi';

// Hooks
export { useInstituciones } from './hooks/useInstituciones';

// Components
export { default as InstitucionForm } from './components/InstitucionForm';

// Pages
export { default as InstitucionesPage } from './pages/InstitucionesPage';

// Routes
export { default as InstitucionesRoutes } from './routes/InstitucionesRoutes';