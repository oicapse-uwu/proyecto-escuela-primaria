import { Navigate, Route, Routes } from 'react-router-dom';
import ModuloGuard from '../../../../hooks/ModuloGuard';
import { escuelaAuthService } from '../../../../services/escuelaAuth.service';
import AnioEscolarPage from '../pages/AnioEscolarPage';
import AulasPage from '../pages/AulasPage';
import GradosPage from '../pages/GradosPage';
import GradosSeccionesPage from '../pages/GradosSeccionesPage';
import InstitucionPage from '../pages/InstitucionPage';
import PeriodosPage from '../pages/PeriodosPage';
import SedesPage from '../pages/SedesPage';
import SeccionesPage from '../pages/SeccionesPage';

const InfraestructuraRoutes = () => {
    const currentUser = escuelaAuthService.getCurrentUser();
    
    return (
        <ModuloGuard 
            requiereModulo={3}
            idUsuario={currentUser?.idUsuario ?? null}
            fallback={<Navigate to="/escuela/dashboard" replace />}
        >
            <Routes>
                <Route index element={<Navigate to="sedes" replace />} />

                <Route path="institucion" element={<InstitucionPage />} />
                <Route path="sedes" element={<SedesPage />} />
                <Route path="anio-escolar" element={<AnioEscolarPage />} />
                <Route path="periodos" element={<PeriodosPage />} />
                <Route path="grados-secciones" element={<GradosSeccionesPage />} />
                <Route path="grados" element={<GradosPage />} />
                <Route path="secciones" element={<SeccionesPage />} />
                <Route path="aulas" element={<AulasPage />} />

                <Route path="*" element={<Navigate to="sedes" replace />} />
            </Routes>
        </ModuloGuard>
    );
};

export default InfraestructuraRoutes;