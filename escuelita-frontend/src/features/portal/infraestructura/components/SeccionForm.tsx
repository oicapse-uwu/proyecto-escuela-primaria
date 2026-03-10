import { AlertTriangle, Layers, Users, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { escuelaAuthService } from '../../../../services/escuelaAuth.service';
import type { Grado, Seccion, SeccionDTO } from '../types';

interface SeccionFormProps {
    seccion?: Seccion | null;
    onSubmit: (data: SeccionDTO) => Promise<void>;
    onCancel: () => void;
    isLoading?: boolean;
    grados: Grado[];
    vacantesDisponibles?: number | null;
}

const SeccionForm: React.FC<SeccionFormProps> = ({ 
    seccion, 
    onSubmit, 
    onCancel, 
    isLoading = false,
    grados,
    vacantesDisponibles 
}) => {
    const sedeId = escuelaAuthService.getSedeId();
    
    const maxVacantes = vacantesDisponibles != null && vacantesDisponibles > 0 ? vacantesDisponibles : 100;

    const [formData, setFormData] = useState<SeccionDTO>({
        nombreSeccion: '',
        vacantes: Math.min(maxVacantes, 30),
        idGrado: grados.length > 0 ? grados[0].idGrado : 0,
        idSede: sedeId || 0
    });

    useEffect(() => {
        if (seccion) {
            setFormData({
                idSeccion: seccion.idSeccion,
                nombreSeccion: seccion.nombreSeccion,
                vacantes: seccion.vacantes || 30,
                idGrado: typeof seccion.idGrado === 'object' ? seccion.idGrado.idGrado : seccion.idGrado,
                idSede: typeof seccion.idSede === 'object' ? seccion.idSede.idSede : seccion.idSede
            });
        }
    }, [seccion]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ 
            ...prev, 
            [name]: name === 'vacantes' || name === 'idGrado' || name === 'idSede' ? Number(value) : value 
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
                <div className="bg-gradient-to-r from-[#1e3a8a] to-[#1e1b4b] px-6 py-4 text-white flex justify-between items-center rounded-t-lg">
                    <h2 className="text-xl font-bold flex items-center space-x-2">
                        <Layers className="w-5 h-5" />
                        <span>{seccion ? 'Editar Sección' : 'Nueva Sección'}</span>
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
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Grado <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="idGrado"
                            value={formData.idGrado}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                            {grados.map(grado => (
                                <option key={grado.idGrado} value={grado.idGrado}>
                                    {grado.nombreGrado.toLowerCase().replace(/\b\w/g, c => c.toUpperCase())}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nombre de la Sección <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="nombreSeccion"
                            value={formData.nombreSeccion}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="Ej: A, B, C..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center space-x-1">
                            <Users className="w-4 h-4" />
                            <span>Vacantes <span className="text-red-500">*</span></span>
                        </label>
                        <input
                            type="number"
                            name="vacantes"
                            value={formData.vacantes}
                            onChange={handleChange}
                            required
                            min="1"
                            max={maxVacantes}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                                formData.vacantes > maxVacantes ? 'border-red-400 bg-red-50' : 'border-gray-300'
                            }`}
                        />
                        {vacantesDisponibles != null && vacantesDisponibles > 0 && (
                            <p className={`text-xs mt-1 flex items-center gap-1 ${
                                formData.vacantes > maxVacantes ? 'text-red-600 font-medium' : 'text-gray-500'
                            }`}>
                                {formData.vacantes > maxVacantes && <AlertTriangle className="w-3 h-3" />}
                                Máximo permitido por el plan: {vacantesDisponibles}
                            </p>
                        )}
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
                            disabled={isLoading || formData.vacantes > maxVacantes}
                            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
                        >
                            {isLoading ? 'Guardando...' : (seccion ? 'Actualizar' : 'Crear')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SeccionForm;
