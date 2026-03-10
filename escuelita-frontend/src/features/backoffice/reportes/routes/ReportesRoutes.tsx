import { Navigate, Route, Routes } from 'react-router-dom';
import ReportesLayout from '../layouts/ReportesLayout';
import AlumnosReportePage from '../pages/AlumnosReportePage.tsx';
import EstadisticasGeneralesPage from '../pages/EstadisticasGeneralesPage.tsx';
import IngresosPage from '../pages/IngresosPage.tsx';
import PagosSuscripcionPage from '../pages/PagosSuscripcionPage.tsx';
import ReporteAcademicoPage from '../pages/ReporteAcademicoPage.tsx';
import SaludComercialPage from '../pages/SaludComercialPage.tsx';
import UsoSistemaPage from '../pages/UsoSistemaPage.tsx';

const ReportesRoutes = () => {
    return (
        <Routes>
            <Route element={<ReportesLayout />}>
                <Route index element={<Navigate to="estadisticas" replace />} />
                <Route path="ejecutivo" element={<EstadisticasGeneralesPage />} />
                <Route path="estadisticas" element={<EstadisticasGeneralesPage />} />
                <Route path="uso" element={<UsoSistemaPage />} />
                <Route path="ingresos" element={<IngresosPage />} />
                <Route path="academico" element={<ReporteAcademicoPage />} />
                <Route path="salud-comercial" element={<SaludComercialPage />} />
                <Route path="pagos-suscripcion" element={<PagosSuscripcionPage />} />
                <Route path="alumnos" element={<AlumnosReportePage />} />
            </Route>
            <Route path="*" element={<Navigate to="estadisticas" replace />} />
        </Routes>
    );
};

export default ReportesRoutes;
