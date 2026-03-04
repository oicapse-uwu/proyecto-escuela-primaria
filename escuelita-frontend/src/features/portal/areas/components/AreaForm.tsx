import React, { useEffect, useState } from 'react';
import { Layers } from 'lucide-react';
import Modal from '../../../../components/common/Modal';
import type { Area, AreaDTO } from '../types/areas.types';

interface AreaFormProps {
    isOpen: boolean;
    onClose: () => void;
    area?: Area | null;
    onSubmit: (data: AreaDTO) => Promise<void>;
    isLoading?: boolean;
}

const AreaForm: React.FC<AreaFormProps> = ({ isOpen, onClose, area, onSubmit, isLoading = false }) => {
    const [formData, setFormData] = useState<AreaDTO>({
        nombreArea: '',
        descripcion: '',
        idSede: 1,
        estado: 1
    });

    useEffect(() => {
        if (area && isOpen) {
            setFormData({
                nombreArea: area.nombreArea || '',
                descripcion: area.descripcion || '',
                idSede: typeof area.idSede === 'object' ? area.idSede?.idSede || 1 : area.idSede || 1,
                estado: area.estado || 1
            });
        } else if (isOpen) {
            setFormData({ nombreArea: '', descripcion: '', idSede: 1, estado: 1 });
        }
    }, [area, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'estado' || name === 'idSede' ? parseInt(value, 10) : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSubmit(formData);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={area ? 'Editar Área' : 'Nueva Área'} size="md">
            <form onSubmit={handleSubmit} className="p-6">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Área *</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Layers className="h-5 w-5 text-gray-400" />
                            </div>
                            <input type="text" name="nombreArea" value={formData.nombreArea} onChange={handleChange} required className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" placeholder="Ej: Ciencias Exactas" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                        <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} rows={3} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">ID Sede *</label>
                            <input type="number" name="idSede" value={formData.idSede} onChange={handleChange} required min="1" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Estado *</label>
                            <select name="estado" value={formData.estado} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                                <option value={1}>Activo</option>
                                <option value={0}>Inactivo</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-100">
                    <button type="button" onClick={onClose} disabled={isLoading} className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg">Cancelar</button>
                    <button type="submit" disabled={isLoading} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark">{isLoading ? 'Guardando...' : area ? 'Actualizar' : 'Guardar'}</button>
                </div>
            </form>
        </Modal>
    );
};
export default AreaForm;