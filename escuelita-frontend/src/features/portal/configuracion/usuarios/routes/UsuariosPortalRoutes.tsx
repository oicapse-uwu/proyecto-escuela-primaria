import { Route, Routes, Navigate } from 'react-router-dom';
import ModuloGuard from '../../../../../hooks/ModuloGuard';
import { escuelaAuthService } from '../../../../../services/escuelaAuth.service';
import PermisosUsuariosPage from '../pages/PermisosUsuariosPage';
import RolesUsuariosPage from '../pages/RolesUsuariosPage';
import UsuariosPage from '../pages/UsuariosPage';

const UsuariosPortalRoutes = () => {
    const currentUser = escuelaAuthService.getCurrentUser();
    
    return (
        <ModuloGuard 
            requiereModulo={2}
            idUsuario={currentUser?.idUsuario ?? null}
            fallback={<Navigate to="/escuela/dashboard" replace />}
        >
            <Routes>
                <Route path="/" element={<UsuariosPage />} />
                <Route path="roles" element={<RolesUsuariosPage />} />
                <Route path="permisos" element={<PermisosUsuariosPage />} />
            </Routes>
        </ModuloGuard>
    );
};

export default UsuariosPortalRoutes;
