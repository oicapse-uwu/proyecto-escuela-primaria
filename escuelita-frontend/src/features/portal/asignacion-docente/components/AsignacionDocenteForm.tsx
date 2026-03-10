import React, { useState, useMemo } from 'react';
import { X, Save, UserCheck, BookOpen, GraduationCap, Home, Calendar } from 'lucide-react';
import type { AsignacionDocenteFormData, PerfilDocenteOption, Curso, Grado, Seccion, AnioEscolar } from '../types';

interface AsignacionDocenteFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: AsignacionDocenteFormData) => Promise<void>;
    initialData?: AsignacionDocenteFormData;
    docentes: PerfilDocenteOption[];
    cursos: Curso[];
    grados: Grado[];
    secciones: Seccion[];
    aniosEscolares: AnioEscolar[];
    loading?: boolean;
}

const buildInitialData = (
    initialData: AsignacionDocenteFormData | undefined
): AsignacionDocenteFormData => {
    if (initialData) {
        return {
            idAsignacion: initialData.idAsignacion,
            idDocente: initialData.idDocente,
            idCurso: initialData.idCurso,
            idSeccion: initialData.idSeccion,
            idAnioEscolar: initialData.idAnioEscolar,
            estado: initialData.estado ?? 1
        };
    }
    return {
        idDocente: 0,
        idCurso: 0,
        idSeccion: 0,
        idAnioEscolar: 0,
        estado: 1
    };
};

const AsignacionDocenteForm: React.FC<AsignacionDocenteFormProps> = ({
    isOpen,
    onClose,
    onSubmit,
    initialData,
    docentes,
    cursos,
    grados,
    secciones,
    aniosEscolares,
    loading = false
}) => {
    const [formData, setFormData] = useState<AsignacionDocenteFormData>(() => buildInitialData(initialData));
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedGrado, setSelectedGrado] = useState<number>(0);

    const seccionesFiltradas = useMemo(() => {
        if (selectedGrado === 0) return secciones;
        return secciones.filter(s => s.idGrado?.idGrado === selectedGrado);
    }, [secciones, selectedGrado]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const numericValue = ['idDocente', 'idCurso', 'idSeccion', 'idAnioEscolar', 'estado'].includes(name)
            ? Number(value)
            : value;

        setFormData(prev => ({ ...prev, [name]: numericValue }));
    };

    const handleGradoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const gradoId = Number(e.target.value);
        setSelectedGrado(gradoId);
        setFormData(prev => ({ ...prev, idSeccion: 0 }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.idDocente || !formData.idCurso || !formData.idSeccion || !formData.idAnioEscolar) {
            alert('Por favor, completa todos los campos requeridos');
            return;
        }

        setIsSubmitting(true);
        try {
            await onSubmit(formData);
            onClose();
        } catch (error) {
            console.error('Error al guardar:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-indigo-600 text-white px-6 py-4 flex justify-between items-center rounded-t-lg">
                    <div className="flex items-center gap-3">
                        <UserCheck size={24} />
                        <h2 className="text-xl font-bold">
                            {initialData ? 'Editar Asignación' : 'Nueva Asignación de Docente'}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-white hover:bg-indigo-700 p-2 rounded transition-colors"
                        disabled={isSubmitting}
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Año Escolar */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Calendar className="inline mr-2" size={16} />
                            Año Escolar *
                        </label>
                        <select
                            name="idAnioEscolar"
                            value={formData.idAnioEscolar}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            required
                            disabled={loading || isSubmitting}
                        >
                            <option value={0}>Seleccionar año escolar</option>
                            {aniosEscolares.map(anio => (
                                <option key={anio.idAnioEscolar} value={anio.idAnioEscolar}>
                                    {anio.nombreAnio}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Docente */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <UserCheck className="inline mr-2" size={16} />
                            Docente *
                        </label>
                        <select
                            name="idDocente"
                            value={formData.idDocente}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            required
                            disabled={loading || isSubmitting}
                        >
                            <option value={0}>Seleccionar docente</option>
                            {docentes.map(docente => (
                                <option key={docente.idDocente} value={docente.idDocente}>
                                    {docente.idUsuario.nombres} {docente.idUsuario.apellidos}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Curso */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <BookOpen className="inline mr-2" size={16} />
                            Curso *
                        </label>
                        <select
                            name="idCurso"
                            value={formData.idCurso}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            required
                            disabled={loading || isSubmitting}
                        >
                            <option value={0}>Seleccionar curso</option>
                            {cursos.map(curso => (
                                <option key={curso.idCurso} value={curso.idCurso}>
                                    {curso.nombreCurso}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Grado (filtro) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <GraduationCap className="inline mr-2" size={16} />
                            Filtrar por Grado
                        </label>
                        <select
                            value={selectedGrado}
                            onChange={handleGradoChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            disabled={loading || isSubmitting}
                        >
                            <option value={0}>Todos los grados</option>
                            {grados.map(grado => (
                                <option key={grado.idGrado} value={grado.idGrado}>
                                    {grado.nombreGrado}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Sección */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Home className="inline mr-2" size={16} />
                            Sección *
                        </label>
                        <select
                            name="idSeccion"
                            value={formData.idSeccion}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            required
                            disabled={loading || isSubmitting}
                        >
                            <option value={0}>Seleccionar sección</option>
                            {seccionesFiltradas.map(seccion => (
                                <option key={seccion.idSeccion} value={seccion.idSeccion}>
                                    {seccion.nombreSeccion} {seccion.idGrado && `- ${seccion.idGrado.nombreGrado}`}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Estado */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Estado
                        </label>
                        <select
                            name="estado"
                            value={formData.estado}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            disabled={loading || isSubmitting}
                        >
                            <option value={1}>Activo</option>
                            <option value={0}>Inactivo</option>
                        </select>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                            disabled={isSubmitting}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                            disabled={isSubmitting || loading}
                        >
                            <Save size={18} />
                            {isSubmitting ? 'Guardando...' : 'Guardar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AsignacionDocenteForm;
