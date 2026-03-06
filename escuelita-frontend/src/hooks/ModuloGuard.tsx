import React, { useMemo } from 'react';
import { useModulosPermisos } from './useModulosPermisos';

interface ModuloGuardProps {
    requiereModulo: number;
    children: React.ReactNode;
    fallback?: React.ReactNode;
    idUsuario: number | null;
}

/**
 * Componente guard que protege contenido basado en módulos
 * - Para rutas /escuela: Valida que el usuario tenga acceso al módulo específico
 * - Para rutas /admin: Permite acceso a todos los módulos (son SuperAdmin)
 * 
 * IMPORTANTE: Si el usuario de IE cambia la URL a un módulo que no tiene,
 * será bloqueado aquí (frontend) Y además el backend devuelverá 403 en las llamadas API
 */
const ModuloGuard: React.FC<ModuloGuardProps> = ({ 
    requiereModulo,
    children, 
    fallback,
    idUsuario 
}) => {
    const { tieneModulo, isLoading } = useModulosPermisos(idUsuario);
    
    // Detectar si estamos en ruta /admin (SuperAdmin) o /escuela (usuarios de IE)
    const rutaActual = useMemo(() => {
        return window.location.pathname;
    }, []);
    
    const esSuperAdmin = rutaActual.startsWith('/admin');

    // Mientras se carga los módulos de un usuario de IE, mostrar fallback
    if (isLoading && !esSuperAdmin) {
        return <>{fallback || null}</>;
    }

    // Si está en /admin, es SuperAdmin → permitir acceso a TODOS los módulos
    if (esSuperAdmin) {
        return <>{children}</>;
    }

    // Si está en /escuela, validar que tenga el módulo
    // Si no tiene el módulo, mostrar fallback (normalmente redirige a dashboard)
    const tieneAcceso = tieneModulo(requiereModulo);
    
    return tieneAcceso ? (
        <>{children}</>
    ) : (
        <>{fallback || null}</>
    );
};

export default ModuloGuard;
