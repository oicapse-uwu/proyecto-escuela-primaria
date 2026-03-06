import React from 'react';
import { useModulosPermisos } from './useModulosPermisos';

interface ModuloGuardProps {
    requiereModulo: number;
    children: React.ReactNode;
    fallback?: React.ReactNode;
    idUsuario: number | null;
}

/**
 * Componente guard que protege contenido basado en módulos
 * Solo muestra el contenido si el usuario tiene acceso al módulo
 */
const ModuloGuard: React.FC<ModuloGuardProps> = ({ 
    requiereModulo,
    children, 
    fallback,
    idUsuario 
}) => {
    const { tieneModulo } = useModulosPermisos(idUsuario);

    // Verificar acceso a módulo
    return tieneModulo(requiereModulo) ? (
        <>{children}</>
    ) : (
        <>{fallback || null}</>
    );
};

export default ModuloGuard;
