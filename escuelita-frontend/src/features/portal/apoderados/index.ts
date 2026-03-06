// Feature: Apoderados (Portal)
// Exporta todas las utilidades relacionadas con la gestión de apoderados

// Tipos
export type { Apoderado, ApoderadoDTO, ApoderadoFormData, Sede, TipoDocumento } from './types';

// API
export {
    actualizarApoderado,
    crearApoderado,
    eliminarApoderado,
    obtenerApoderadoPorId, obtenerSedes,
    obtenerTiposDocumento, obtenerTodosApoderados
} from './api/apoderadosApi';

// Hooks
export { useApoderados } from './hooks/useApoderados';

// Routes
export { default as ApoderadosRoutes } from './routes/apoderados.routes';
