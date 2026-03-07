import React, { useState } from 'react';
import type { ReniecResponse } from '../../services/reniec.service';
import { reniecService } from '../../services/reniec.service';

/**
 * Componente de ejemplo para consultar DNI en RENIEC
 * Puedes integrar este código en tus formularios de alumnos o apoderados
 */
export const ConsultaDniExample: React.FC = () => {
    const [dni, setDni] = useState('');
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<ReniecResponse | null>(null);
    const [error, setError] = useState<string>('');

    const handleConsultar = async () => {
        if (!dni || dni.length !== 8) {
            setError('Ingrese un DNI válido de 8 dígitos');
            return;
        }

        setLoading(true);
        setError('');
        setData(null);

        try {
            const resultado = await reniecService.consultarDni(dni);
            setData(resultado);
        } catch (err: any) {
            setError(err.message || 'Error al consultar DNI');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Consultar DNI - RENIEC</h2>
            
            <div className="mb-4">
                <label htmlFor="dni" className="block text-sm font-medium text-gray-700 mb-2">
                    Número de DNI
                </label>
                <div className="flex gap-2">
                    <input
                        type="text"
                        id="dni"
                        value={dni}
                        onChange={(e) => setDni(e.target.value.replace(/\D/g, '').slice(0, 8))}
                        placeholder="Ej: 46027897"
                        maxLength={8}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        onClick={handleConsultar}
                        disabled={loading}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Consultando...' : 'Consultar'}
                    </button>
                </div>
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                </div>
            )}

            {data && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded">
                    <h3 className="font-semibold mb-2">Datos encontrados:</h3>
                    <div className="space-y-1 text-sm">
                        <p><strong>Nombres:</strong> {data.first_name}</p>
                        <p><strong>Apellido Paterno:</strong> {data.first_last_name}</p>
                        <p><strong>Apellido Materno:</strong> {data.second_last_name}</p>
                        <p><strong>Nombre Completo:</strong> {data.full_name}</p>
                        <p><strong>DNI:</strong> {data.document_number}</p>
                    </div>
                </div>
            )}

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded text-sm">
                <p className="font-semibold mb-1">💡 Cómo usar en tu código:</p>
                <code className="block bg-white p-2 rounded mt-2 text-xs">
                    {`const data = await reniecService.consultarDni('46027897');`}
                </code>
            </div>
        </div>
    );
};

export default ConsultaDniExample;
