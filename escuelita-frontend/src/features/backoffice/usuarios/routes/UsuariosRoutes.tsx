import { Navigate, Route, Routes } from 'react-router-dom';
import AdministradoresPage from '../pages/AdministradoresPage';
import RolesPermisosPage from '../pages/RolesPermisosPage';
import SuperAdminsPage from '../pages/SuperAdminsPage';

const UsuariosRoutes = () => {
    return (
        <Routes>
            <Route index element={<Navigate to="super-admins" replace />} />
            <Route path="super-admins" element={<SuperAdminsPage />} />
            <Route path="administradores" element={<AdministradoresPage />} />
            <Route path="roles" element={<RolesPermisosPage />} />
            <Route path="*" element={<Navigate to="super-admins" replace />} />
        </Routes>
    );
};

export default UsuariosRoutes;
