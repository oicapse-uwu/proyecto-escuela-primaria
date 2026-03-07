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
 * Componente guard que protege contenido basado en módulos para usuarios de IE
 * 
 * Lógica:
 * 1. Administrador de IE → VER todos los módulos
 * 2. Otros roles de IE (PROFESOR, etc) → Valida módulo específico
 * 3. Si no cumple → BLOQUEAR
 */
const ModuloGuard: React.FC<ModuloGuardProps> = ({ 
    requiereModulo,
    children, 
    fallback,
    idUsuario 
}) => {
    const { tieneModulo, modulosPermisos, isLoading } = useModulosPermisos(idUsuario);
    
    // Detectar el rol y si tiene sede (es usuario de IE)
    const { esAdministrador, tieneSede } = useMemo(() => {
        const user = escuelaAuthService.getCurrentUser();
        
        // Un usuario de IE SIEMPRE tiene sede asignada
        const hasSede = !!(user && 'sede' in user && user.sede);
        
        // Detectar si es Administrador comparando nombre de rol exacto
        const isAdmin = user?.rol?.nombreRol?.toUpperCase() === 'ADMINISTRADOR';
        
        return {
            esAdministrador: isAdmin,
            tieneSede: hasSede
        };
    }, []);

    // Si aún está cargando los módulos
    // PERO si ya tenemos datos guardados, no mostrar fallback
    if (isLoading && !modulosPermisos) {
        return <>{fallback || <div>Cargando...</div>}</>;
    }

    // Si es Administrador → Permitir acceso a TODOS los módulos
    if (esAdministrador && tieneSede) {
        return <>{children}</>;
    }

    // Si es otro rol de IE → Validar que tenga el módulo específico
    if (tieneSede) {
        const tieneAcceso = tieneModulo(requiereModulo);
        
        if (tieneAcceso) {
            return <>{children}</>;
        }
    }

    // Bloquear acceso
    return <>{fallback || null}</>;
};

export default ModuloGuard;
