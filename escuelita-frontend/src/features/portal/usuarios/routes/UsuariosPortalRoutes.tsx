import { Route, Routes } from 'react-router-dom';
import PermisosUsuariosPage from '../pages/PermisosUsuariosPage';
import RolesUsuariosPage from '../pages/RolesUsuariosPage';
import UsuariosPage from '../pages/UsuariosPage';

const UsuariosPortalRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<UsuariosPage />} />
            <Route path="roles" element={<RolesUsuariosPage />} />
            <Route path="permisos" element={<PermisosUsuariosPage />} />
        </Routes>
    );
};

export default UsuariosPortalRoutes;
