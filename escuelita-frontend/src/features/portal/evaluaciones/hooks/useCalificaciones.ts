import { useState, useEffect, useMemo } from 'react';
import type { Calificaciones, CalificacionesDTO } from '../types';
import { escuelaAuthService } from '../../../../services/escuelaAuth.service';
import {
  obtenerTodasCalificaciones,
  crearCalificacion,
  actualizarCalificacion,
  eliminarCalificacion,
} from '../api/evaluacionesApi';
import { useAsignacionesDocente } from './useAsignacionesDocente';

export const useCalificaciones = () => {
  const [calificaciones, setCalificaciones] = useState<Calificaciones[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Obtener asignaciones del docente logueado
  const { idAsignacionesArray } = useAsignacionesDocente();

  // Filtrar calificaciones según el rol del usuario
  const calificacionesFiltradas = useMemo(() => {
    const usuarioActual = escuelaAuthService.getCurrentUser();
    const esProfesor = escuelaAuthService.isProfesor();
    const esAdministrador = usuarioActual?.rol?.nombreRol?.toUpperCase() === 'ADMINISTRADOR';

    // Si es profesor, mostrar solo sus calificaciones (filtradas por asignación de evaluación)
    if (esProfesor && !esAdministrador) {
      return calificaciones.filter(calif => {
        const evalu = (calif as any).idEvaluacion;
        const idAsignacion = typeof evalu === 'object' 
          ? evalu?.idAsignacion 
          : null;
        
        // Obtener el ID de la asignación (puede ser objeto o número)
        const idAsigNum = typeof idAsignacion === 'object' 
          ? idAsignacion?.idAsignacion 
          : idAsignacion;
        
        return idAsigNum && idAsignacionesArray.includes(idAsigNum);
      });
    }

    // Si es administrador, mostrar todas
    return calificaciones;
  }, [calificaciones, idAsignacionesArray]);

  const cargarCalificaciones = async () => {
    setLoading(true);
    setError(null);
    try {
      // Obtiene SOLO calificaciones de tu sede (filtrado por JWT en backend)
      const data = await obtenerTodasCalificaciones();
      setCalificaciones(data);
    } catch (err: any) {
      // Si el servidor retorna 500, mostrar mensaje informativo
      if (err.response?.status === 500) {
        setError('El servidor está retornando un error. Por favor contacta al administrador.');
        console.error('❌ Error 500 en el servidor:', err);
      } else {
        setError('Error al cargar calificaciones');
        console.error(err);
      }
      // No dejar vacía la lista, continuar con array vacío
      setCalificaciones([]);
    } finally {
      setLoading(false);
    }
  };

  const crear = async (data: CalificacionesDTO) => {
    try {
      // Se guarda en BD en la nube automáticamente
      // El backend lo asigna a tu sede por el JWT token
      const nueva = await crearCalificacion(data);
      setCalificaciones([...calificaciones, nueva]);
      return nueva;
    } catch (err) {
      setError('Error al crear calificación');
      throw err;
    }
  };

  const actualizar = async (data: CalificacionesDTO) => {
    try {
      const actualizada = await actualizarCalificacion(data);
      setCalificaciones(
        calificaciones.map((c) =>
          c.idCalificacion === actualizada.idCalificacion ? actualizada : c
        )
      );
      return actualizada;
    } catch (err) {
      setError('Error al actualizar calificación');
      throw err;
    }
  };

  const eliminar = async (id: number) => {
    try {
      await eliminarCalificacion(id);
      setCalificaciones(calificaciones.filter((c) => c.idCalificacion !== id));
    } catch (err) {
      setError('Error al eliminar calificación');
      throw err;
    }
  };

  useEffect(() => {
    cargarCalificaciones();
  }, []);

  return {
    calificaciones: calificacionesFiltradas,
    loading,
    error,
    crear,
    actualizar,
    eliminar,
    recargar: cargarCalificaciones,
  };
};
