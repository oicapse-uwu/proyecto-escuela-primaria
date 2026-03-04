import React from 'react';
import { useModulosPermisos } from './useModulosPermisos';

interface ModuloGuardProps {
    requierePermiso?: string;
    requiereModulo?: number;
    children: React.ReactNode;
    fallback?: React.ReactNode;
    idUsuario: number | null;
}

/**
 * Componente guard que protege contenido basado en permisos
 * Solo muestra el contenido si el usuario tiene el permiso requerido
 */
const ModuloGuard: React.FC<ModuloGuardProps> = ({ 
    requierePermiso, 
    requiereModulo,
    children, 
    fallback,
    idUsuario 
}) => {
    const { tienePermiso, obtenerModulo } = useModulosPermisos(idUsuario);

    // Verificar permiso específico
    if (requierePermiso) {
        return tienePermiso(requierePermiso) ? (
            <>{children}</>
        ) : (
            <>{fallback || null}</>
        );
    }

    // Verificar acceso a módulo
    if (requiereModulo) {
        return obtenerModulo(requiereModulo) ? (
            <>{children}</>
        ) : (
            <>{fallback || null}</>
        );
    }

    // Sin restricciones
    return <>{children}</>;
};

export default ModuloGuard;
