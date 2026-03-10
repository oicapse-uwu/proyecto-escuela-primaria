import React, { useEffect } from 'react';
import Modal from '../../../../components/common/Modal';
import type { Area, Curso, MallaCurricularFormData } from '../types';

interface MallaCurricularFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: MallaCurricularFormData) => Promise<void>;
    initialData?: MallaCurricularFormData;
    cursos: Curso[];
    areas: Area[];
    loading?: boolean;
}

const GRADOS = [
    { value: 'PRIMERO', label: 'Primero' },
    { value: 'SEGUNDO', label: 'Segundo' },
    { value: 'TERCERO', label: 'Tercero' },
    { value: 'CUARTO', label: 'Cuarto' },
    { value: 'QUINTO', label: 'Quinto' },
    { value: 'SEXTO', label: 'Sexto' }
];

const MallaCurricularForm: React.FC<MallaCurricularFormProps> = ({
    isOpen,
    onClose,
    onSubmit,
    initialData,
    cursos,
    areas,
    loading = false
}) => {
    const [formData, setFormData] = React.useState<MallaCurricularFormData>(() => 
        initialData || {
            anio: new Date().getFullYear(),
            grado: '',
            idCurso: 0,
            idArea: 0
        }
    );

    // Sincronizar datos cuando cambia initialData
    useEffect(() => {
        if (initialData && isOpen) {
            // Solo leer initialData, no setear estado
            // El estado se inicializa en useState
        }
    }, [initialData, isOpen]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!formData.anio || !formData.grado || !formData.idCurso || !formData.idArea) {
            alert('Todos los campos son obligatorios');
            return;
        }

        try {
            await onSubmit(formData);
            onClose();
        } catch {
            // Error ya manejado en el hook
        }
    };

    const handleClose = () => {
        setFormData({
            anio: new Date().getFullYear(),
            grado: '',
            idCurso: 0,
            idArea: 0
        });
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title={initialData?.idMallaCurricular ? 'Editar Malla Curricular' : 'Nueva Malla Curricular'}
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Año */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Año *
                    </label>
                    <input
                        type="number"
                        value={formData.anio}
                        onChange={(e) => setFormData({...formData, anio: Number(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min="2020"
                        max="2030"
                        required
                    />
                </div>

                {/* Grado */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Grado *
                    </label>
                    <select
                        value={formData.grado}
                        onChange={(e) => setFormData({...formData, grado: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    >
                        <option value="">Seleccionar grado</option>
                        {GRADOS.map(grado => (
                            <option key={grado.value} value={grado.value}>
                                {grado.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Área */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Área *
                    </label>
                    <select
                        value={formData.idArea}
                        onChange={(e) => setFormData({...formData, idArea: Number(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    >
                        <option value={0}>Seleccionar área</option>
                        {areas.map(area => (
                            <option key={area.idArea} value={area.idArea}>
                                {area.nombreArea}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Curso */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Curso *
                    </label>
                    <select
                        value={formData.idCurso}
                        onChange={(e) => setFormData({...formData, idCurso: Number(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    >
                        <option value={0}>Seleccionar curso</option>
                        {cursos
                            .filter(curso => curso.idArea === formData.idArea)
                            .map(curso => (
                                <option key={curso.idCurso} value={curso.idCurso}>
                                    {curso.nombreCurso}
                                </option>
                            ))}
                    </select>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                    <button
                        type="button"
                        onClick={handleClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                        disabled={loading}
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors disabled:opacity-50"
                        disabled={loading}
                    >
                        {loading ? 'Guardando...' : (initialData?.idMallaCurricular ? 'Actualizar' : 'Crear')}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default MallaCurricularForm;