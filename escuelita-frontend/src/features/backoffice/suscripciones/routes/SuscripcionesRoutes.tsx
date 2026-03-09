import { Navigate, Route, Routes } from 'react-router-dom';

// Páginas del módulo
import DetalleInstitucionPagosPage from '../pages/DetalleInstitucionPagosPage';
import PagosInstitucionesPage from '../pages/PagosInstitucionesPage';
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
            <Route path="instituciones" element={<PagosInstitucionesPage />} />
            <Route path="instituciones/:idInstitucion" element={<DetalleInstitucionPagosPage />} />
            
            {/* Ruta 404 dentro del módulo */}
            <Route path="*" element={<Navigate to="activas" replace />} />
        </Routes>
    );
};

export default SuscripcionesRoutes;
