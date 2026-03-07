import { Navigate, Route, Routes } from 'react-router-dom';

// Páginas del módulo
import DetalleInstitucionPagosPage from '../pages/DetalleInstitucionPagosPage';
import FacturacionPage from '../pages/FacturacionPage';
import PagosInstitucionesPage from '../pages/PagosInstitucionesPage';
import PagosPendientesPage from '../pages/PagosPendientesPage';
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
            <Route path="instituciones" element={<PagosInstitucionesPage />} />
            <Route path="instituciones/:idInstitucion" element={<DetalleInstitucionPagosPage />} />
            
            {/* Ruta 404 dentro del módulo */}
            <Route path="*" element={<Navigate to="activas" replace />} />
        </Routes>
    );
};

export default SuscripcionesRoutes;
