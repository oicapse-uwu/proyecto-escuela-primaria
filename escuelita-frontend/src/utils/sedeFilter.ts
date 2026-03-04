import { escuelaAuthService } from '../services/escuelaAuth.service';

/**
 * Hook para obtener la sede del usuario actual
 */
export const useSedeActual = () => {
    const user = escuelaAuthService.getCurrentUser();
    const idSedeActual = user?.sede?.idSede || null;
    const nombreSedeActual = user?.sede?.nombreSede || '';
    
    return {
        idSedeActual,
        nombreSedeActual,
        tieneSede: idSedeActual !== null
    };
};

/**
 * Filtrar datos por la sede del usuario actual
 */
export const filtrarPorSedeActual = <T extends { idSede?: any }>(datos: T[]): T[] => {
    const user = escuelaAuthService.getCurrentUser();
    const idSedeActual = user?.sede?.idSede;
    
    if (!idSedeActual) {
        console.warn('⚠️ Usuario sin sede asignada. Mostrando todos los datos.');
        return datos;
    }
    
    return datos.filter(dato => {
        // Manejar diferentes estructuras de datos
        const sedeId = dato.idSede?.idSede || dato.idSede;
        return sedeId === idSedeActual;
    });
};

/**
 * Verificar si un dato pertenece a la sede actual
 */
export const perteneceASedeActual = (dato: any): boolean => {
    const user = escuelaAuthService.getCurrentUser();
    const idSedeActual = user?.sede?.idSede;
    
    if (!idSedeActual) return true; // Si no hay sede, permitir todo
    
    const sedeId = dato?.idSede?.idSede || dato?.idSede;
    return sedeId === idSedeActual;
};
