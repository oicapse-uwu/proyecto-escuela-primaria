import { Calendar, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import type { AnioEscolar, AnioEscolarDTO } from '../types';

interface AnioEscolarFormProps {
    anioEscolar?: AnioEscolar | null;
    onSubmit: (data: AnioEscolarDTO) => Promise<void>;
    onCancel: () => void;
    isLoading?: boolean;
}

const AnioEscolarForm: React.FC<AnioEscolarFormProps> = ({ 
    anioEscolar, 
    onSubmit, 
    onCancel, 
    isLoading = false
}) => {
    const [formData, setFormData] = useState<AnioEscolarDTO>({
        nombreAnio: '',
        fechaInicio: '',
        fechaFin: '',
        activo: true
    });

    useEffect(() => {
        if (anioEscolar) {
            setFormData({
                idAnioEscolar: anioEscolar.idAnioEscolar,
                nombreAnio: anioEscolar.nombreAnio,
                fechaInicio: anioEscolar.fechaInicio || '',
                fechaFin: anioEscolar.fechaFin || '',
                activo: anioEscolar.activo ?? true
            });
        }
    }, [anioEscolar]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ 
            ...prev, 
            [name]: type === 'checkbox' ? checked : value 
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSubmit(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                {/* Header */}
                <div className="bg-white border-b px-6 py-4 flex justify-between items-center rounded-t-lg">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center space-x-2">
                        <Calendar className="w-5 h-5 text-primary" />
                        <span>{anioEscolar ? 'Editar Año Escolar' : 'Nuevo Año Escolar'}</span>
                    </h2>
                    <button
                        onClick={onCancel}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        disabled={isLoading}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nombre del Año <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="nombreAnio"
                            value={formData.nombreAnio}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="Ej: 2024, 2025..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Fecha de Inicio
                        </label>
                        <input
                            type="date"
                            name="fechaInicio"
                            value={formData.fechaInicio}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Fecha de Fin
                        </label>
                        <input
                            type="date"
                            name="fechaFin"
                            value={formData.fechaFin}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="activo"
                            name="activo"
                            checked={formData.activo}
                            onChange={handleChange}
                            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                        />
                        <label htmlFor="activo" className="ml-2 block text-sm text-gray-700">
                            Año Activo
                        </label>
                    </div>

                    {/* Botones */}
                    <div className="flex justify-end space-x-3 pt-2">
                        <button
                            type="button"
                            onClick={onCancel}
                            disabled={isLoading}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
                        >
                            {isLoading ? 'Guardando...' : (anioEscolar ? 'Actualizar' : 'Crear')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AnioEscolarForm;
