// Tipos
export type { Alumno, AlumnoDTO, AlumnoFormData, Sede, TipoDocumento } from './types';

// API
export {
    actualizarAlumno, crearAlumno, eliminarAlumno, obtenerAlumnoPorId, obtenerTodosAlumnos
} from './api/alumnosApi';

// Hooks
export { useAlumnos } from './hooks/useAlumnos';