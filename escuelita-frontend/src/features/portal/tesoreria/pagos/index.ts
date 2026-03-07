// Exportaciones del módulo de Pagos

// Types
export type { PagosCaja, PagoFormData, PagosDTO, PagoDetalle } from './types';

// API
export {
    actualizarPago, crearPago, eliminarPago, obtenerPagoPorId, obtenerTodosPagos
} from './api/pagosApi';

// Hooks
export { usePagos } from './hooks/usePagos';

// Components
export { default as PagoForm } from './components/PagoForm';

// Pages
export { default as PagosPage } from './pages/PagosPage';

// Routes
export { default as PagosRoutes } from './routes/PagosRoutes';
