import { useState, useEffect } from 'react';
import type { PromediosPeriodo, PromediosPeriodoDTO } from '../types';
import {
  obtenerTodosPromediosPeriodo,
  crearPromediosPeriodo,
  actualizarPromediosPeriodo,
  eliminarPromediosPeriodo,
} from '../api/evaluacionesApi';

export const usePromediosPeriodo = () => {
  const [promedios, setPromedios] = useState<PromediosPeriodo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    promedios,
    loading,
    error,
    crear,
    actualizar,
    eliminar,
    recargar: cargarPromedios,
  };
};
