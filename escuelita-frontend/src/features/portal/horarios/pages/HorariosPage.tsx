import { Calendar, Edit, Plus, Search, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import HorarioForm from '../components/HorarioForm';
import { useHorarios } from '../hooks/useHorarios';
import type { Horario, HorarioFormData } from '../types';

const HorariosPage: React.FC = () => {
    const {
        horarios,
        loading,
        error,
        fetchHorarios,
        createHorario,
        updateHorario,
        deleteHorario,
        asignacionesDocente,
        aulas
    } = useHorarios();

    const [searchTerm, setSearchTerm] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingHorario, setEditingHorario] = useState<Horario | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchHorarios();
    }, [fetchHorarios]);

    const filteredHorarios = horarios.filter(horario => {
        const asignacion = asignacionesDocente.find(a => a.idAsignacion === horario.idAsignacion);
        const aula = aulas.find(a => a.idAula === horario.idAula);

        const docenteNombre = asignacion?.idDocente?.idUsuario?.nombreUsuario || '';
        const cursoNombre = asignacion?.idCurso?.nombreCurso || '';
        const aulaNombre = aula?.nombreAula || '';

        const searchString = `${docenteNombre} ${cursoNombre} ${aulaNombre} ${horario.diaSemana}`.toLowerCase();
        return searchString.includes(searchTerm.toLowerCase());
    });

    const totalPages = Math.ceil(filteredHorarios.length / itemsPerPage);
    const paginatedHorarios = filteredHorarios.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleCreate = async (data: HorarioFormData) => {
        try {
            await createHorario(data);
            toast.success('Horario creado exitosamente');
        } catch {
            toast.error('Error al crear el horario');
        }
    };

    const handleUpdate = async (data: HorarioFormData) => {
        if (!editingHorario) return;

        try {
            await updateHorario(editingHorario.idHorario, data);
            toast.success('Horario actualizado exitosamente');
            setEditingHorario(null);
        } catch {
            toast.error('Error al actualizar el horario');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('¿Está seguro de que desea eliminar este horario?')) return;

        try {
            await deleteHorario(id);
            toast.success('Horario eliminado exitosamente');
        } catch {
            toast.error('Error al eliminar el horario');
        }
    };

    const handleEdit = (horario: Horario) => {
        setEditingHorario(horario);
        setIsFormOpen(true);
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setEditingHorario(null);
    };

    const getDiaSemanaLabel = (dia: string) => {
        const dias = {
            'LUNES': 'Lunes',
            'MARTES': 'Martes',
            'MIERCOLES': 'Miércoles',
            'JUEVES': 'Jueves',
            'VIERNES': 'Viernes',
            'SABADO': 'Sábado',
            'DOMINGO': 'Domingo'
        };
        return dias[dia as keyof typeof dias] || dia;
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
                    <Calendar className="h-8 w-8 text-blue-600" />
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Gestión de Horarios</h1>
                        <p className="text-gray-600">Administra los horarios de clases</p>
                    </div>
                </div>
                <button
                    onClick={() => setIsFormOpen(true)}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                    <Plus size={20} />
                    <span>Nuevo Horario</span>
                </button>
            </div>

            {/* Barra de búsqueda */}
            <div className="mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                        type="text"
                        placeholder="Buscar por docente, curso, aula o día..."
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
                                    Día
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Hora Inicio
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Hora Fin
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Docente
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Curso
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Sección
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Aula
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan={8} className="px-6 py-4 text-center">
                                        <div className="flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                            <span className="ml-2 text-gray-600">Cargando...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : paginatedHorarios.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                                        {searchTerm ? 'No se encontraron horarios que coincidan con la búsqueda' : 'No hay horarios registrados'}
                                    </td>
                                </tr>
                            ) : (
                                paginatedHorarios.map((horario) => {
                                    const asignacion = asignacionesDocente.find(a => a.idAsignacion === horario.idAsignacion);
                                    const aula = aulas.find(a => a.idAula === horario.idAula);

                                    return (
                                        <tr key={horario.idHorario} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {getDiaSemanaLabel(horario.diaSemana)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {horario.horaInicio}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {horario.horaFin}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {asignacion?.idDocente?.idUsuario?.nombreUsuario || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {asignacion?.idCurso?.nombreCurso || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {asignacion?.idSeccion?.nombreSeccion || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {aula?.nombreAula || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => handleEdit(horario)}
                                                        className="text-blue-600 hover:text-blue-900 p-1"
                                                        title="Editar"
                                                    >
                                                        <Edit size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(horario.idHorario)}
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
                                    <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredHorarios.length)}</span> de{' '}
                                    <span className="font-medium">{filteredHorarios.length}</span> resultados
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
            <HorarioForm
                isOpen={isFormOpen}
                onClose={handleCloseForm}
                onSubmit={editingHorario ? handleUpdate : handleCreate}
                initialData={editingHorario ? {
                    idHorario: editingHorario.idHorario,
                    diaSemana: editingHorario.diaSemana,
                    horaInicio: editingHorario.horaInicio,
                    horaFin: editingHorario.horaFin,
                    idAsignacion: editingHorario.idAsignacion,
                    idAula: editingHorario.idAula
                } : undefined}
                asignacionesDocente={asignacionesDocente}
                aulas={aulas}
                loading={loading}
            />
        </div>
    );
};

export default HorariosPage;