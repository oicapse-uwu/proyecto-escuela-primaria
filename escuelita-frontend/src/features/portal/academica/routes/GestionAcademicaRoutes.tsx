import { Navigate, Route, Routes } from 'react-router-dom';
import ModuloGuard from '../../../../hooks/ModuloGuard';
import { escuelaAuthService } from '../../../../services/escuelaAuth.service';
import AreasRoutes from '../areas/routes/areas.routes';
import AsignacionDocenteRoutes from '../asignacion-docente/routes';
import DocentesRoutes from '../docentes/routes';
import EspecialidadesRoutes from '../especialidades/routes/especialidades.routes';
import HorariosRoutes from '../horarios/routes';
import MallaCurricularRoutes from '../malla-curricular/routes';

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
                <Route path="areas-cursos/*" element={<AreasRoutes />} />
                <Route path="malla-curricular/*" element={<MallaCurricularRoutes />} />
                <Route path="docentes/*" element={<DocentesRoutes />} />
                <Route path="especialidades/*" element={<EspecialidadesRoutes />} />
                <Route path="asignacion-docente/*" element={<AsignacionDocenteRoutes />} />
                <Route path="horarios/*" element={<HorariosRoutes />} />
                <Route path="*" element={<Navigate to="areas-cursos" replace />} />
            </Routes>
        </ModuloGuard>
    );
};

export default GestionAcademicaRoutes;
