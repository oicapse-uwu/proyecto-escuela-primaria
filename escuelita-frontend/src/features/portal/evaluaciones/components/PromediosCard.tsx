import React from 'react';
import type { PromediosPeriodo } from '../types';

interface PromediosCardProps {
  promedios: PromediosPeriodo[];
  loading?: boolean;
}

const PromediosCard: React.FC<PromediosCardProps> = ({
  promedios,
  loading = false,
}) => {
  const getEstadoCierre = (estado: string) => {
    return estado === 'Cerrado_Enviado' ? 'Cerrado' : 'Abierto';
  };

  const getEstadoColor = (estado: string) => {
    return estado === 'Cerrado_Enviado'
      ? 'bg-red-100 text-red-800'
      : 'bg-green-100 text-green-800';
  };

  if (loading) {
    return <div className="text-center py-4">Cargando promedios...</div>;
  }

  if (promedios.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No hay promedios de período registrados
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {promedios.map((promedio) => (
        <div
          key={promedio.idPromedio}
          className="bg-white p-4 rounded-lg shadow border border-gray-200"
        >
          <div className="flex justify-between items-start mb-3">
            <h4 className="font-bold text-lg">Promedio</h4>
            <span
              className={`px-2 py-1 rounded text-xs font-medium ${getEstadoColor(
                promedio.estadoCierre
              )}`}
            >
              {getEstadoCierre(promedio.estadoCierre)}
            </span>
          </div>

          <div className="space-y-2 text-sm">
            <div>
              <span className="text-gray-600">Nota Final:</span>
              <span className="font-bold ml-2 text-lg">
                {promedio.notaFinalArea}
              </span>
            </div>

            <div>
              <span className="text-gray-600">Período:</span>
              <span className="ml-2">#{promedio.idPeriodo}</span>
            </div>

            <div>
              <span className="text-gray-600">Matrícula:</span>
              <span className="ml-2">#{promedio.idMatricula}</span>
            </div>

            {promedio.comentarioLibreta && (
              <div>
                <span className="text-gray-600">Comentario:</span>
                <p className="text-xs mt-1 p-2 bg-gray-50 rounded">
                  {promedio.comentarioLibreta}
                </p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PromediosCard;
