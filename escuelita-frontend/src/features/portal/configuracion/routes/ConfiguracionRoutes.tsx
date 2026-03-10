import { Navigate, Route, Routes } from 'react-router-dom';
import ModuloGuard from '../../../../hooks/ModuloGuard';
import { escuelaAuthService } from '../../../../services/escuelaAuth.service';
import AnioEscolarPage from '../../infraestructura/pages/AnioEscolarPage';
import InstitucionPage from '../../infraestructura/pages/InstitucionPage';
import PeriodosPage from '../../infraestructura/pages/PeriodosPage';
import SedesPage from '../../infraestructura/pages/SedesPage';
import TipoDocumentosPage from '../../infraestructura/pages/TipoDocumentosPage';
import PermisosUsuariosPage from '../../usuarios/pages/PermisosUsuariosPage';
import RolesUsuariosPage from '../../usuarios/pages/RolesUsuariosPage';
import UsuariosPage from '../../usuarios/pages/UsuariosPage';

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

                {/* Submodulos de Configuración */}
                <Route path="institucion" element={<InstitucionPage />} />
                <Route path="sedes" element={<SedesPage />} />
                <Route path="anio-escolar" element={<AnioEscolarPage />} />
                <Route path="periodos" element={<PeriodosPage />} />
                <Route path="tipo-documentos" element={<TipoDocumentosPage />} />

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
