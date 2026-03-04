// Feature: Alumnos (Portal)
// Exporta todas las utilidades relacionadas con la gestión de alumnos

// Tipos
export type { Alumno, AlumnoApoderado, AlumnoApoderadoDTO, AlumnoApoderadoFormData, AlumnoDTO, AlumnoFormData, Sede, TipoDocumento } from './types';

// API
export {
    actualizarAlumno,
    crearAlumno,
    eliminarAlumno,
    obtenerAlumnoPorId, obtenerSedes,
    obtenerTiposDocumento, obtenerTodosAlumnos
} from './api/alumnosApi';

// API Alumno-Apoderado
export {
    actualizarRelacion, crearRelacion, eliminarRelacion, obtenerAlumnosPorApoderado, obtenerApoderadosPorAlumno, obtenerRelacionPorId, obtenerTodasRelaciones
} from './api/alumnoApoderadoApi';

// Hooks
export { useAlumnos } from './hooks/useAlumnos';

// Componentes
export { default as AlumnoForm } from './components/AlumnoForm';

// Páginas
export { default as AlumnoApoderadoPage } from './pages/AlumnoApoderadoPage';
export { default as AlumnosPage } from './pages/AlumnosPage';

