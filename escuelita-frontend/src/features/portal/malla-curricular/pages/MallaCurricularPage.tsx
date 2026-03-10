import { BookOpen, Edit, Plus, Search, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import MallaCurricularForm from '../components/MallaCurricularForm';
import { useMallaCurricular } from '../hooks/useMallaCurricular';
import type { MallaCurricular, MallaCurricularFormData } from '../types';

const MallaCurricularPage: React.FC = () => {
    const {
        mallasCurriculares,
        cursos,
        areas,
        loading,
        error,
        fetchMallasCurriculares,
        createMallaCurricular,
        updateMallaCurricular,
        deleteMallaCurricular
    } = useMallaCurricular();

    const [searchTerm, setSearchTerm] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingMalla, setEditingMalla] = useState<MallaCurricular | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchMallasCurriculares();
    }, [fetchMallasCurriculares]);

    const filteredMallas = mallasCurriculares.filter(malla => {
        const curso = cursos.find(c => c.idCurso === malla.idCurso.idCurso);
        const area = areas.find(a => a.idArea === malla.idArea.idArea);

        const cursoNombre = curso?.nombreCurso || '';
        const areaNombre = area?.nombreArea || '';
        const gradoLabel = malla.grado;
        const anioString = malla.anio.toString();

        const searchString = `${cursoNombre} ${areaNombre} ${gradoLabel} ${anioString}`.toLowerCase();
        return searchString.includes(searchTerm.toLowerCase());
    });

    const totalPages = Math.ceil(filteredMallas.length / itemsPerPage);
    const paginatedMallas = filteredMallas.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleCreate = async (data: MallaCurricularFormData) => {
        try {
            await createMallaCurricular(data);
            toast.success('Malla curricular creada exitosamente');
        } catch {
            toast.error('Error al crear la malla curricular');
        }
    };

    const handleUpdate = async (data: MallaCurricularFormData) => {
        if (!editingMalla) return;

        try {
            await updateMallaCurricular(editingMalla.idMallaCurricular, data);
            toast.success('Malla curricular actualizada exitosamente');
            setEditingMalla(null);
        } catch {
            toast.error('Error al actualizar la malla curricular');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('¿Está seguro de que desea eliminar esta malla curricular?')) return;

        try {
            await deleteMallaCurricular(id);
            toast.success('Malla curricular eliminada exitosamente');
        } catch {
            toast.error('Error al eliminar la malla curricular');
        }
    };

    const handleEdit = (malla: MallaCurricular) => {
        setEditingMalla(malla);
        setIsFormOpen(true);
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setEditingMalla(null);
    };

    const getGradoLabel = (grado: string) => {
        const grados = {
            'PRIMERO': 'Primero',
            'SEGUNDO': 'Segundo',
            'TERCERO': 'Tercero',
            'CUARTO': 'Cuarto',
            'QUINTO': 'Quinto',
            'SEXTO': 'Sexto'
        };
        return grados[grado as keyof typeof grados] || grado;
    };

    if (error) {
        return (
            <div className="p-6">
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                    <p className="text-red-800">Error: {error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                    <BookOpen className="h-8 w-8 text-blue-600" />
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Malla Curricular</h1>
                        <p className="text-gray-600">Gestión de asignación de cursos por grado y año</p>
                    </div>
                </div>
                <button
                    onClick={() => setIsFormOpen(true)}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                    <Plus size={20} />
                    <span>Nueva Malla</span>
                </button>
            </div>

            {/* Barra de búsqueda */}
            <div className="mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                        type="text"
                        placeholder="Buscar por curso, área, grado o año..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            {/* Tabla */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Año
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Grado
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Área
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Curso
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-4 text-center">
                                        <div className="flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                            <span className="ml-2 text-gray-600">Cargando...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : paginatedMallas.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                                        {searchTerm ? 'No se encontraron mallas curriculares que coincidan con la búsqueda' : 'No hay mallas curriculares registradas'}
                                    </td>
                                </tr>
                            ) : (
                                paginatedMallas.map((malla) => {
                                    const curso = cursos.find(c => c.idCurso === malla.idCurso.idCurso);
                                    const area = areas.find(a => a.idArea === malla.idArea.idArea);

                                    return (
                                        <tr key={malla.idMallaCurricular} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {malla.anio}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {getGradoLabel(malla.grado)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {area?.nombreArea || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {curso?.nombreCurso || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => handleEdit(malla)}
                                                        className="text-blue-600 hover:text-blue-900 p-1"
                                                        title="Editar"
                                                    >
                                                        <Edit size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(malla.idMallaCurricular)}
                                                        className="text-red-600 hover:text-red-900 p-1"
                                                        title="Eliminar"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Paginación */}
                {totalPages > 1 && (
                    <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                        <div className="flex-1 flex justify-between sm:hidden">
                            <button
                                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                disabled={currentPage === 1}
                                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                            >
                                Anterior
                            </button>
                            <button
                                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                disabled={currentPage === totalPages}
                                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-50 disabled:opacity-50"
                            >
                                Siguiente
                            </button>
                        </div>
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-gray-700">
                                    Mostrando <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> a{' '}
                                    <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredMallas.length)}</span> de{' '}
                                    <span className="font-medium">{filteredMallas.length}</span> resultados
                                </p>
                            </div>
                            <div>
                                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                    <button
                                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                        disabled={currentPage === 1}
                                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                    >
                                        Anterior
                                    </button>
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                page === currentPage
                                                    ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                            }`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                        disabled={currentPage === totalPages}
                                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                    >
                                        Siguiente
                                    </button>
                                </nav>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal del formulario */}
            <MallaCurricularForm
                isOpen={isFormOpen}
                onClose={handleCloseForm}
                onSubmit={editingMalla ? handleUpdate : handleCreate}
                initialData={editingMalla ? {
                    idMallaCurricular: editingMalla.idMallaCurricular,
                    anio: editingMalla.anio,
                    grado: editingMalla.grado,
                    idCurso: editingMalla.idCurso.idCurso,
                    idArea: editingMalla.idArea.idArea,
                    estado: editingMalla.estado
                } : undefined}
                cursos={cursos}
                areas={areas}
                loading={loading}
            />
        </div>
    );
};

export default MallaCurricularPage;