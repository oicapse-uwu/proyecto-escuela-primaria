import { Route, Routes, Navigate } from 'react-router-dom';
import ModuloGuard from '../../../../hooks/ModuloGuard';
import { escuelaAuthService } from '../../../../services/escuelaAuth.service';
import MatriculasPage from '../pages/MatriculasPage';
import RequisitosPage from '../pages/RequisitosPage';

const MatriculasRoutes = () => {
  const currentUser = escuelaAuthService.getCurrentUser();
  
  return (
    <ModuloGuard 
      requiereModulo={6}
      idUsuario={currentUser?.idUsuario ?? null}
      fallback={<Navigate to="/escuela/dashboard" replace />}
    >
      <Routes>
        <Route path="/" element={<MatriculasPage />} />
        <Route path="/requisitos" element={<RequisitosPage />} />
      </Routes>
    </ModuloGuard>
  );
};

export default MatriculasRoutes;
