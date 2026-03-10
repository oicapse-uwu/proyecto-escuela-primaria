import { useState, useEffect, useMemo } from 'react';
import type { Asistencias, AsistenciasDTO } from '../types';
import { escuelaAuthService } from '../../../../services/escuelaAuth.service';
import {
  obtenerTodasAsistencias,
  crearAsistencia,
  actualizarAsistencia,
  eliminarAsistencia,
} from '../api/evaluacionesApi';
import { useAsignacionesDocente } from './useAsignacionesDocente';

export const useAsistencias = () => {
  const [asistencias, setAsistencias] = useState<Asistencias[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Obtener asignaciones del docente logueado
  const { idAsignacionesArray } = useAsignacionesDocente();

  // Filtrar asistencias según el rol del usuario
  const asistenciasFiltradas = useMemo(() => {
    const usuarioActual = escuelaAuthService.getCurrentUser();
    const esProfesor = escuelaAuthService.isProfesor();
    const esAdministrador = usuarioActual?.rol?.nombreRol?.toUpperCase() === 'ADMINISTRADOR';

    // Si es profesor, mostrar solo sus asistencias (filtradas por asignación)
    if (esProfesor && !esAdministrador) {
      return asistencias.filter(asi => {
        const idAsignacion = typeof asi.idAsignacion === 'object' 
          ? asi.idAsignacion?.idAsignacion 
          : asi.idAsignacion;
        return idAsignacionesArray.includes(idAsignacion);
      });
    }

    // Si es administrador, mostrar todas
    return asistencias;
  }, [asistencias, idAsignacionesArray]);

  const cargarAsistencias = async () => {
    setLoading(true);
    setError(null);
    try {
      // Obtiene SOLO asistencias de tu sede
      const data = await obtenerTodasAsistencias();
      setAsistencias(data);
    } catch (err) {
      setError('Error al cargar asistencias');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const crear = async (data: AsistenciasDTO) => {
    try {
      const nueva = await crearAsistencia(data);
      setAsistencias([...asistencias, nueva]);
      return nueva;
    } catch (err) {
      setError('Error al registrar asistencia');
      throw err;
    }
  };

  const crearMultiples = async (dataArray: AsistenciasDTO[]) => {
    try {
      const nuevas = await Promise.all(dataArray.map(data => crearAsistencia(data)));
      setAsistencias([...asistencias, ...nuevas]);
      return nuevas;
    } catch (err) {
      setError('Error al registrar asistencias');
      throw err;
    }
  };

  const actualizar = async (data: AsistenciasDTO) => {
    try {
      const actualizada = await actualizarAsistencia(data);
      setAsistencias(
        asistencias.map((a) =>
          a.idAsistencia === actualizada.idAsistencia ? actualizada : a
        )
      );
      return actualizada;
    } catch (err) {
      setError('Error al actualizar asistencia');
      throw err;
    }
  };

  const eliminar = async (id: number) => {
    try {
      await eliminarAsistencia(id);
      setAsistencias(asistencias.filter((a) => a.idAsistencia !== id));
    } catch (err) {
      setError('Error al eliminar asistencia');
      throw err;
    }
  };

  useEffect(() => {
    cargarAsistencias();
  }, []);

  return {
    asistencias: asistenciasFiltradas,
    loading,
    error,
    crear,
    crearMultiples,
    actualizar,
    eliminar,
    recargar: cargarAsistencias,
  };
};
