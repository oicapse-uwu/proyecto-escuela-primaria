import { Route, Routes, Navigate } from 'react-router-dom';
import ModuloGuard from '../../../../hooks/ModuloGuard';
import { escuelaAuthService } from '../../../../services/escuelaAuth.service';
import ApoderadosPage from '../pages/ApoderadosPage';

const ApoderadosRoutes = () => {
  const currentUser = escuelaAuthService.getCurrentUser();
  
  return (
    <ModuloGuard 
      requiereModulo={5}
      idUsuario={currentUser?.idUsuario ?? null}
      fallback={<Navigate to="/escuela/dashboard" replace />}
    >
      <Routes>
        <Route path="/" element={<ApoderadosPage />} />
      </Routes>
    </ModuloGuard>
  );
};

export default ApoderadosRoutes;
