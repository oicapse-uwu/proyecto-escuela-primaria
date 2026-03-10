import { Navigate, Route, Routes } from 'react-router-dom';
import ModuloGuard from '../../../../hooks/ModuloGuard';
import { escuelaAuthService } from '../../../../services/escuelaAuth.service';
import AreasPage from '../../areas/pages/AreasPage';
import CursosPage from '../../areas/pages/CursosPage';
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
                <Route index element={<Navigate to="areas-cursos" replace />} />

                {/* Redirigir areas-cursos a la página de áreas por defecto */}
                <Route path="areas-cursos" element={<Navigate to="/escuela/gestion-academica/areas" replace />} />
                
                {/* Rutas separadas para Áreas y Cursos */}
                <Route path="areas" element={<AreasPage />} />
                <Route path="cursos" element={<CursosPage />} />
                
                <Route path="especialidades" element={<EspecialidadesPage />} />
                <Route path="malla-curricular" element={<MallaCurricularPage />} />
                <Route path="docentes" element={<DocentesPage />} />
                <Route path="asignacion-docente" element={<AsignacionDocentePage />} />
                <Route path="horarios" element={<HorariosPage />} />

                <Route path="*" element={<Navigate to="areas" replace />} />
            </Routes>
        </ModuloGuard>
    );
};

export default GestionAcademicaRoutes;
