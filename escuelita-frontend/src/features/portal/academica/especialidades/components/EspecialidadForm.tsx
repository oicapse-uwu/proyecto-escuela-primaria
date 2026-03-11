import React, { useEffect, useState } from 'react';
import { BookOpen } from 'lucide-react';
import Modal from '../../../../../components/common/Modal';
import type { Especialidad, EspecialidadDTO } from '../types';

interface EspecialidadFormProps {
    isOpen: boolean; onClose: () => void; especialidad?: Especialidad | null; onSubmit: (data: EspecialidadDTO) => Promise<void>; isLoading?: boolean;
}

const EspecialidadForm: React.FC<EspecialidadFormProps> = ({ isOpen, onClose, especialidad, onSubmit, isLoading = false }) => {
    const [formData, setFormData] = useState<EspecialidadDTO>({ nombreEspecialidad: '', descripcion: '', estado: 1 });

    useEffect(() => {
        if (especialidad && isOpen) {
            setFormData({ nombreEspecialidad: especialidad.nombreEspecialidad || '', descripcion: especialidad.descripcion || '', estado: especialidad.estado || 1 });
        } else if (isOpen) {
            setFormData({ nombreEspecialidad: '', descripcion: '', estado: 1 });
        }
    }, [especialidad, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'estado' ? parseInt(value, 10) : value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); await onSubmit(formData);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={especialidad ? 'Editar Especialidad' : 'Nueva Especialidad'} size="md">
            <form onSubmit={handleSubmit} className="p-6">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><BookOpen className="h-5 w-5 text-gray-400" /></div>
                            <input type="text" name="nombreEspecialidad" value={formData.nombreEspecialidad} onChange={handleChange} required className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" placeholder="Ej: Matemáticas" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                        <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} rows={3} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Estado *</label>
                        <select name="estado" value={formData.estado} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                            <option value={1}>Activo</option><option value={0}>Inactivo</option>
                        </select>
                    </div>
                </div>
                <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-100">
                    <button type="button" onClick={onClose} disabled={isLoading} className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg">Cancelar</button>
                    <button type="submit" disabled={isLoading} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark">{isLoading ? 'Guardando...' : especialidad ? 'Actualizar' : 'Crear'}</button>
                </div>
            </form>
        </Modal>
    );
};
export default EspecialidadForm;