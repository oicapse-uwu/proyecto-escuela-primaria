import { GraduationCap, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { escuelaAuthService } from '../../../../services/escuelaAuth.service';
import type { Grado, GradoDTO } from '../types';

interface GradoFormProps {
    grado?: Grado | null;
    onSubmit: (data: GradoDTO) => Promise<void>;
    onCancel: () => void;
    isLoading?: boolean;
}

const GradoForm: React.FC<GradoFormProps> = ({ 
    grado, 
    onSubmit, 
    onCancel, 
    isLoading = false
}) => {
    const sedeId = escuelaAuthService.getSedeId();
    
    const GRADOS_PRIMARIA = [
        'Primer Grado',
        'Segundo Grado',
        'Tercer Grado',
        'Cuarto Grado',
        'Quinto Grado',
        'Sexto Grado',
    ];

    const [formData, setFormData] = useState<GradoDTO>({
        nombreGrado: grado ? '' : GRADOS_PRIMARIA[0],
        idSede: sedeId || 0
    });

    useEffect(() => {
        if (grado) {
            setFormData({
                idGrado: grado.idGrado,
                nombreGrado: grado.nombreGrado,
                idSede: typeof grado.idSede === 'object' ? grado.idSede.idSede : grado.idSede
            });
        }
    }, [grado]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'idSede' ? Number(value) : value }));
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
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="bg-gradient-to-r from-escuela-light to-escuela-dark p-6 text-white flex justify-between items-center flex-shrink-0">
                    <h2 className="text-xl font-bold flex items-center gap-3">
                        <span className="w-1 h-6 bg-white/70 rounded-full flex-shrink-0"></span>
                        <GraduationCap className="w-6 h-6" />
                        <span>{grado ? 'Editar Grado' : 'Nuevo Grado'}</span>
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
                            Nombre del Grado <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="nombreGrado"
                            value={formData.nombreGrado}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-escuela focus:border-transparent"
                        >
                            {GRADOS_PRIMARIA.map(g => (
                                <option key={g} value={g}>{g}</option>
                            ))}
                        </select>
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
                            className="px-6 py-2 bg-escuela text-white rounded-lg hover:bg-escuela-dark transition-colors disabled:opacity-50"
                        >
                            {isLoading ? 'Guardando...' : (grado ? 'Actualizar' : 'Crear')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default GradoForm;
