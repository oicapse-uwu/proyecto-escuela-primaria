import { Edit, Plus, Search, Trash2, User } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import DocenteForm from '../components/DocenteForm';
import { useDocentes } from '../hooks/useDocentes';
import type { PerfilDocente, PerfilDocenteFormData } from '../types';

const DocentesPage: React.FC = () => {
    const {
        docentes,
        usuarios,
        especialidades,
        loading,
        error,
        fetchDocentes,
        fetchUsuarios,
        createDocente,
        updateDocente,
        deleteDocente
    } = useDocentes();

    const [searchTerm, setSearchTerm] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingDocente, setEditingDocente] = useState<PerfilDocente | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchDocentes();
    }, [fetchDocentes]);

    const filteredDocentes = docentes.filter(docente => {
        const nombreUsuario = `${docente.idUsuario?.nombres || ''} ${docente.idUsuario?.apellidos || ''}`.trim()
            || docente.idUsuario?.usuario
            || docente.idUsuario?.correo
            || '';

        const nombreEspecialidad = docente.idEspecialidad?.nombreEspecialidad || '';
        const gradoAcademico = docente.gradoAcademico || '';

        const searchString = `${nombreUsuario} ${nombreEspecialidad} ${gradoAcademico} ${docente.estadoLaboral}`.toLowerCase();
        return searchString.includes(searchTerm.toLowerCase());
    });

    const totalPages = Math.ceil(filteredDocentes.length / itemsPerPage);
    const paginatedDocentes = filteredDocentes.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleCreate = async (data: PerfilDocenteFormData) => {
        try {
            await createDocente(data);
            toast.success('Docente creado exitosamente');
        } catch (error) {
            toast.error('Error al crear el docente');
        }
    };

    const handleUpdate = async (data: PerfilDocenteFormData) => {
        if (!editingDocente) return;

        try {
            await updateDocente(editingDocente.idDocente, data);
            toast.success('Docente actualizado exitosamente');
            setEditingDocente(null);
        } catch (error) {
            toast.error('Error al actualizar el docente');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('¿Está seguro de que desea eliminar este docente?')) return;

        try {
            await deleteDocente(id);
            toast.success('Docente eliminado exitosamente');
        } catch (error) {
            toast.error('Error al eliminar el docente');
        }
    };

    const handleEdit = (docente: PerfilDocente) => {
        setEditingDocente(docente);
        setIsFormOpen(true);
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setEditingDocente(null);
    };

    const getEstadoLaboralLabel = (estado: string) => {
        const estados = {
            'ACTIVO': 'Activo',
            'INACTIVO': 'Inactivo',
            'SUSPENDIDO': 'Suspendido',
            'RENUNCIA': 'Renuncia'
        };
        return estados[estado as keyof typeof estados] || estado;
    };

    const getGradoAcademicoLabel = (grado: string) => {
        const grados = {
            'LICENCIATURA': 'Licenciatura',
            'MAESTRIA': 'Maestría',
            'DOCTORADO': 'Doctorado',
            'TECNICO': 'Técnico',
            'PROFESIONAL': 'Profesional',
            'BACHILLER': 'Bachiller'
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
                    <User className="h-8 w-8 text-blue-600" />
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Gestión de Docentes</h1>
                        <p className="text-gray-600">Administra los perfiles de los docentes</p>
                    </div>
                </div>
                <button
                    onClick={() => setIsFormOpen(true)}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                    <Plus size={20} />
                    <span>Nuevo Docente</span>
                </button>
            </div>

            {/* Barra de búsqueda */}
            <div className="mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                        type="text"
                        placeholder="Buscar por nombre, especialidad, grado o estado..."
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
                                    Nombre
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Grado Académico
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Especialidad
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Estado Laboral
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Fecha Contratación
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Acciones
                                </th>
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
                            ) : paginatedDocentes.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                                        {searchTerm ? 'No se encontraron docentes que coincidan con la búsqueda' : 'No hay docentes registrados'}
                                    </td>
                                </tr>
                            ) : (
                                paginatedDocentes.map((docente) => {
                                    const nombreDocente = `${docente.idUsuario?.nombres || ''} ${docente.idUsuario?.apellidos || ''}`.trim()
                                        || docente.idUsuario?.usuario
                                        || docente.idUsuario?.correo
                                        || 'N/A';

                                    return (
                                        <tr key={docente.idDocente} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {nombreDocente}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {getGradoAcademicoLabel(docente.gradoAcademico)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {docente.idEspecialidad?.nombreEspecialidad || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                    docente.estadoLaboral === 'ACTIVO'
                                                        ? 'bg-green-100 text-green-800'
                                                        : docente.estadoLaboral === 'INACTIVO'
                                                        ? 'bg-red-100 text-red-800'
                                                        : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                    {getEstadoLaboralLabel(docente.estadoLaboral)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {new Date(docente.fechaContratacion).toLocaleDateString('es-ES')}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => handleEdit(docente)}
                                                        className="text-blue-600 hover:text-blue-900 p-1"
                                                        title="Editar"
                                                    >
                                                        <Edit size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(docente.idDocente)}
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
                                    <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredDocentes.length)}</span> de{' '}
                                    <span className="font-medium">{filteredDocentes.length}</span> resultados
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
            <DocenteForm
                isOpen={isFormOpen}
                onClose={handleCloseForm}
                onSubmit={editingDocente ? handleUpdate : handleCreate}
                initialData={editingDocente ? {
                    idDocente: editingDocente.idDocente,
                    gradoAcademico: editingDocente.gradoAcademico,
                    fechaContratacion: editingDocente.fechaContratacion,
                    estadoLaboral: editingDocente.estadoLaboral,
                    idUsuario: editingDocente.idUsuario.idUsuario,
                    idEspecialidad: editingDocente.idEspecialidad.idEspecialidad,
                    estado: editingDocente.estado
                } : undefined}
                usuarios={usuarios}
                especialidades={especialidades}
                loading={loading}
                fetchUsuarios={fetchUsuarios}
            />
        </div>
    );
};

export default DocentesPage;