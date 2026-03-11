import { Navigate, Route, Routes } from 'react-router-dom';
import ModuloGuard from '../../../../hooks/ModuloGuard';
import { escuelaAuthService } from '../../../../services/escuelaAuth.service';
import PermisosUsuariosPage from '../usuarios/pages/PermisosUsuariosPage';
import RolesUsuariosPage from '../usuarios/pages/RolesUsuariosPage';
import UsuariosPage from '../usuarios/pages/UsuariosPage';

const ConfiguracionRoutes = () => {
    const currentUser = escuelaAuthService.getCurrentUser();

    return (
        <ModuloGuard
            requiereModulo={2}
            idUsuario={currentUser?.idUsuario ?? null}
            fallback={<Navigate to="/escuela/dashboard" replace />}
        >
            <Routes>
                <Route index element={<Navigate to="usuarios" replace />} />

                {/* Usuarios y Roles */}
                <Route path="usuarios" element={<UsuariosPage />} />
                <Route path="usuarios/roles" element={<RolesUsuariosPage />} />
                <Route path="usuarios/permisos" element={<PermisosUsuariosPage />} />

                <Route path="*" element={<Navigate to="usuarios" replace />} />
            </Routes>
        </ModuloGuard>
    );
};

export default ConfiguracionRoutes;
