import { DoorOpen, Users, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { escuelaAuthService } from '../../../../services/escuelaAuth.service';
import type { Aula, AulaDTO } from '../types';

interface AulaFormProps {
    aula?: Aula | null;
    onSubmit: (data: AulaDTO) => Promise<void>;
    onCancel: () => void;
    isLoading?: boolean;
}

const AulaForm: React.FC<AulaFormProps> = ({ 
    aula, 
    onSubmit, 
    onCancel, 
    isLoading = false
}) => {
    const sedeId = escuelaAuthService.getSedeId();
    
    const [formData, setFormData] = useState<AulaDTO>({
        nombreAula: '',
        capacidad: 30,
        idSede: sedeId || 0
    });

    useEffect(() => {
        if (aula) {
            setFormData({
                idAula: aula.idAula,
                nombreAula: aula.nombreAula,
                capacidad: aula.capacidad || 30,
                idSede: typeof aula.idSede === 'object' ? aula.idSede.idSede : aula.idSede
            });
        }
    }, [aula]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ 
            ...prev, 
            [name]: name === 'capacidad' || name === 'idSede' ? Number(value) : value 
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Asegurar que siempre se envíe la sede del usuario actual
        const dataToSubmit = {
            ...formData,
            idSede: sedeId || formData.idSede
        };
        await onSubmit(dataToSubmit);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                {/* Header */}
                <div className="bg-white border-b px-6 py-4 flex justify-between items-center rounded-t-lg">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center space-x-2">
                        <DoorOpen className="w-5 h-5 text-primary" />
                        <span>{aula ? 'Editar Aula' : 'Nueva Aula'}</span>
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
                            Nombre del Aula <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="nombreAula"
                            value={formData.nombreAula}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="Ej: Aula 101, Laboratorio..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center space-x-1">
                            <Users className="w-4 h-4" />
                            <span>Capacidad <span className="text-red-500">*</span></span>
                        </label>
                        <input
                            type="number"
                            name="capacidad"
                            value={formData.capacidad}
                            onChange={handleChange}
                            required
                            min="1"
                            max="100"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
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
                            {isLoading ? 'Guardando...' : (aula ? 'Actualizar' : 'Crear')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AulaForm;
