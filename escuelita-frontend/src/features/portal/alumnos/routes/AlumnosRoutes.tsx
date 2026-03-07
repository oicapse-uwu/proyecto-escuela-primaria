import { Route, Routes, Navigate } from 'react-router-dom';
import ModuloGuard from '../../../../hooks/ModuloGuard';
import { escuelaAuthService } from '../../../../services/escuelaAuth.service';
import AlumnoApoderadoPage from '../pages/AlumnoApoderadoPage';
import AlumnoDetallePage from '../pages/AlumnoDetallePage';
import AlumnosPage from '../pages/AlumnosPage';

const AlumnosRoutes = () => {
  const currentUser = escuelaAuthService.getCurrentUser();
  
  return (
    <ModuloGuard 
      requiereModulo={5}
      idUsuario={currentUser?.idUsuario ?? null}
      fallback={<Navigate to="/escuela/dashboard" replace />}
    >
      <Routes>
        <Route path="/" element={<AlumnosPage />} />
        <Route path="/:id" element={<AlumnoDetallePage />} />
        <Route path="/relacion-apoderado" element={<AlumnoApoderadoPage />} />
      </Routes>
    </ModuloGuard>
  );
};

export default AlumnosRoutes;
