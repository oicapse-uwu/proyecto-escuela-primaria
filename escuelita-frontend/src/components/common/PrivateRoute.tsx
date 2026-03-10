import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { adminAuthService } from '../../services/adminAuth.service';
import { escuelaAuthService } from '../../services/escuelaAuth.service';

interface PrivateRouteProps {
    children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
    const location = useLocation();
    
    // Determinar si es ruta de admin
    const isAdminRoute = location.pathname.startsWith('/admin');
    
    // Verificar autenticación según la ruta
    const isAuthenticated = isAdminRoute 
        ? adminAuthService.isAuthenticated()
        : escuelaAuthService.isAuthenticated();

    // Debug log para entender redirecciones silenciosas
    try {
        console.log('[PrivateRoute] isAdminRoute:', isAdminRoute, 'isAuthenticated:', isAuthenticated, 'path:', location.pathname);
    } catch {}
    
    // Redireccionar al login correspondiente si no está autenticado
    if (!isAuthenticated) {
        const loginPath = isAdminRoute ? '/login' : '/escuela/login';
        return <Navigate to={loginPath} replace />;
    }

    return <>{children}</>;
};

export default PrivateRoute;
