import { Calendar, CheckCircle, Edit, FileText, IdCard, Phone, Plus, Search, Trash2, User, UserCircle, Users, X, XCircle } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Toaster, toast } from 'sonner';
import Pagination from '../../../../components/common/Pagination';
import { obtenerTodosDocumentos } from '../../matriculas/api/documentosAlumnoApi';
import { obtenerTodosRequisitos } from '../../matriculas/api/requisitosApi';
import type { DocumentoAlumno, RequisitoDocumento } from '../../matriculas/types';
import { obtenerTiposDocumento } from '../api/alumnosApi';
import AlumnoForm from '../components/AlumnoForm';
import { useAlumnos } from '../hooks/useAlumnos';
import type { Alumno, AlumnoFormData, TipoDocumento } from '../types';

const AlumnosPage: React.FC = () => {
    const { 
        alumnos, 
        loading, 
        guardarAlumno, 
        modificarAlumno, 
        eliminarAlumnoById,
        cargarAlumnos 
    } = useAlumnos();
    
    const [showModal, setShowModal] = useState(false);
    const [alumnoEditar, setAlumnoEditar] = useState<Alumno | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [tiposDocumento, setTiposDocumento] = useState<TipoDocumento[]>([]);
    const [loadingData, setLoadingData] = useState(true);
    const [documentos, setDocumentos] = useState<DocumentoAlumno[]>([]);
    const [requisitos, setRequisitos] = useState<RequisitoDocumento[]>([]);

    // Cargar alumnos al montar
    useEffect(() => {
        cargarAlumnos();
    }, [cargarAlumnos]);

    // Cargar tipos de documento, requisitos y documentos
    useEffect(() => {
        const cargarDatos = async () => {
            try {
                setLoadingData(true);
                const [tiposData, requisitosData, documentosData] = await Promise.all([
                    obtenerTiposDocumento(),
                    obtenerTodosRequisitos(),
                    obtenerTodosDocumentos(),
                ]);
                setTiposDocumento(tiposData);
                setRequisitos(requisitosData);
                setDocumentos(documentosData);
            } catch (error) {
                console.error('Error cargando datos:', error);
                toast.error('Error al cargar datos');
            } finally {
                setLoadingData(false);
            }
        };
        cargarDatos();
    }, []);

    // Calcular estadísticas de documentos por alumno
    const obtenerEstadoDocumentos = (idAlumno: number) => {
        const docsAlumno = documentos.filter(doc => doc.idAlumno.idAlumno === idAlumno);
        const obligatorios = requisitos.filter(req => req.esObligatorio);
        const presentados = docsAlumno.filter(doc =>
            doc.idRequisito && obligatorios.some(req => req.idRequisito === doc.idRequisito?.idRequisito)
        );
        const total = obligatorios.length;
        const count = presentados.length;
        return {
            total,
            presentados: count,
            porcentaje: total > 0 ? Math.round((count / total) * 100) : 0,
            completo: total > 0 && count === total,
        };
    };

    const normalizeText = (value?: string | number | null) =>
        String(value ?? '')
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');

    // Filtrar alumnos por búsqueda
    const alumnosFiltrados = alumnos.filter(alumno => {
        const search = normalizeText(searchTerm.trim());
        if (!search) return true;

        return (
            normalizeText(alumno.nombres).includes(search) ||
            normalizeText(alumno.apellidos).includes(search) ||
            normalizeText(alumno.numeroDocumento).includes(search) ||
            normalizeText(alumno.idSede.nombreSede).includes(search)
        );
    });

    // Aplicar paginación
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const alumnosPaginados = alumnosFiltrados.slice(indexOfFirstItem, indexOfLastItem);

    // Resetear a la página 1 cuando cambia el término de búsqueda
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const handleNuevo = () => {
        setAlumnoEditar(null);
        setShowModal(true);
    };

    const handleEditar = (alumno: Alumno) => {
        setAlumnoEditar(alumno);
        setShowModal(true);
    };

    const handleEliminar = async (id: number) => {
        if (window.confirm('¿Está seguro de eliminar este alumno?')) {
            try {
                await eliminarAlumnoById(id);
                toast.success('Alumno eliminado exitosamente');
            } catch (error) {
                toast.error('Error al eliminar el alumno');
            }
        }
    };

    const handleSubmit = async (data: AlumnoFormData) => {
        try {
            // Obtener el idSede del usuario logueado
            const userStr = localStorage.getItem('escuela_user');
            if (!userStr) {
                toast.error('No se pudo obtener la información del usuario');
                return;
            }
            
            const user = JSON.parse(userStr);
            const idSedeUsuario = user.sede?.idSede;
            
            if (!idSedeUsuario) {
                toast.error('No se pudo obtener la sede del usuario');
                return;
            }
            
            // Agregar el idSede del usuario logueado a los datos
            const dataConSede = {
                ...data,
                idSede: idSedeUsuario
            };
            
            if (alumnoEditar) {
                await modificarAlumno(dataConSede);
                toast.success('Alumno actualizado exitosamente');
            } else {
                await guardarAlumno(dataConSede);
                toast.success('Alumno creado exitosamente');
            }
            setShowModal(false);
            setAlumnoEditar(null);
        } catch (error: any) {
            console.error('Error al guardar alumno:', error);
            const errorMessage = error.message || (alumnoEditar ? 'Error al actualizar el alumno' : 'Error al crear el alumno');
            toast.error(errorMessage);
        }
    };

    const handleCancelar = () => {
        setShowModal(false);
        setAlumnoEditar(null);
    };

    // Calcular estadísticas
    const totalAlumnos = alumnosFiltrados.length;
    const alumnosMasculinos = alumnosFiltrados.filter(a => a.genero === 'M').length;
    const alumnosFemeninos = alumnosFiltrados.filter(a => a.genero === 'F').length;

    // Calcular edad promedio
    const calcularEdad = (fechaNacimiento: string) => {
        const hoy = new Date();
        const fechaNac = new Date(fechaNacimiento);
        let edad = hoy.getFullYear() - fechaNac.getFullYear();
        const mes = hoy.getMonth() - fechaNac.getMonth();
        if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
            edad--;
        }
        return edad;
    };

    if (loadingData || loading) {
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
                            <Users className="w-7 h-7 text-primary" />
                            <span>Gestión de Alumnos</span>
                        </h1>
                        <p className="text-gray-600 mt-1 text-sm lg:text-base">
                            {totalAlumnos} {totalAlumnos === 1 ? 'alumno' : 'alumnos'} registrados
                        </p>
                    </div>
                    <button
                        onClick={handleNuevo}
                        className="bg-gradient-to-r from-escuela to-escuela-light text-white px-6 py-2.5 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2 whitespace-nowrap"
                    >
                        <Plus className="w-5 h-5" />
                        <span>Nuevo Alumno</span>
                    </button>
                </div>
            </div>

            {/* Estadísticas */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Total Alumnos</p>
                            <p className="text-2xl font-bold text-gray-800">{totalAlumnos}</p>
                        </div>
                        <div className="p-3 bg-blue-50 rounded-lg">
                            <Users className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Masculinos</p>
                            <p className="text-2xl font-bold text-blue-600">{alumnosMasculinos}</p>
                        </div>
                        <div className="p-3 bg-blue-50 rounded-lg">
                            <User className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Femeninos</p>
                            <p className="text-2xl font-bold text-pink-600">{alumnosFemeninos}</p>
                        </div>
                        <div className="p-3 bg-pink-50 rounded-lg">
                            <User className="w-6 h-6 text-pink-600" />
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
                            placeholder="Buscar por nombre, apellido, documento o sede..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg 
                                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
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

            {/* Tabla de alumnos - Desktop */}
            <div className="hidden lg:block bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Alumno
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Documento
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Fecha Nacimiento
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Edad
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Contacto
                                </th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Documentos
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {alumnosPaginados.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                                        <Users className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                                        <p className="text-lg font-medium">No se encontraron alumnos</p>
                                        <p className="text-sm mt-1">
                                            {searchTerm 
                                                ? 'Intenta con otros criterios de búsqueda' 
                                                : 'Crea tu primer alumno haciendo clic en "Nuevo Alumno"'
                                            }
                                        </p>
                                    </td>
                                </tr>
                            ) : (
                                alumnosPaginados.map((alumno) => (
                                    <tr key={alumno.idAlumno} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-white overflow-hidden flex-shrink-0
                                                              ${alumno.genero === 'M' ? 'bg-blue-500' : 'bg-pink-500'}`}>
                                                    {alumno.fotoUrl ? (
                                                        <img
                                                            src={`${import.meta.env.VITE_API_BASE_URL || 'http://primaria.spring.informaticapp.com:4040'}${alumno.fotoUrl}`}
                                                            alt={alumno.nombres}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <>{alumno.nombres.charAt(0)}{alumno.apellidos.charAt(0)}</>
                                                    )}
                                                </div>
                                                <div className="ml-3">
                                                    <Link 
                                                        to={`/escuela/alumnos/${alumno.idAlumno}`}
                                                        className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline uppercase"
                                                    >
                                                        {alumno.nombres} {alumno.apellidos}
                                                    </Link>
                                                    <p className="text-xs text-gray-500">
                                                        {alumno.genero === 'M' ? 'Masculino' : 'Femenino'}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center text-sm">
                                                <IdCard className="w-4 h-4 mr-2 text-gray-400" />
                                                <div>
                                                    <p className="text-gray-900">{alumno.numeroDocumento}</p>
                                                    <p className="text-xs text-gray-500">{alumno.idTipoDoc.descripcion}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center text-sm text-gray-900">
                                                <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                                                {new Date(alumno.fechaNacimiento).toLocaleDateString('es-PE')}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {calcularEdad(alumno.fechaNacimiento)} años
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {alumno.telefonoContacto && (
                                                <div className="flex items-center">
                                                    <Phone className="w-4 h-4 mr-2 text-gray-400" />
                                                    {alumno.telefonoContacto}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            {(() => {
                                                const stats = obtenerEstadoDocumentos(alumno.idAlumno);
                                                if (stats.total === 0) return (
                                                    <span className="text-xs text-gray-400">Sin requisitos</span>
                                                );
                                                return (
                                                    <Link
                                                        to={`/escuela/alumnos/${alumno.idAlumno}?tab=documentos`}
                                                        className="inline-flex flex-col items-center gap-1 group"
                                                        title="Ver documentos del alumno"
                                                    >
                                                        {stats.completo ? (
                                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 group-hover:bg-green-200">
                                                                <CheckCircle className="w-3 h-3" />
                                                                Completo
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 group-hover:bg-orange-200">
                                                                <XCircle className="w-3 h-3" />
                                                                {stats.presentados}/{stats.total}
                                                            </span>
                                                        )}
                                                        <div className="w-16 bg-gray-200 rounded-full h-1">
                                                            <div
                                                                className={`h-1 rounded-full ${
                                                                    stats.porcentaje === 100 ? 'bg-green-500' :
                                                                    stats.porcentaje >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                                                                }`}
                                                                style={{ width: `${stats.porcentaje}%` }}
                                                            />
                                                        </div>
                                                    </Link>
                                                );
                                            })()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleEditar(alumno)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Editar"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleEliminar(alumno.idAlumno)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Eliminar"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Cards de alumnos - Mobile/Tablet */}
            <div className="lg:hidden space-y-3">
                {alumnosPaginados.length === 0 ? (
                    <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                        <Users className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                        <p className="text-lg font-medium text-gray-900">No se encontraron alumnos</p>
                        <p className="text-sm text-gray-500 mt-1">
                            {searchTerm 
                                ? 'Intenta con otros criterios de búsqueda' 
                                : 'Crea tu primer alumno haciendo clic en "Nuevo Alumno"'
                            }
                        </p>
                    </div>
                ) : (
                    alumnosPaginados.map((alumno) => (
                        <div key={alumno.idAlumno} className="bg-white rounded-lg border border-gray-200 p-4">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold text-white overflow-hidden flex-shrink-0
                                                  ${alumno.genero === 'M' ? 'bg-blue-500' : 'bg-pink-500'}`}>
                                        {alumno.fotoUrl ? (
                                            <img
                                                src={`${import.meta.env.VITE_API_BASE_URL || 'http://primaria.spring.informaticapp.com:4040'}${alumno.fotoUrl}`}
                                                alt={alumno.nombres}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <>{alumno.nombres.charAt(0)}{alumno.apellidos.charAt(0)}</>
                                        )}
                                    </div>
                                    <div className="ml-3">
                                        <Link 
                                            to={`/escuela/alumnos/${alumno.idAlumno}`}
                                            className="font-semibold text-blue-600 hover:text-blue-800 hover:underline uppercase"
                                        >
                                            {alumno.nombres} {alumno.apellidos}
                                        </Link>
                                        <p className="text-xs text-gray-500">{alumno.genero === 'M' ? 'Masculino' : 'Femenino'}</p>
                                    </div>
                                </div>
                                <div className="flex gap-1">
                                    <button
                                        onClick={() => handleEditar(alumno)}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleEliminar(alumno.idAlumno)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            
                            <div className="space-y-2 text-sm">
                                <div className="flex items-center text-gray-600">
                                    <IdCard className="w-4 h-4 mr-2 flex-shrink-0" />
                                    <span className="font-medium">{alumno.idTipoDoc.descripcion}:</span>
                                    <span className="ml-1">{alumno.numeroDocumento}</span>
                                </div>
                                <div className="flex items-center text-gray-600">
                                    <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                                    <span>{new Date(alumno.fechaNacimiento).toLocaleDateString('es-PE')}</span>
                                    <span className="ml-2 text-gray-500">({calcularEdad(alumno.fechaNacimiento)} años)</span>
                                </div>
                                {alumno.telefonoContacto && (
                                    <div className="flex items-center text-gray-600">
                                        <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                                        <span>{alumno.telefonoContacto}</span>
                                    </div>
                                )}
                                {(() => {
                                    const stats = obtenerEstadoDocumentos(alumno.idAlumno);
                                    if (stats.total === 0) return null;
                                    return (
                                        <div className="flex items-center text-gray-600">
                                            <FileText className="w-4 h-4 mr-2 flex-shrink-0" />
                                            <Link
                                                to={`/escuela/alumnos/${alumno.idAlumno}?tab=documentos`}
                                                className={`text-xs font-medium ${
                                                    stats.completo ? 'text-green-700' : 'text-orange-700'
                                                }`}
                                            >
                                                Docs: {stats.presentados}/{stats.total}
                                                {stats.completo ? ' ✓' : ''}
                                            </Link>
                                        </div>
                                    );
                                })()}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Paginación */}
            {alumnosFiltrados.length > 0 && (
                <div className="mt-4">
                    <Pagination
                        currentPage={currentPage}
                        totalItems={alumnosFiltrados.length}
                        itemsPerPage={itemsPerPage}
                        onPageChange={setCurrentPage}
                    />
                </div>
            )}

            {/* Modal de formulario */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-[900px] h-[550px] overflow-hidden flex flex-col">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-[#064e3b] via-[#065f46] to-[#059669] p-6 text-white flex justify-between items-center">
                            <h2 className="text-2xl font-bold flex items-center space-x-2">
                                <UserCircle className="w-6 h-6" />
                                <span>{alumnoEditar ? 'Editar Alumno' : 'Nuevo Alumno'}</span>
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
                            <AlumnoForm
                                alumno={alumnoEditar}
                                tiposDocumento={tiposDocumento}
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

export default AlumnosPage;
