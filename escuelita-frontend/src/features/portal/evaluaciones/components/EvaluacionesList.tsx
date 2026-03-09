import React from 'react';
import type { Evaluaciones } from '../types';

interface EvaluacionesListProps {
  evaluaciones: Evaluaciones[];
  onEliminar?: (id: number) => Promise<void>;
  loading?: boolean;
}

const EvaluacionesList: React.FC<EvaluacionesListProps> = ({
  evaluaciones,
  onEliminar,
  loading = false,
}) => {
  const getAsignacionDisplay = (asignacion: any) => {
    if (!asignacion) return 'N/A';
    if (typeof asignacion === 'number') return asignacion;
    
    // Ruta conocida del API: asignacion.idDocente.idUsuario.nombres
    if (typeof asignacion === 'object') {
      try {
        // Intenta la ruta directa: idDocente -> idUsuario -> nombres
        if (asignacion.idDocente?.idUsuario?.nombres) {
          const nombre = asignacion.idDocente.idUsuario.nombres;
          const apellido = asignacion.idDocente.idUsuario.apellidos;
          return apellido ? `${nombre} ${apellido}` : nombre;
        }
        
        // Fallback a búsqueda recursiva para casos especiales
        const buscarNombre = (obj: any, nivel = 0): string | null => {
          if (nivel > 3 || !obj || typeof obj !== 'object') return null;
          if (obj.nombres) return obj.nombres;
          if (obj.nombre) return obj.nombre;
          
          for (const key in obj) {
            if (typeof obj[key] === 'object' && obj[key] !== null) {
              const resultado = buscarNombre(obj[key], nivel + 1);
              if (resultado) return resultado;
            }
          }
          return null;
        };
        
        const nombreFallback = buscarNombre(asignacion);
        if (nombreFallback) return nombreFallback;
        
        // Final fallback
        if (asignacion.idAsignacion) {
          return `Asignación #${asignacion.idAsignacion}`;
        }
      } catch (e) {
        console.warn('Error al extraer nombre de asignación:', e);
      }
    }
    return 'N/A';
  };

  const getPeriodoDisplay = (periodo: any) => {
    if (!periodo) return 'N/A';
    if (typeof periodo === 'number') return periodo;
    if (typeof periodo === 'object' && periodo.idPeriodo) {
      return periodo.idPeriodo;
    }
    return 'N/A';
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2 text-left">ID</th>
            <th className="border px-4 py-2 text-left">Tema Específico</th>
            <th className="border px-4 py-2 text-left">Fecha</th>
            <th className="border px-4 py-2 text-left">Asignación</th>
            <th className="border px-4 py-2 text-left">Período</th>
            {onEliminar && (
              <th className="border px-4 py-2 text-center">Acciones</th>
            )}
          </tr>
        </thead>
        <tbody>
          {evaluaciones.length === 0 ? (
            <tr>
              <td
                colSpan={onEliminar ? 6 : 5}
                className="border px-4 py-2 text-center text-gray-500"
              >
                No hay evaluaciones registradas
              </td>
            </tr>
          ) : (
            evaluaciones.map((evaluation) => (
              <tr key={evaluation.idEvaluacion} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{evaluation.idEvaluacion}</td>
                <td className="border px-4 py-2">{evaluation.temaEspecifico}</td>
                <td className="border px-4 py-2">{evaluation.fechaEvaluacion}</td>
                <td className="border px-4 py-2">{getAsignacionDisplay(evaluation.idAsignacion)}</td>
                <td className="border px-4 py-2">{getPeriodoDisplay(evaluation.idPeriodo)}</td>
                {onEliminar && (
                  <td className="border px-4 py-2 text-center">
                    <button
                      onClick={() => onEliminar(evaluation.idEvaluacion!)}
                      disabled={loading}
                      className="text-red-600 hover:text-red-800 text-sm disabled:opacity-50"
                    >
                      Eliminar
                    </button>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default EvaluacionesList;
