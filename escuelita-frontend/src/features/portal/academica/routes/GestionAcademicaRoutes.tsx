import { Navigate, Route, Routes } from 'react-router-dom';
import ModuloGuard from '../../../../hooks/ModuloGuard';
import { escuelaAuthService } from '../../../../services/escuelaAuth.service';
import AreasPage from '../../areas/pages/AreasPage';
import EspecialidadesPage from '../../especialidades/pages/EspecialidadesPage';
import AsignacionDocentePage from '../pages/AsignacionDocentePage';
import DocentesPage from '../pages/DocentesPage';
import HorariosPage from '../pages/HorariosPage';
import MallaCurricularPage from '../pages/MallaCurricularPage';

const GestionAcademicaRoutes = () => {
    const currentUser = escuelaAuthService.getCurrentUser();

    return (
        <ModuloGuard
            requiereModulo={4}
            idUsuario={currentUser?.idUsuario ?? null}
            fallback={<Navigate to="/escuela/dashboard" replace />}
        >
            <Routes>
                <Route index element={<Navigate to="/escuela/academica/areas-cursos" replace />} />

                <Route path="areas-cursos" element={<AreasPage />} />
                <Route path="especialidades" element={<EspecialidadesPage />} />
                <Route path="malla-curricular" element={<MallaCurricularPage />} />
                <Route path="docentes" element={<DocentesPage />} />
                <Route path="asignacion-docente" element={<AsignacionDocentePage />} />
                <Route path="horarios" element={<HorariosPage />} />

                {/* Alias para compatibilidad con rutas antiguas */}
                <Route path="malla" element={<Navigate to="/escuela/academica/malla-curricular" replace />} />
                <Route path="asignacion" element={<Navigate to="/escuela/academica/asignacion-docente" replace />} />

                <Route path="*" element={<Navigate to="/escuela/academica/areas-cursos" replace />} />
            </Routes>
        </ModuloGuard>
    );
};

export default GestionAcademicaRoutes;
