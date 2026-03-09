import { Route, Routes, Navigate } from 'react-router-dom';
import ModuloGuard from '../../../../hooks/ModuloGuard';
import { escuelaAuthService } from '../../../../services/escuelaAuth.service';
import CalificacionesPage from '../pages/CalificacionesPage';
import AsistenciasPage from '../pages/AsistenciasPage';
import AsistenciasReportePage from '../pages/AsistenciasReportePage';
import EvaluacionesPage from '../pages/EvaluacionesPage';
import PromediosPage from '../pages/PromediosPage';

const EvaluacionesRoutes = () => {
  const currentUser = escuelaAuthService.getCurrentUser();

  return (
    <ModuloGuard
      requiereModulo={7}
      idUsuario={currentUser?.idUsuario ?? null}
      fallback={<Navigate to="/escuela/dashboard" replace />}
    >
      <Routes>
        <Route path="/calificaciones" element={<CalificacionesPage />} />
        <Route path="/asistencias" element={<AsistenciasPage />} />
        <Route path="/asistencias-reporte" element={<AsistenciasReportePage />} />
        <Route path="/evaluaciones" element={<EvaluacionesPage />} />
        <Route path="/promedios" element={<PromediosPage />} />
        <Route
          path="/"
          element={<Navigate to="/escuela/evaluaciones/calificaciones" replace />}
        />
      </Routes>
    </ModuloGuard>
  );
};

export default EvaluacionesRoutes;
