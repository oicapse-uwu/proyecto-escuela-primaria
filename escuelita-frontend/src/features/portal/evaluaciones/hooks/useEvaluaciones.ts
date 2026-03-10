import { useState, useEffect, useMemo } from 'react';
import type { Evaluaciones, EvaluacionesDTO } from '../types';
import { escuelaAuthService } from '../../../../services/escuelaAuth.service';
import {
  obtenerTodasEvaluaciones,
  crearEvaluacion,
  actualizarEvaluacion,
  eliminarEvaluacion,
} from '../api/evaluacionesApi';
import { useAsignacionesDocente } from './useAsignacionesDocente';

export const useEvaluaciones = () => {
  const [evaluaciones, setEvaluaciones] = useState<Evaluaciones[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Obtener asignaciones del docente logueado
  const { idAsignacionesArray, loading: loadingAsignaciones } = useAsignacionesDocente();

  // Filtrar evaluaciones según el rol del usuario
  const evaluacionesFiltradas = useMemo(() => {
    const usuarioActual = escuelaAuthService.getCurrentUser();
    const esProfesor = escuelaAuthService.isProfesor();
    const esAdministrador = usuarioActual?.rol?.nombreRol?.toUpperCase() === 'ADMINISTRADOR';

    // Si es profesor, mostrar solo sus evaluaciones (filtradas por asignación)
    if (esProfesor && !esAdministrador) {
      return evaluaciones.filter(ev => {
        const idAsignacion = typeof ev.idAsignacion === 'object' 
          ? ev.idAsignacion?.idAsignacion 
          : ev.idAsignacion;
        return idAsignacionesArray.includes(idAsignacion);
      });
    }

    // Si es administrador, mostrar todas
    return evaluaciones;
  }, [evaluaciones, idAsignacionesArray]);

  const cargarEvaluaciones = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await obtenerTodasEvaluaciones();
      setEvaluaciones(data);
    } catch (err) {
      // Si falla por error 500, mostrar advertencia suave pero continuar
      const errorMsg = err instanceof Error ? err.message : 'Error desconocido';
      if (errorMsg.includes('500')) {
        console.warn('No se pudieron cargar las evaluaciones (error 500)');
        setEvaluaciones([]);
      } else {
        setError('Error al cargar evaluaciones');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const crear = async (data: EvaluacionesDTO) => {
    try {
      const nueva = await crearEvaluacion(data);
      setEvaluaciones([...evaluaciones, nueva]);
      return nueva;
    } catch (err) {
      setError('Error al crear evaluación');
      throw err;
    }
  };

  const actualizar = async (data: EvaluacionesDTO) => {
    try {
      const actualizada = await actualizarEvaluacion(data);
      setEvaluaciones(
        evaluaciones.map((e) =>
          e.idEvaluacion === actualizada.idEvaluacion ? actualizada : e
        )
      );
      return actualizada;
    } catch (err) {
      setError('Error al actualizar evaluación');
      throw err;
    }
  };

  const eliminar = async (id: number) => {
    try {
      await eliminarEvaluacion(id);
      setEvaluaciones(evaluaciones.filter((e) => e.idEvaluacion !== id));
    } catch (err) {
      setError('Error al eliminar evaluación');
      throw err;
    }
  };

  useEffect(() => {
    cargarEvaluaciones();
  }, []);

  return {
    evaluaciones: evaluacionesFiltradas,
    loading,
    error,
    crear,
    actualizar,
    eliminar,
    recargar: cargarEvaluaciones,
  };
};
