import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { escuelaAuthService } from '../../services/escuelaAuth.service';
import { useModulosPermisos } from '../../hooks/useModulosPermisos';
import { Lock, AlertCircle } from 'lucide-react';

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

    // Si no está autenticado en ruta de escuela, redirigir a login
    if (isEscuelaRoute && !isAuthenticated) {
        return <Navigate to="/escuela/login" replace />;
    }

    // SuperAdmin (rol_id=1) siempre tiene acceso a todos los módulos
    if (usuario?.rol?.idRol === 1) {
        return <>{children}</>;
    }

    // Para otros roles, cargar módulos del usuario
    const { modulosPermisos, isLoading: loadingPermisos, error } = useModulosPermisos(usuario?.idUsuario || null);

    useEffect(() => {
        setIsLoading(loadingPermisos);
    }, [loadingPermisos]);

    // Si aún está cargando, mostrar loading
    if (isLoading) {
        return (
            <div className="w-full h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Cargando módulos...</p>
                </div>
            </div>
        );
    }

    // Si hay un error al cargar módulos, mostrar error
    if (error) {
        return (
            <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="text-center max-w-md px-6">
                    <div className="mb-6 flex justify-center">
                        <div className="bg-yellow-100 p-4 rounded-full">
                            <AlertCircle className="w-12 h-12 text-yellow-600" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Error al Cargar Módulos</h1>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <p className="text-sm text-gray-500 mb-6">
                        Por favor, intenta recargando la página
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition"
                    >
                        Recargar Página
                    </button>
                </div>
            </div>
        );
    }

    // Verificar si el usuario tiene acceso al módulo
    const tieneAcceso = modulosPermisos?.modulos?.some(m => m.idModulo === requiredModule) || false;

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
                    <p className="text-gray-600 mb-2">
                        No tienes permiso para acceder a este módulo.
                    </p>
                    <p className="text-sm text-gray-500 mb-6">
                        Módulos disponibles: {modulosPermisos?.modulos?.length || 0}
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
