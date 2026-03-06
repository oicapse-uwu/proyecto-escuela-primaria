import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { escuelaAuthService } from '../../services/escuelaAuth.service';
import { useModulosPermisos } from '../../hooks/useModulosPermisos';
import { Lock } from 'lucide-react';

interface ModuloRouteProps {
    children: React.ReactNode;
    requiredModule: number; // ID del módulo requerido
}

const ModuloRoute: React.FC<ModuloRouteProps> = ({ children, requiredModule }) => {
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(true);

    // Solo aplica a rutas de escuela
    const isEscuelaRoute = location.pathname.startsWith('/escuela');

    // Verificar autenticación
    const isAuthenticated = escuelaAuthService.isAuthenticated();
    const usuario = escuelaAuthService.getCurrentUser();

    // Cargar módulos del usuario
    const { modulosPermisos, isLoading: loadingPermisos } = useModulosPermisos(usuario?.idUsuario || null);

    useEffect(() => {
        setIsLoading(loadingPermisos);
    }, [loadingPermisos]);

    // Si no está autenticado en ruta de escuela, redirigir a login
    if (isEscuelaRoute && !isAuthenticated) {
        return <Navigate to="/escuela/login" replace />;
    }

    // Si aún está cargando, mostrar loading
    if (isLoading) {
        return (
            <div className="w-full h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Cargando...</p>
                </div>
            </div>
        );
    }

    // Verificar si el usuario tiene acceso al módulo
    const tieneAcceso = modulosPermisos?.modulos.some(m => m.idModulo === requiredModule) || false;

    if (!tieneAcceso) {
        return (
            <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="text-center max-w-md px-6">
                    <div className="mb-6 flex justify-center">
                        <div className="bg-red-100 p-4 rounded-full">
                            <Lock className="w-12 h-12 text-red-600" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Acceso Denegado</h1>
                    <p className="text-gray-600 mb-6">
                        No tienes permiso para acceder a este módulo. Contacta con tu administrador si crees que es un error.
                    </p>
                    <a
                        href="/escuela/dashboard"
                        className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition"
                    >
                        Volver al Dashboard
                    </a>
                </div>
            </div>
        );
    }

    return <>{children}</>;
};

export default ModuloRoute;
