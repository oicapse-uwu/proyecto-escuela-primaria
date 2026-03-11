import { Package, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import { escuelaAuthService } from '../../../../../services/escuelaAuth.service';
import type { Area } from '../types/areas.types';
import type { Curso, CursoDTO } from '../types/cursos.types';

interface CursoFormProps {
    isOpen: boolean;
    onClose: () => void;
    curso?: Curso | null;
    onSubmit: (data: CursoDTO) => Promise<void>;
    isLoading?: boolean;
    areas?: Area[]; // Lista de áreas globales (opcional)
    areaPreseleccionada?: Area; // Área ya seleccionada (no se puede cambiar)
}

const CursoForm: React.FC<CursoFormProps> = ({ 
    isOpen, 
    onClose, 
    curso, 
    onSubmit, 
    isLoading = false,
    areaPreseleccionada
}) => {
    const currentUser = escuelaAuthService.getCurrentUser();
    const idSede = currentUser?.sede?.idSede || 0;
    
    // Determinar el idArea inicial
    const idAreaInicial = areaPreseleccionada?.idArea || 0;

    const [formData, setFormData] = useState<CursoDTO>({
        nombreCurso: '',
        idArea: idAreaInicial,
        idSede: idSede,
        estado: 1
    });

    // Sincronizar el formulario cuando cambia el curso o se abre el modal
    useEffect(() => {
        if (!isOpen) return;

        if (curso) {
            // Modo edición: cargar datos del curso
            setFormData({
                nombreCurso: curso.nombreCurso || '',
                idArea: typeof curso.idArea === 'object' ? curso.idArea?.idArea || idAreaInicial : curso.idArea || idAreaInicial,
                idSede: typeof curso.idSede === 'object' ? curso.idSede?.idSede || idSede : curso.idSede || idSede,
                estado: curso.estado || 1
            });
        } else {
            // Modo creación: resetear formulario
            setFormData({ 
                nombreCurso: '', 
                idArea: idAreaInicial, 
                idSede: idSede, 
                estado: 1 
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [curso?.idCurso, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'estado' || name === 'idArea' || name === 'idSede' 
                ? parseInt(value, 10) 
                : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.idArea === 0) {
            alert('Por favor seleccione un área académica');
            return;
        }
        await onSubmit(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
                {/* Header */}
                <div className="bg-escuela px-6 py-4 flex items-center justify-between rounded-t-lg">
                    <div className="flex items-center gap-2 text-white">
                        <Package className="w-5 h-5" />
                        <h2 className="text-lg font-semibold">{curso ? 'Editar Curso' : 'Nuevo Curso'}</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-white hover:bg-escuela-dark p-1 rounded transition"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6">
                
                <div className="space-y-4">

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del Curso *</label>
                        <input 
                            type="text" 
                            name="nombreCurso" 
                            value={formData.nombreCurso} 
                            onChange={handleChange} 
                            required 
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-escuela focus:border-escuela" 
                            placeholder="Ej: Álgebra, Geometría, Aritmética" 
                        />
                    </div>

                    {areaPreseleccionada && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Área</label>
                            <input 
                                type="text" 
                                value={areaPreseleccionada.nombreArea}
                                disabled
                                className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50 text-gray-600" 
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Estado *</label>
                        <select 
                            name="estado" 
                            value={formData.estado} 
                            onChange={handleChange} 
                            required 
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-escuela focus:border-escuela"
                        >
                            <option value={1}>Activo</option>
                            <option value={0}>Inactivo</option>
                        </select>
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                    <button 
                        type="button" 
                        onClick={onClose} 
                        disabled={isLoading} 
                        className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded transition"
                    >
                        Cancelar
                    </button>
                    <button 
                        type="submit" 
                        disabled={isLoading} 
                        className="px-6 py-2 bg-gradient-to-r from-escuela to-escuela-light text-white rounded hover:shadow-lg transition-all font-semibold"
                    >
                        {isLoading ? 'Guardando...' : curso ? 'Actualizar' : 'Crear'}
                    </button>
                </div>
            </form>
            </div>
        </div>
    );
};

export default CursoForm;
