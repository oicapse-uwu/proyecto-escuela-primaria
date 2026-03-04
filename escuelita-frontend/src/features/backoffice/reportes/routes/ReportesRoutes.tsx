import { Navigate, Route, Routes } from 'react-router-dom';
import EstadisticasGeneralesPage from '../pages/EstadisticasGeneralesPage.tsx';
import IngresosPage from '../pages/IngresosPage.tsx';
import UsoSistemaPage from '../pages/UsoSistemaPage.tsx';

const ReportesRoutes = () => {
    return (
        <Routes>
            <Route index element={<Navigate to="ejecutivo" replace />} />
            <Route path="ejecutivo" element={<EstadisticasGeneralesPage />} />
            <Route path="estadisticas" element={<EstadisticasGeneralesPage />} />
            <Route path="uso" element={<UsoSistemaPage />} />
            <Route path="ingresos" element={<IngresosPage />} />
            <Route path="*" element={<Navigate to="ejecutivo" replace />} />
        </Routes>
    );
};

export default ReportesRoutes;
