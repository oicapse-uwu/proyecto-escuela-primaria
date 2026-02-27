// Feature: Alumnos (Portal)
// Exporta todas las utilidades relacionadas con la gestión de alumnos

// Tipos
export type { Alumno, AlumnoDTO, AlumnoFormData, Sede, TipoDocumento } from './types';
// API
export {
    actualizarAlumno, crearAlumno, eliminarAlumno, obtenerAlumnoPorId, obtenerTodosAlumnos
} from './api/alumnosApi';
// Hooks
export { useAlumnos } from './hooks/useAlumnos';
