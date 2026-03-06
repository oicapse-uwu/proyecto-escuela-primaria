import { Route, Routes, Navigate } from 'react-router-dom';
import ModuloGuard from '../../../../hooks/ModuloGuard';
import { escuelaAuthService } from '../../../../services/escuelaAuth.service';
import AreasPage from '../pages/AreasPage';

const AreasRoutes = () => {
    const currentUser = escuelaAuthService.getCurrentUser();
    
    return (
        <ModuloGuard 
            requiereModulo={4}
            idUsuario={currentUser?.idUsuario ?? null}
            fallback={<Navigate to="/escuela/dashboard" replace />}
        >
            <Routes>
                <Route path="/" element={<AreasPage />} />
            </Routes>
        </ModuloGuard>
    );
};

export default AreasRoutes;