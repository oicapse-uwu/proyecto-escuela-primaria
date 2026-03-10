import { Calendar, CheckCircle, Edit, FileText, GraduationCap, Plus, Search, Trash2, User, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Toaster, toast } from 'sonner';
import Pagination from '../../../../components/common/Pagination';
import { filtrarPorSedeActual } from '../../../../utils/sedeFilter';
import { obtenerTodosAlumnos } from '../../alumnos/api/alumnosApi';
import type { Alumno } from '../../alumnos/types';
import {
    actualizarMatricula,
    crearMatricula,
    eliminarMatricula,
    obtenerTodasMatriculas,
    obtenerTodasSecciones,
    obtenerTodosAniosEscolares
} from '../api/matriculasApi';
import MatriculaForm from '../components/MatriculaForm';
import type { AnioEscolar, Matricula, MatriculaFormData, Seccion } from '../types';

const MatriculasPage: React.FC = () => {
    const [matriculas, setMatriculas] = useState<Matricula[]>([]);
    const [alumnos, setAlumnos] = useState<Alumno[]>([]);
    const [secciones, setSecciones] = useState<Seccion[]>([]);
    const [aniosEscolares, setAniosEscolares] = useState<AnioEscolar[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [matriculaEditar, setMatriculaEditar] = useState<Matricula | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [filterEstado, setFilterEstado] = useState<string>('');

    // Cargar datos al montar el componente
    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        try {
            setLoading(true);
            const [matriculasData, alumnosData, seccionesData, aniosData] = await Promise.all([
                obtenerTodasMatriculas(),
                obtenerTodosAlumnos(),
                obtenerTodasSecciones(),
                obtenerTodosAniosEscolares()
            ]);
            // 🔒 FILTRAR POR SEDE DEL USUARIO ACTUAL
            const alumnosFiltrados = filtrarPorSedeActual(alumnosData);
            const user = JSON.parse(localStorage.getItem('escuela_user') || '{}');
            const idSedeActual = user?.sede?.idSede;
            const matriculasFiltradas = matriculasData.filter(m =>
                m.idAlumno?.idSede?.idSede === idSedeActual
            );
            const seccionesFiltradas = seccionesData.filter(s =>
                s.idSede?.idSede === idSedeActual
            );
            const aniosFiltrados = aniosData.filter(a =>
                a.idSede?.idSede === idSedeActual
            );
            setMatriculas(matriculasFiltradas);
            setAlumnos(alumnosFiltrados);
            setSecciones(seccionesFiltradas);
            setAniosEscolares(aniosFiltrados);
        } catch (error) {
            console.error('Error cargando datos:', error);
            toast.error('Error al cargar datos');
        } finally {
            setLoading(false);
        }
    };

    const normalizeText = (value?: string | number | null) =>
        String(value ?? '')
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');

    const matriculasFiltradas = matriculas.filter(mat => {
        const search = normalizeText(searchTerm.trim());
        const matchSearch = !search || 
            normalizeText(mat.idAlumno?.nombres).includes(search) ||
            normalizeText(mat.idAlumno?.apellidos).includes(search) ||
            normalizeText(mat.codigoMatricula).includes(search);
        
        const matchEstado = !filterEstado || mat.estadoMatricula === filterEstado;
        
        return matchSearch && matchEstado;
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const matriculasPaginadas = matriculasFiltradas.slice(indexOfFirstItem, indexOfLastItem);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, filterEstado]);

    const handleNuevo = () => {
        setMatriculaEditar(null);
        setShowModal(true);
    };

    const handleEditar = (matricula: Matricula) => {
        setMatriculaEditar(matricula);
        setShowModal(true);
    };

    const handleEliminar = async (id: number) => {
        if (window.confirm('¿Está seguro de eliminar esta matrícula?')) {
            try {
                await eliminarMatricula(id);
                toast.success('Matrícula eliminada exitosamente');
                cargarDatos();
            } catch (error) {
                toast.error('Error al eliminar matrícula');
            }
        }
    };

    const handleSubmit = async (formData: MatriculaFormData) => {
        const payload = {
            ...formData,
            observaciones: formData.observaciones || undefined,
        };

        try {
            if (matriculaEditar) {
                await actualizarMatricula(payload);
                toast.success('Matrícula actualizada exitosamente');
            } else {
                await crearMatricula(payload);
                toast.success('Matrícula creada exitosamente');
            }
            setShowModal(false);
            cargarDatos();
        } catch (error: any) {
            console.error(error);
            const mensajeError = error.response?.data || error.message || 'Error en la operación';
            
            // Mostrar mensaje específico si es error de vacantes
            if (mensajeError.includes('No hay vacantes disponibles')) {
                toast.error('❌ ' + mensajeError);
            } else {
                toast.error(matriculaEditar ? 'Error al actualizar matrícula' : 'Error al crear matrícula');
            }
        }
    };

    const handleCancelar = () => {
        setShowModal(false);
        setMatriculaEditar(null);
    };

    const totalMatriculas = matriculasFiltradas.length;
    const matriculasActivas = matriculasFiltradas.filter(m => m.estadoMatricula === 'Activa').length;
    const matriculasPendientes = matriculasFiltradas.filter(m => m.estadoMatricula === 'Pendiente_Pago').length;
    const matriculasCanceladas = matriculasFiltradas.filter(m => m.estadoMatricula === 'Cancelada').length;

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
                    <p className="mt-4 text-gray-600 font-medium">Cargando...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="px-3 pt-6 pb-3 sm:px-4 sm:pt-8 sm:pb-4 lg:px-6 lg:pt-8 lg:pb-6 overflow-x-hidden">
            <Toaster position="top-right" richColors />
            
            {/* Encabezado */}
            <div className="mb-3 lg:mb-4">
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 flex items-center space-x-3">
                            <GraduationCap className="w-7 h-7 text-emerald-700" />
                            <span>Gestión de Matrículas</span>
                        </h1>
                        <p className="text-gray-600 mt-1 text-sm lg:text-base">
                            {totalMatriculas} {totalMatriculas === 1 ? 'matrícula' : 'matrículas'} registradas
                        </p>
                    </div>
                    <button
                        onClick={handleNuevo}
                        className="bg-emerald-700 text-white px-4 lg:px-5 py-2.5 rounded-lg hover:bg-emerald-800 transition-colors flex items-center justify-center space-x-2 shadow-md whitespace-nowrap"
                    >
                        <Plus className="w-5 h-5" />
                        <span>Nueva Matrícula</span>
                    </button>
                </div>
            </div>

            {/* Estadísticas */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Total</p>
                            <p className="text-2xl font-bold text-gray-800">{totalMatriculas}</p>
                        </div>
                        <div className="p-3 bg-blue-50 rounded-lg">
                            <GraduationCap className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Activas</p>
                            <p className="text-2xl font-bold text-emerald-600">{matriculasActivas}</p>
                        </div>
                        <div className="p-3 bg-emerald-50 rounded-lg">
                            <CheckCircle className="w-6 h-6 text-emerald-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Pendiente Pago</p>
                            <p className="text-2xl font-bold text-yellow-600">{matriculasPendientes}</p>
                        </div>
                        <div className="p-3 bg-yellow-50 rounded-lg">
                            <FileText className="w-6 h-6 text-yellow-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Canceladas</p>
                            <p className="text-2xl font-bold text-red-600">{matriculasCanceladas}</p>
                        </div>
                        <div className="p-3 bg-red-50 rounded-lg">
                            <User className="w-6 h-6 text-red-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Búsqueda y filtros */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4 shadow-sm">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Buscar por alumno o código..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        />
                    </div>
                    <select
                        value={filterEstado}
                        onChange={(e) => setFilterEstado(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                    >
                        <option value="">Todos los estados</option>
                        <option value="Activa">Activa</option>
                        <option value="Retirada">Retirada</option>
                        <option value="Trasladado_Saliente">Trasladado Saliente</option>
                    </select>
                    <select
                        value={itemsPerPage}
                        onChange={(e) => {
                            setItemsPerPage(Number(e.target.value));
                            setCurrentPage(1);
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                    >
                        <option value={10}>10 por página</option>
                        <option value={25}>25 por página</option>
                        <option value={50}>50 por página</option>
                        <option value={100}>100 por página</option>
                    </select>
                </div>
            </div>

            {/* Tabla - Desktop */}
            <div className="hidden lg:block bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Código
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Alumno
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Fecha Matrícula
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Estado
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tipo de Ingreso
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {matriculasPaginadas.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                        <GraduationCap className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                                        <p className="text-lg font-medium">No se encontraron matrículas</p>
                                        <p className="text-sm mt-1">
                                            {searchTerm || filterEstado
                                                ? 'Intenta con otros criterios de búsqueda' 
                                                : 'Crea tu primera matrícula haciendo clic en "Nueva Matrícula"'
                                            }
                                        </p>
                                    </td>
                                </tr>
                            ) : (
                                matriculasPaginadas.map((matricula) => {
                                    const estadoColor: Record<string, string> = {
                                        'Pendiente_Pago': 'bg-yellow-100 text-yellow-800',
                                        'Activa': 'bg-emerald-100 text-emerald-800',
                                        'Finalizada': 'bg-gray-100 text-gray-800',
                                        'Cancelada': 'bg-red-100 text-red-800'
                                    };
                                    const estadoLabel: Record<string, string> = {
                                        'Pendiente_Pago': 'Pendiente de Pago',
                                        'Activa': 'Activa',
                                        'Finalizada': 'Finalizada',
                                        'Cancelada': 'Cancelada'
                                    };

                                    return (
                                        <tr key={matricula.idMatricula} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center text-sm">
                                                    <FileText className="w-4 h-4 mr-2 text-gray-400" />
                                                    <span className="font-medium text-gray-900">{matricula.codigoMatricula}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm">
                                                    <p className="font-medium text-gray-900">
                                                        {matricula.idAlumno?.nombres} {matricula.idAlumno?.apellidos}
                                                    </p>
                                                    <p className="text-gray-500">{matricula.idAlumno?.numeroDocumento}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center text-sm text-gray-900">
                                                    <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                                                    {new Date(matricula.fechaMatricula).toLocaleDateString('es-PE')}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                               ${estadoColor[matricula.estadoMatricula] || 'bg-gray-100 text-gray-800'}`}>
                                                    {estadoLabel[matricula.estadoMatricula] || matricula.estadoMatricula}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {matricula.tipoIngreso || '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => handleEditar(matricula)}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="Editar"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleEliminar(matricula.idMatricula)}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Eliminar"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
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
            </div>

            {/* Cards - Mobile */}
            <div className="lg:hidden space-y-3">
                {matriculasPaginadas.length === 0 ? (
                    <div className="bg-white rounded-lg border border-gray-200 p-8 text-center shadow-sm">
                        <GraduationCap className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                        <p className="text-lg font-medium text-gray-900">No se encontraron matrículas</p>
                        <p className="text-sm text-gray-500 mt-1">
                            {searchTerm || filterEstado
                                ? 'Intenta con otros criterios de búsqueda' 
                                : 'Crea tu primera matrícula haciendo clic en "Nueva Matrícula"'
                            }
                        </p>
                    </div>
                ) : (
                    matriculasPaginadas.map((matricula) => {
                        const estadoColor: Record<string, string> = {
                            'Activa': 'bg-emerald-100 text-emerald-800',
                            'Retirada': 'bg-red-100 text-red-800',
                            'Trasladado_Saliente': 'bg-orange-100 text-orange-800'
                        };
                        const estadoLabel: Record<string, string> = {
                            'Activa': 'Activa',
                            'Retirada': 'Retirada',
                            'Trasladado_Saliente': 'Trasladado Saliente'
                        };

                        return (
                            <div key={matricula.idMatricula} className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <p className="font-semibold text-gray-900">
                                            {matricula.idAlumno?.nombres} {matricula.idAlumno?.apellidos}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">{matricula.codigoMatricula}</p>
                                    </div>
                                    <div className="flex gap-1">
                                        <button
                                            onClick={() => handleEditar(matricula)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleEliminar(matricula.idMatricula)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Estado:</span>
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full 
                                                       ${estadoColor[matricula.estadoMatricula] || 'bg-gray-100 text-gray-800'}`}>
                                            {estadoLabel[matricula.estadoMatricula] || matricula.estadoMatricula}
                                        </span>
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                        <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                                        <span>{new Date(matricula.fechaMatricula).toLocaleDateString('es-PE')}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Paginación */}
            {matriculasFiltradas.length > 0 && (
                <div className="mt-4">
                    <Pagination
                        currentPage={currentPage}
                        totalItems={matriculasFiltradas.length}
                        itemsPerPage={itemsPerPage}
                        onPageChange={setCurrentPage}
                        onItemsPerPageChange={(n) => { setItemsPerPage(n); setCurrentPage(1); }}
                    />
                </div>
            )}

            {/* Modal de formulario */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-[900px] h-[550px] overflow-hidden flex flex-col">
                        {/* Header con degradado */}
                        <div className="bg-gradient-to-r from-[#064e3b] via-[#065f46] to-[#059669] p-6 text-white flex justify-between items-center">
                            <h2 className="text-2xl font-bold flex items-center space-x-2">
                                <GraduationCap className="w-6 h-6" />
                                <span>{matriculaEditar ? 'Editar Matrícula' : 'Nueva Matrícula'}</span>
                            </h2>
                            <button
                                onClick={handleCancelar}
                                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                                disabled={loading}
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Form */}
                        <div className="flex-1 p-6 overflow-y-auto">
                            <MatriculaForm
                                matricula={matriculaEditar}
                                alumnos={alumnos}
                                secciones={secciones}
                                aniosEscolares={aniosEscolares}
                                onSubmit={handleSubmit}
                                onCancel={handleCancelar}
                                isLoading={loading}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MatriculasPage;
