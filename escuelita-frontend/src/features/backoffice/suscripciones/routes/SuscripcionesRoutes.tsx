import { Navigate, Route, Routes } from 'react-router-dom';

// Páginas del módulo
import FacturacionPage from '../pages/FacturacionPage';
import PagosPendientesPage from '../pages/PagosPendientesPage';
import PagosSuscripcionesPage from '../pages/PagosSuscripcionesPage';
import PlanesPage from '../pages/PlanesPage';
import SuscripcionesActivasPage from '../pages/SuscripcionesActivasPage';

const SuscripcionesRoutes = () => {
    return (
        <Routes>
            {/* Redirección por defecto a activas */}
            <Route index element={<Navigate to="activas" replace />} />
            
            {/* Rutas del módulo */}
            <Route path="planes" element={<PlanesPage />} />
            <Route path="activas" element={<SuscripcionesActivasPage />} />
            <Route path="facturacion" element={<FacturacionPage />} />
            <Route path="pendientes" element={<PagosPendientesPage />} />
            <Route path="pagos" element={<PagosSuscripcionesPage />} />
            
            {/* Ruta 404 dentro del módulo */}
            <Route path="*" element={<Navigate to="activas" replace />} />
        </Routes>
    );
};

export default SuscripcionesRoutes;
