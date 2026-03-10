import { Shield, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import type { Rol, RolFormData } from '../types';

interface RolFormProps {
    rol?: Rol | null;
    onSubmit: (data: RolFormData) => Promise<void>;
    onCancel: () => void;
    isLoading?: boolean;
}

const RolForm: React.FC<RolFormProps> = ({ rol, onSubmit, onCancel, isLoading = false }) => {
    const [formData, setFormData] = useState<RolFormData>({ nombre: '' });

    useEffect(() => {
        if (rol) {
            setFormData({ nombre: rol.nombre });
        }
    }, [rol]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSubmit(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-xl w-full max-h-[90vh] overflow-hidden">
                <div className="bg-gradient-to-r from-[#1e3a8a] to-[#1e1b4b] p-6 text-white flex justify-between items-center">
                    <h2 className="text-2xl font-bold flex items-center space-x-2">
                        <Shield className="w-6 h-6" />
                        <span>{rol ? 'Editar Rol' : 'Nuevo Rol'}</span>
                    </h2>
                    <button
                        onClick={onCancel}
                        className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                        disabled={isLoading}
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del Rol *</label>
                        <input
                            type="text"
                            value={formData.nombre}
                            onChange={(e) => setFormData({ nombre: e.target.value })}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="Ej: Coordinador"
                        />
                    </div>

                    <div className="flex justify-end space-x-3 pt-2">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            disabled={isLoading}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2.5 bg-gradient-to-r from-[#1e3a8a] to-[#1e1b4b] text-white rounded-lg hover:from-[#1e40af] hover:to-[#312e81] transition-colors disabled:opacity-50 font-semibold"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Guardando...' : rol ? 'Actualizar' : 'Crear'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RolForm;
