import { Calendar, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
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
    const [errorAnio, setErrorAnio] = useState<string>('');

    const currentYear = new Date().getFullYear();

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

        if (name === 'nombreAnio') {
            // Solo permitir dígitos y máximo 4 caracteres
            const soloDigitos = value.replace(/\D/g, '').slice(0, 4);
            setFormData(prev => ({ ...prev, nombreAnio: soloDigitos }));

            if (soloDigitos.length === 4) {
                if (!soloDigitos.startsWith('2')) {
                    setErrorAnio('x');
                    toast.error('El año escolar debe contener 4 dígitos numéricos y comenzar con el número 2.', { id: 'anio-validation' });
                } else {
                    setErrorAnio('');
                }
            } else if (soloDigitos.length > 0) {
                setErrorAnio('x');
                toast.error('El año escolar debe contener 4 dígitos numéricos y comenzar con el número 2.', { id: 'anio-validation' });
            } else {
                setErrorAnio('');
            }
            return;
        }

        setFormData(prev => ({ 
            ...prev, 
            [name]: type === 'checkbox' ? checked : value 
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.nombreAnio || formData.nombreAnio.length !== 4 || !formData.nombreAnio.startsWith('2')) {
            setErrorAnio('x');
            toast.error('El año escolar debe contener 4 dígitos numéricos y comenzar con el número 2.', { id: 'anio-validation' });
            return;
        }

        await onSubmit(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="bg-gradient-to-r from-escuela-light to-escuela-dark p-6 text-white flex justify-between items-center flex-shrink-0">
                    <h2 className="text-xl font-bold flex items-center gap-3">
                        <span className="w-1 h-6 bg-white/70 rounded-full flex-shrink-0"></span>
                        <Calendar className="w-6 h-6" />
                        <span>{anioEscolar ? 'Editar Año Escolar' : 'Nuevo Año Escolar'}</span>
                    </h2>
                    <button
                        onClick={onCancel}
                        className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                        disabled={isLoading}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
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
                            maxLength={4}
                            inputMode="numeric"
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-escuela focus:border-transparent ${errorAnio ? 'border-red-400' : 'border-gray-300'}`}
                            placeholder={`Ej: ${currentYear}, ${currentYear + 1}...`}
                        />

                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Fecha de Inicio
                            </label>
                            <input
                                type="date"
                                name="fechaInicio"
                                value={formData.fechaInicio}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-escuela focus:border-transparent"
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
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-escuela focus:border-transparent"
                            />
                        </div>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="activo"
                            name="activo"
                            checked={formData.activo}
                            onChange={handleChange}
                            className="h-4 w-4 text-escuela focus:ring-escuela border-gray-300 rounded"
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
                            disabled={isLoading || !!errorAnio || formData.nombreAnio.length !== 4}
                            className="px-6 py-2 bg-escuela text-white rounded-lg hover:bg-escuela-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
