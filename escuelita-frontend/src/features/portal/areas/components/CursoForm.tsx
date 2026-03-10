import React, { useState } from 'react';
import { BookOpen } from 'lucide-react';
import Modal from '../../../../components/common/Modal';
import type { Area, Curso, CursoDTO } from '../types/areas.types';

interface CursoFormProps {
    isOpen: boolean;
    onClose: () => void;
    curso?: Curso | null;
    areas: Area[];
    onSubmit: (data: CursoDTO) => Promise<void>;
    isLoading?: boolean;
}

const CursoForm: React.FC<CursoFormProps> = ({ isOpen, onClose, curso, areas, onSubmit, isLoading = false }) => {
    const [formData, setFormData] = useState<CursoDTO>({
        idCurso: curso?.idCurso,
        nombreCurso: curso?.nombreCurso || '',
        idArea: curso?.idArea?.idArea || 0,
        estado: curso?.estado ?? 1
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'idArea' || name === 'estado' ? parseInt(value, 10) : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.idArea || formData.idArea === 0) {
            alert('Debe seleccionar un área');
            return;
        }
        await onSubmit(formData);
    };

    const areasActivas = areas.filter(a => a.estado === 1);

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={curso ? 'Editar Curso' : 'Nuevo Curso'} size="md">
            <form onSubmit={handleSubmit} className="p-6">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Curso *</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <BookOpen className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                name="nombreCurso"
                                value={formData.nombreCurso}
                                onChange={handleChange}
                                required
                                className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="Ej: Matemáticas"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Área *</label>
                        <select
                            name="idArea"
                            value={formData.idArea}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                            <option value={0}>Seleccionar área</option>
                            {areasActivas.map(area => (
                                <option key={area.idArea} value={area.idArea}>
                                    {area.nombreArea}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-100">
                    <button type="button" onClick={onClose} disabled={isLoading} className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg">
                        Cancelar
                    </button>
                    <button type="submit" disabled={isLoading} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark">
                        {isLoading ? 'Guardando...' : curso ? 'Actualizar' : 'Crear'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default CursoForm;
