// Exportaciones del módulo de Deudas de Alumnos

// Types
export type { DeudasAlumno, DeudasAlumnoDTO, DeudasAlumnoFormData } from './types';

// API
export {
    actualizarDeudasAlumno, crearDeudasAlumno, eliminarDeudasAlumno, obtenerDeudasAlumnoPorId, obtenerTodasDeudasAlumnos
} from './api/deudasAlumnosApi';

// Hooks
export { useDeudasAlumnos } from './hooks/useDeudasAlumnos';

// Components
export { default as DeudasAlumnoForm } from './components/DeudasAlumnoForm';

// Pages
export { default as DeudasAlumnosPage } from './pages/DeudasAlumnosPage';

// Routes
export { default as DeudasAlumnosRoutes } from './routes/DeudasAlumnosRoutes';
