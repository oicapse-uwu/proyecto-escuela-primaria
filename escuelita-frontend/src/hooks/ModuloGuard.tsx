import React, { useMemo } from 'react';
import { useModulosPermisos } from './useModulosPermisos';
import { escuelaAuthService } from '../services/escuelaAuth.service';

interface ModuloGuardProps {
    requiereModulo: number;
    children: React.ReactNode;
    fallback?: React.ReactNode;
    idUsuario: number | null;
}

/**
 * Componente guard que protege contenido basado en módulos
 * - Para EscuelaUsuarios: Valida que tengan acceso al módulo específico
 * - Para AdminUsers: Permite acceso a todos los módulos (son super users)
 */
const ModuloGuard: React.FC<ModuloGuardProps> = ({ 
    requiereModulo,
    children, 
    fallback,
    idUsuario 
}) => {
    const { tieneModulo, isLoading } = useModulosPermisos(idUsuario);
    
    // Detectar si el usuario es un admin (usuario de /admin route)
    const esAdmin = useMemo(() => {
        const user = escuelaAuthService.getCurrentUser();
        // Si el usuario tiene un token en admin_token, es un admin
        const isAdminToken = !!localStorage.getItem('admin_token');
        return isAdminToken || (user && 'rol' in user);
    }, []);

    // Mientras se carga, mostrar fallback para no hacer flash de contenido
    if (isLoading && !esAdmin) {
        return <>{fallback || null}</>;
    }

    // Si es admin, permitir acceso a todo
    if (esAdmin) {
        return <>{children}</>;
    }

    // Si es usuario de escuela, validar módulo
    const tieneAcceso = tieneModulo(requiereModulo);
    
    return tieneAcceso ? (
        <>{children}</>
    ) : (
        <>{fallback || null}</>
    );
};

export default ModuloGuard;
