import React from 'react';
import type { Asistencias } from '../types';

interface AsistenciasTableProps {
  asistencias: Asistencias[];
  onEliminar?: (id: number) => Promise<void>;
  loading?: boolean;
}

const AsistenciasTable: React.FC<AsistenciasTableProps> = ({
  asistencias,
  onEliminar,
  loading = false,
}) => {
  const getEstadoBadge = (estado: string) => {
    const badges: Record<string, string> = {
      Presente: 'bg-green-100 text-green-800',
      Falta: 'bg-red-100 text-red-800',
      Tardanza: 'bg-yellow-100 text-yellow-800',
      Justificado: 'bg-blue-100 text-blue-800',
    };
    return badges[estado] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2 text-left">ID</th>
            <th className="border px-4 py-2 text-left">Matrícula</th>
            <th className="border px-4 py-2 text-left">Fecha</th>
            <th className="border px-4 py-2 text-left">Estado</th>
            <th className="border px-4 py-2 text-left">Observaciones</th>
            {onEliminar && (
              <th className="border px-4 py-2 text-center">Acciones</th>
            )}
          </tr>
        </thead>
        <tbody>
          {asistencias.length === 0 ? (
            <tr>
              <td
                colSpan={onEliminar ? 6 : 5}
                className="border px-4 py-2 text-center text-gray-500"
              >
                No hay asistencias registradas
              </td>
            </tr>
          ) : (
            asistencias.map((asistencia) => (
              <tr key={asistencia.idAsistencia} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{asistencia.idAsistencia}</td>
                <td className="border px-4 py-2">{asistencia.idMatricula}</td>
                <td className="border px-4 py-2">{asistencia.fecha}</td>
                <td className="border px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${getEstadoBadge(
                      asistencia.estadoAsistencia
                    )}`}
                  >
                    {asistencia.estadoAsistencia}
                  </span>
                </td>
                <td className="border px-4 py-2">{asistencia.observaciones}</td>
                {onEliminar && (
                  <td className="border px-4 py-2 text-center">
                    <button
                      onClick={() => onEliminar(asistencia.idAsistencia!)}
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

export default AsistenciasTable;
