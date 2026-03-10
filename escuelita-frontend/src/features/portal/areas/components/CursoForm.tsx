import { BookOpen, Building2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import Modal from '../../../../components/common/Modal';
import { escuelaAuthService } from '../../../../services/escuelaAuth.service';
import type { Area } from '../types/areas.types';
import type { Curso, CursoDTO } from '../types/cursos.types';

interface CursoFormProps {
    isOpen: boolean;
    onClose: () => void;
    curso?: Curso | null;
    onSubmit: (data: CursoDTO) => Promise<void>;
    isLoading?: boolean;
    areas: Area[]; // Lista de áreas globales
}

const CursoForm: React.FC<CursoFormProps> = ({ 
    isOpen, 
    onClose, 
    curso, 
    onSubmit, 
    isLoading = false,
    areas 
}) => {
    const currentUser = escuelaAuthService.getCurrentUser();
    const idSede = currentUser?.sede?.idSede || 0;

    const [formData, setFormData] = useState<CursoDTO>({
        nombreCurso: '',
        idArea: 0,
        idSede: idSede,
        estado: 1
    });

    useEffect(() => {
        if (curso && isOpen) {
            setFormData({
                nombreCurso: curso.nombreCurso || '',
                idArea: typeof curso.idArea === 'object' ? curso.idArea?.idArea || 0 : curso.idArea || 0,
                idSede: typeof curso.idSede === 'object' ? curso.idSede?.idSede || idSede : curso.idSede || idSede,
                estado: curso.estado || 1
            });
        } else if (isOpen) {
            setFormData({ 
                nombreCurso: '', 
                idArea: 0, 
                idSede: idSede, 
                estado: 1 
            });
        }
    }, [curso, isOpen, idSede]);

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

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={curso ? 'Editar Curso' : 'Nuevo Curso'} size="md">
            <form onSubmit={handleSubmit} className="p-6">
                {/* Mensaje informativo */}
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-700">
                        <strong>Nota:</strong> Los cursos son específicos de tu sede. Selecciona el área académica global y crea cursos personalizados.
                    </p>
                </div>
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Área Académica * <span className="text-xs text-gray-500">(Global)</span>
                        </label>
                        <select 
                            name="idArea" 
                            value={formData.idArea} 
                            onChange={handleChange} 
                            required 
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                            <option value={0}>Seleccione un área</option>
                            {areas
                                .filter(a => a.estado === 1)
                                .map(area => (
                                    <option key={area.idArea} value={area.idArea}>
                                        {area.nombreArea}
                                    </option>
                                ))
                            }
                        </select>
                    </div>

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
                                placeholder="Ej: Aritmética, Álgebra" 
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Sede
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Building2 className="h-5 w-5 text-gray-400" />
                            </div>
                            <input 
                                type="text" 
                                value={`ID: ${idSede} (Tu sede actual)`}
                                disabled
                                className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed" 
                            />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            Los cursos se asignan automáticamente a tu sede
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Estado *</label>
                        <select 
                            name="estado" 
                            value={formData.estado} 
                            onChange={handleChange} 
                            required 
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                            <option value={1}>Activo</option>
                            <option value={0}>Inactivo</option>
                        </select>
                    </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-100">
                    <button 
                        type="button" 
                        onClick={onClose} 
                        disabled={isLoading} 
                        className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
                    >
                        Cancelar
                    </button>
                    <button 
                        type="submit" 
                        disabled={isLoading} 
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
                    >
                        {isLoading ? 'Guardando...' : curso ? 'Actualizar' : 'Crear'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default CursoForm;
