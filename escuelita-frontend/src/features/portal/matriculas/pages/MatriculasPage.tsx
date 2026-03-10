import { Calendar, CheckCircle, Edit, FileText, GraduationCap, Plus, Search, Trash2, User } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Toaster, toast } from 'sonner';
import Modal from '../../../../components/common/Modal';
import Pagination from '../../../../components/common/Pagination';
import SearchableSelect from '../../../../components/common/SearchableSelect';
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

    const [formData, setFormData] = useState<MatriculaFormData>({
        idAlumno: 0,
        idSeccion: 0,
        idAnio: 0,
        codigoMatricula: '',
        situacionAcademicaPrevia: 'Ingresante',
        estadoMatricula: 'Activa',
        fechaMatricula: new Date().toISOString().split('T')[0],
        observacionesMatricula: '',
        fechaRetiro: '',
        motivoRetiro: '',
        colegioDestino: ''
    });

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
        setFormData({
            idAlumno: 0,
            idSeccion: 0,
            idAnio: 0,
            codigoMatricula: generarCodigoMatricula(),
            situacionAcademicaPrevia: 'Ingresante',
            estadoMatricula: 'Activa',
            fechaMatricula: new Date().toISOString().split('T')[0],
            observacionesMatricula: '',
            fechaRetiro: '',
            motivoRetiro: '',
            colegioDestino: ''
        });
        setShowModal(true);
    };

    const generarCodigoMatricula = () => {
        const fecha = new Date();
        const año = fecha.getFullYear();
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        return `MAT-${año}-${random}`;
    };

    const handleEditar = (matricula: Matricula) => {
        setMatriculaEditar(matricula);
        const fecha = matricula.fechaMatricula
            ? String(matricula.fechaMatricula).split('T')[0]
            : new Date().toISOString().split('T')[0];
        setFormData({
            idMatricula: matricula.idMatricula,
            idAlumno: matricula.idAlumno?.idAlumno || 0,
            idSeccion: matricula.idSeccion?.idSeccion || 0,
            idAnio: (matricula.idAnio as any)?.idAnioEscolar || 0,
            codigoMatricula: matricula.codigoMatricula || '',
            situacionAcademicaPrevia: matricula.situacionAcademicaPrevia || 'Ingresante',
            estadoMatricula: matricula.estadoMatricula || 'Activa',
            fechaMatricula: fecha,
            observacionesMatricula: matricula.observacionesMatricula || '',
            fechaRetiro: matricula.fechaRetiro || '',
            motivoRetiro: matricula.motivoRetiro || '',
            colegioDestino: matricula.colegioDestino || ''
        });
        setShowModal(true);
    };

    const handleEliminar = async (id: number) => {
        if (window.confirm('¿Está seguro de eliminar esta matrícula?')) {
            try {
                await eliminarMatricula(id);
                toast.success('Matrícula eliminada exitosamente');
                cargarDatos();
            } catch (error) {
                toast.error('Error al eliminar la matrícula');
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.idAlumno || formData.idAlumno === 0) {
            toast.error('Debe seleccionar un alumno');
            return;
        }
        if (!formData.idSeccion || formData.idSeccion === 0) {
            toast.error('Debe seleccionar una sección');
            return;
        }
        if (!formData.idAnio || formData.idAnio === 0) {
            toast.error('Debe seleccionar un año escolar');
            return;
        }
        if (!formData.fechaMatricula) {
            toast.error('La fecha de matrícula es obligatoria');
            return;
        }

        // El backend espera LocalDateTime — agrega hora si no tiene
        const fechaConHora = formData.fechaMatricula.includes('T')
            ? formData.fechaMatricula
            : `${formData.fechaMatricula}T00:00:00`;

        const payload = {
            ...formData,
            fechaMatricula: fechaConHora,
            observacionesMatricula: formData.observacionesMatricula || undefined,
            fechaRetiro: formData.fechaRetiro || undefined,
            motivoRetiro: formData.motivoRetiro || undefined,
            colegioDestino: formData.colegioDestino || undefined,
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
        } catch (error) {
            console.error(error);
            toast.error(matriculaEditar ? 'Error al actualizar la matrícula' : 'Error al crear la matrícula');
        }
    };

    const totalMatriculas = matriculasFiltradas.length;
    const matriculasActivas = matriculasFiltradas.filter(m => m.estadoMatricula === 'Activa').length;
    const matriculasRetiradas = matriculasFiltradas.filter(m => m.estadoMatricula === 'Retirada').length;
    const matriculasTrasladadas = matriculasFiltradas.filter(m => m.estadoMatricula === 'Trasladado_Saliente').length;

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <p className="mt-4 text-gray-600">Cargando...</p>
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
                            <GraduationCap className="w-7 h-7 text-primary" />
                            <span>Gestión de Matrículas</span>
                        </h1>
                        <p className="text-gray-600 mt-1 text-sm lg:text-base">
                            {totalMatriculas} {totalMatriculas === 1 ? 'matrícula' : 'matrículas'} registradas
                        </p>
                    </div>
                    <button
                        onClick={handleNuevo}
                        className="bg-primary text-white px-4 lg:px-5 py-2.5 rounded-lg hover:bg-primary-dark transition-colors flex items-center justify-center space-x-2 shadow-md whitespace-nowrap"
                    >
                        <Plus className="w-5 h-5" />
                        <span>Nueva Matrícula</span>
                    </button>
                </div>
            </div>

            {/* Estadísticas */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="bg-white rounded-lg border border-gray-200 p-4">
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
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Activas</p>
                            <p className="text-2xl font-bold text-green-600">{matriculasActivas}</p>
                        </div>
                        <div className="p-3 bg-green-50 rounded-lg">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Retiradas</p>
                            <p className="text-2xl font-bold text-red-600">{matriculasRetiradas}</p>
                        </div>
                        <div className="p-3 bg-red-50 rounded-lg">
                            <FileText className="w-6 h-6 text-red-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Trasladados</p>
                            <p className="text-2xl font-bold text-orange-600">{matriculasTrasladadas}</p>
                        </div>
                        <div className="p-3 bg-orange-50 rounded-lg">
                            <User className="w-6 h-6 text-orange-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Búsqueda y filtros */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Buscar por alumno o código..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg 
                                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <select
                        value={filterEstado}
                        onChange={(e) => setFilterEstado(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                        <option value={10}>10 por página</option>
                        <option value={25}>25 por página</option>
                        <option value={50}>50 por página</option>
                        <option value={100}>100 por página</option>
                    </select>
                </div>
            </div>

            {/* Tabla - Desktop */}
            <div className="hidden lg:block bg-white rounded-lg border border-gray-200 overflow-hidden">
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
                                    Situación Previa
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
                                        'Activa': 'bg-green-100 text-green-800',
                                        'Retirada': 'bg-red-100 text-red-800',
                                        'Trasladado_Saliente': 'bg-orange-100 text-orange-800'
                                    };
                                    const estadoLabel: Record<string, string> = {
                                        'Activa': 'Activa',
                                        'Retirada': 'Retirada',
                                        'Trasladado_Saliente': 'Trasladado Saliente'
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
                                                    <p className="font-medium text-gray-900 uppercase">
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
                                                {matricula.situacionAcademicaPrevia || '-'}
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
                    <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
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
                            'Activa': 'bg-green-100 text-green-800',
                            'Retirada': 'bg-red-100 text-red-800',
                            'Trasladado_Saliente': 'bg-orange-100 text-orange-800'
                        };
                        const estadoLabel: Record<string, string> = {
                            'Activa': 'Activa',
                            'Retirada': 'Retirada',
                            'Trasladado_Saliente': 'Trasladado Saliente'
                        };

                        return (
                            <div key={matricula.idMatricula} className="bg-white rounded-lg border border-gray-200 p-4">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <p className="font-semibold text-gray-900 uppercase">
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
            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title={matriculaEditar ? 'Editar Matrícula' : 'Nueva Matrícula'}
                size="xl"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        {/* Alumno */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                <User className="inline w-4 h-4 mr-1" />
                                Alumno <span className="text-red-500">*</span>
                            </label>
                            <SearchableSelect
                                value={formData.idAlumno}
                                onChange={(v) => setFormData({...formData, idAlumno: Number(v)})}
                                options={alumnos}
                                getOptionId={(a) => a.idAlumno}
                                getOptionLabel={(a) => `${a.nombres} ${a.apellidos}`}
                                getOptionSubtext={(a) => a.numeroDocumento}
                                placeholder="Buscar por nombre o documento..."
                                required
                                emptyMessage="No se encontraron alumnos"
                            />
                        </div>

                        {/* Sección */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Sección <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={formData.idSeccion}
                                onChange={(e) => setFormData({...formData, idSeccion: Number(e.target.value)})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option value={0}>Seleccione sección...</option>
                                {secciones.map(s => (
                                    <option key={s.idSeccion} value={s.idSeccion}>
                                        {s.idGrado?.nombreGrado ? `${s.idGrado.nombreGrado} - ${s.nombreSeccion}` : s.nombreSeccion}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Año Escolar */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Año Escolar <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={formData.idAnio}
                                onChange={(e) => setFormData({...formData, idAnio: Number(e.target.value)})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option value={0}>Seleccione año escolar...</option>
                                {aniosEscolares.map(a => (
                                    <option key={a.idAnioEscolar} value={a.idAnioEscolar}>
                                        {a.nombreAnio}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Código Matrícula */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                <FileText className="inline w-4 h-4 mr-1" />
                                Código Matrícula
                            </label>
                            <input
                                type="text"
                                value={formData.codigoMatricula}
                                onChange={(e) => setFormData({...formData, codigoMatricula: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="MAT-2026-0001"
                            />
                        </div>

                        {/* Fecha Matrícula */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                <Calendar className="inline w-4 h-4 mr-1" />
                                Fecha Matrícula <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                value={formData.fechaMatricula}
                                onChange={(e) => setFormData({...formData, fechaMatricula: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        {/* Situación Académica Previa */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Situación Académica Previa <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={formData.situacionAcademicaPrevia}
                                onChange={(e) => setFormData({...formData, situacionAcademicaPrevia: e.target.value as any})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option value="Ingresante">Ingresante</option>
                                <option value="Promovido">Promovido</option>
                                <option value="Repitente">Repitente</option>
                            </select>
                        </div>

                        {/* Estado */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Estado <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={formData.estadoMatricula}
                                onChange={(e) => setFormData({...formData, estadoMatricula: e.target.value as any})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option value="Activa">Activa</option>
                                <option value="Retirada">Retirada</option>
                                <option value="Trasladado_Saliente">Trasladado Saliente</option>
                            </select>
                        </div>

                        {/* Observaciones */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Observaciones
                            </label>
                            <textarea
                                value={formData.observacionesMatricula || ''}
                                onChange={(e) => setFormData({...formData, observacionesMatricula: e.target.value})}
                                rows={2}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                                placeholder="Observaciones generales..."
                            />
                        </div>

                        {/* Campos condicionales: Retirada */}
                        {formData.estadoMatricula === 'Retirada' && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Fecha de Retiro
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.fechaRetiro || ''}
                                        onChange={(e) => setFormData({...formData, fechaRetiro: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Motivo de Retiro
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.motivoRetiro || ''}
                                        onChange={(e) => setFormData({...formData, motivoRetiro: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        placeholder="Motivo del retiro..."
                                    />
                                </div>
                            </>
                        )}

                        {/* Campos condicionales: Traslado */}
                        {formData.estadoMatricula === 'Trasladado_Saliente' && (
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Colegio Destino
                                </label>
                                <input
                                    type="text"
                                    value={formData.colegioDestino || ''}
                                    onChange={(e) => setFormData({...formData, colegioDestino: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="Nombre del colegio destino..."
                                />
                            </div>
                        )}

                    </div>

                    {/* Botones */}
                    <div className="flex justify-end gap-3 pt-4 border-t mt-2">
                        <button
                            type="button"
                            onClick={() => setShowModal(false)}
                            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                            {matriculaEditar ? 'Actualizar' : 'Crear'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default MatriculasPage;
