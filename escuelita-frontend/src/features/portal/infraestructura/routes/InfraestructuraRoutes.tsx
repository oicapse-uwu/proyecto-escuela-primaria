import { Navigate, Route, Routes } from 'react-router-dom';
import ModuloGuard from '../../../../hooks/ModuloGuard';
import { escuelaAuthService } from '../../../../services/escuelaAuth.service';
import AnioEscolarPeriodosPage from '../pages/AnioEscolarPeriodosPage';
import GradosSeccionesAulasPage from '../pages/GradosSeccionesAulasPage';
import InstitucionPage from '../pages/InstitucionPage';

const InfraestructuraRoutes = () => {
    const currentUser = escuelaAuthService.getCurrentUser();
    
    return (
        <ModuloGuard 
            requiereModulo={3}
            idUsuario={currentUser?.idUsuario ?? null}
            fallback={<Navigate to="/escuela/dashboard" replace />}
        >
            <Routes>
                <Route index element={<Navigate to="institucion" replace />} />

                <Route path="institucion" element={<InstitucionPage />} />
                <Route path="anio-periodos" element={<AnioEscolarPeriodosPage />} />
                <Route path="grados-secciones" element={<GradosSeccionesAulasPage />} />

                <Route path="*" element={<Navigate to="institucion" replace />} />
            </Routes>
        </ModuloGuard>
    );
};

export default InfraestructuraRoutes;