import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Search, Edit, Trash2, UserCheck } from 'lucide-react';
import { toast } from 'sonner';
import AsignacionDocenteForm from '../components/AsignacionDocenteForm';
import { useAsignacionDocente } from '../hooks/useAsignacionDocente';
import type { AsignacionDocente, AsignacionDocenteFormData } from '../types';

const AsignacionDocentePage: React.FC = () => {
    const {
        asignacionesDocentes,
        docentes,
        cursos,
        grados,
        secciones,
        aniosEscolares,
        loading,
        error,
        fetchAsignacionesDocentes,
        createAsignacionDocente,
        updateAsignacionDocente,
        deleteAsignacionDocente
    } = useAsignacionDocente();

    const [searchTerm, setSearchTerm] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingAsignacion, setEditingAsignacion] = useState<AsignacionDocente | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchAsignacionesDocentes();
    }, [fetchAsignacionesDocentes]);

    const filteredAsignaciones = useMemo(() => {
        return asignacionesDocentes.filter(asignacion => {
            const docenteNombre = `${asignacion.idDocente?.idUsuario?.nombres || ''} ${asignacion.idDocente?.idUsuario?.apellidos || ''}`.trim();
            const cursoNombre = asignacion.idCurso?.nombreCurso || '';
            const gradoNombre = asignacion.idSeccion?.idGrado?.nombreGrado || '';
            const seccionNombre = asignacion.idSeccion?.nombreSeccion || '';
            const anioNombre = asignacion.idAnioEscolar?.nombreAnio || '';

            const searchString = `${docenteNombre} ${cursoNombre} ${gradoNombre} ${seccionNombre} ${anioNombre}`.toLowerCase();
            return searchString.includes(searchTerm.toLowerCase());
        });
    }, [asignacionesDocentes, searchTerm]);

    const totalPages = Math.ceil(filteredAsignaciones.length / itemsPerPage);
    const paginatedAsignaciones = filteredAsignaciones.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleCreate = async (data: AsignacionDocenteFormData) => {
        try {
            await createAsignacionDocente(data);
            toast.success('Asignación docente creada exitosamente');
        } catch {
            toast.error('Error al crear la asignación docente');
        }
    };

    const handleUpdate = async (data: AsignacionDocenteFormData) => {
        if (!editingAsignacion) return;

        try {
            await updateAsignacionDocente(editingAsignacion.idAsignacion, data);
            toast.success('Asignación docente actualizada exitosamente');
            setEditingAsignacion(null);
        } catch {
            toast.error('Error al actualizar la asignación docente');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('¿Está seguro de que desea eliminar esta asignación docente?')) return;

        try {
            await deleteAsignacionDocente(id);
            toast.success('Asignación docente eliminada exitosamente');
        } catch {
            toast.error('Error al eliminar la asignación docente');
        }
    };

    const handleEdit = (asignacion: AsignacionDocente) => {
        setEditingAsignacion(asignacion);
        setIsFormOpen(true);
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setEditingAsignacion(null);
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
                    <UserCheck className="h-8 w-8 text-blue-600" />
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Asignación Docente</h1>
                        <p className="text-gray-600">Gestión de asignación de docentes a cursos, secciones y año escolar</p>
                    </div>
                </div>
                <button
                    onClick={() => setIsFormOpen(true)}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                    <Plus size={20} />
                    <span>Nueva Asignación</span>
                </button>
            </div>

            <div className="mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                        type="text"
                        placeholder="Buscar por docente, curso, grado, sección o año..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Docente</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Curso</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grado</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sección</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Año Escolar</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-4 text-center">
                                        <div className="flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                            <span className="ml-2 text-gray-600">Cargando...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : paginatedAsignaciones.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                                        {searchTerm ? 'No se encontraron asignaciones docentes que coincidan con la búsqueda' : 'No hay asignaciones docentes registradas'}
                                    </td>
                                </tr>
                            ) : (
                                paginatedAsignaciones.map((asignacion) => (
                                    <tr key={asignacion.idAsignacion} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {asignacion.idDocente?.idUsuario?.nombres} {asignacion.idDocente?.idUsuario?.apellidos}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {asignacion.idCurso?.nombreCurso || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {asignacion.idSeccion?.idGrado?.nombreGrado || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {asignacion.idSeccion?.nombreSeccion || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {asignacion.idAnioEscolar?.nombreAnio || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleEdit(asignacion)}
                                                    className="text-blue-600 hover:text-blue-900 p-1"
                                                    title="Editar"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(asignacion.idAsignacion)}
                                                    className="text-red-600 hover:text-red-900 p-1"
                                                    title="Eliminar"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

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
                                    <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredAsignaciones.length)}</span> de{' '}
                                    <span className="font-medium">{filteredAsignaciones.length}</span> resultados
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

            <AsignacionDocenteForm
                key={`${editingAsignacion?.idAsignacion ?? 'new'}-${isFormOpen ? 'open' : 'closed'}`}
                isOpen={isFormOpen}
                onClose={handleCloseForm}
                onSubmit={editingAsignacion ? handleUpdate : handleCreate}
                initialData={editingAsignacion ? {
                    idAsignacion: editingAsignacion.idAsignacion,
                    idDocente: editingAsignacion.idDocente.idDocente,
                    idCurso: editingAsignacion.idCurso.idCurso,
                    idSeccion: editingAsignacion.idSeccion.idSeccion,
                    idAnioEscolar: editingAsignacion.idAnioEscolar.idAnioEscolar,
                    estado: editingAsignacion.estado ?? 1
                } : undefined}
                docentes={docentes}
                cursos={cursos}
                grados={grados}
                secciones={secciones}
                aniosEscolares={aniosEscolares}
                loading={loading}
            />
        </div>
    );
};

export default AsignacionDocentePage;
