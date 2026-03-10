import { useState, useEffect, useMemo } from 'react';
import type { PromediosPeriodo, PromediosPeriodoDTO } from '../types';
import { escuelaAuthService } from '../../../../services/escuelaAuth.service';
import {
  obtenerTodosPromediosPeriodo,
  crearPromediosPeriodo,
  actualizarPromediosPeriodo,
  eliminarPromediosPeriodo,
} from '../api/evaluacionesApi';
import { useAsignacionesDocente } from './useAsignacionesDocente';

export const usePromediosPeriodo = () => {
  const [promedios, setPromedios] = useState<PromediosPeriodo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Obtener asignaciones del docente logueado
  const { idAsignacionesArray } = useAsignacionesDocente();

  // Filtrar promedios según el rol del usuario
  const promediosFiltrados = useMemo(() => {
    const usuarioActual = escuelaAuthService.getCurrentUser();
    const esProfesor = escuelaAuthService.isProfesor();
    const esAdministrador = usuarioActual?.rol?.nombreRol?.toUpperCase() === 'ADMINISTRADOR';

    // Si es profesor, mostrar solo sus promedios (filtrados por asignación)
    if (esProfesor && !esAdministrador) {
      return promedios.filter(prom => {
        const idAsignacion = typeof prom.idAsignacion === 'object' 
          ? prom.idAsignacion?.idAsignacion 
          : prom.idAsignacion;
        return idAsignacionesArray.includes(idAsignacion);
      });
    }

    // Si es administrador, mostrar todos
    return promedios;
  }, [promedios, idAsignacionesArray]);

  const cargarPromedios = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('🔄 Iniciando carga de promedios...');
      const data = await obtenerTodosPromediosPeriodo();
      console.log('✅ Promedios cargados del API:', data);
      setPromedios(data);
    } catch (err) {
      console.error('❌ Error al cargar promedios:', err);
      setError('Error al cargar promedios');
    } finally {
      setLoading(false);
    }
  };

  const crear = async (data: PromediosPeriodoDTO) => {
    try {
      const nuevo = await crearPromediosPeriodo(data);
      setPromedios([...promedios, nuevo]);
      return nuevo;
    } catch (err) {
      setError('Error al crear promedio');
      throw err;
    }
  };

  const actualizar = async (data: PromediosPeriodoDTO) => {
    try {
      const actualizado = await actualizarPromediosPeriodo(data);
      setPromedios(
        promedios.map((p) =>
          p.idPromedio === actualizado.idPromedio ? actualizado : p
        )
      );
      return actualizado;
    } catch (err) {
      setError('Error al actualizar promedio');
      throw err;
    }
  };

  const eliminar = async (id: number) => {
    try {
      await eliminarPromediosPeriodo(id);
      setPromedios(promedios.filter((p) => p.idPromedio !== id));
    } catch (err) {
      setError('Error al eliminar promedio');
      throw err;
    }
  };

  useEffect(() => {
    cargarPromedios();
  }, []);

  return {
    promedios: promediosFiltrados,
    loading,
    error,
    crear,
    actualizar,
    eliminar,
    recargar: cargarPromedios,
  };
};
