import { Edit, IdCard, Mail, Phone, Plus, Search, Trash2, User, UserCircle, Users, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Toaster, toast } from 'sonner';
import Pagination from '../../../../components/common/Pagination';
import { obtenerTiposDocumento } from '../api/apoderadosApi';
import ApoderadoForm from '../components/ApoderadoForm';
import { useApoderados } from '../hooks/useApoderados';
import type { Apoderado, ApoderadoFormData, TipoDocumento } from '../types';

const ApoderadosPage: React.FC = () => {
    const { 
        apoderados, 
        loading, 
        crear, 
        actualizar, 
        eliminar 
    } = useApoderados();
    
    const [showModal, setShowModal] = useState(false);
    const [apoderadoEditar, setApoderadoEditar] = useState<Apoderado | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [tiposDocumento, setTiposDocumento] = useState<TipoDocumento[]>([]);
    const [loadingData, setLoadingData] = useState(true);

    // Cargar tipos de documento
    useEffect(() => {
        const cargarDatos = async () => {
            try {
                setLoadingData(true);
                const tiposData = await obtenerTiposDocumento();
                setTiposDocumento(tiposData);
            } catch (error) {
                console.error('Error cargando tipos de documento:', error);
                toast.error('Error al cargar tipos de documento');
            } finally {
                setLoadingData(false);
            }
        };
        cargarDatos();
    }, []);

    const normalizeText = (value?: string | number | null) =>
        String(value ?? '')
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');

    // Filtrar apoderados por búsqueda
    const apoderadosFiltrados = apoderados.filter(apod => {
        const search = normalizeText(searchTerm.trim());
        if (!search) return true;

        return (
            normalizeText(apod.nombres).includes(search) ||
            normalizeText(apod.apellidos).includes(search) ||
            normalizeText(apod.numeroDocumento).includes(search) ||
            normalizeText(apod.telefonoPrincipal).includes(search) ||
            normalizeText(apod.correo || '').includes(search)
        );
    });

    // Aplicar paginación
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const apoderadosPaginados = apoderadosFiltrados.slice(indexOfFirstItem, indexOfLastItem);

    // Resetear a la página 1 cuando cambia el término de búsqueda
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const handleNuevo = () => {
        setApoderadoEditar(null);
        setShowModal(true);
    };

    const handleEditar = (apoderado: Apoderado) => {
        setApoderadoEditar(apoderado);
        setShowModal(true);
    };

    const handleEliminar = async (id: number) => {
        if (window.confirm('¿Está seguro de eliminar este apoderado?')) {
            const success = await eliminar(id);
            if (success) {
                toast.success('Apoderado eliminado exitosamente');
            }
        }
    };

    const handleSubmit = async (data: ApoderadoFormData) => {
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
        
        let success = false;
        if (apoderadoEditar) {
            success = await actualizar({
                ...dataConSede,
                idApoderado: apoderadoEditar.idApoderado
            });
            if (success) {
                toast.success('Apoderado actualizado exitosamente');
            }
        } else {
            success = await crear(dataConSede);
            if (success) {
                toast.success('Apoderado creado exitosamente');
            }
        }
        
        if (success) {
            setShowModal(false);
            setApoderadoEditar(null);
        }
    };

    const handleCancel = () => {
        setShowModal(false);
        setApoderadoEditar(null);
    };

    if (loadingData) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="px-3 pt-6 pb-3 sm:px-4 sm:pt-8 sm:pb-4 lg:px-6 lg:pt-8 lg:pb-6 overflow-x-hidden">
            <Toaster position="top-right" richColors />
            
            {/* Header */}
            <div className="mb-3 lg:mb-4">
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 flex items-center space-x-3">
                            <Users className="w-7 h-7 lg:w-7 lg:h-7 text-primary" />
                            <span>Gestión de Apoderados</span>
                        </h1>
                        <p className="text-gray-600 mt-1 text-sm lg:text-base">
                            Administra los apoderados y representantes de los estudiantes
                        </p>
                    </div>
                    <button
                        onClick={handleNuevo}
                        className="bg-gradient-to-r from-escuela to-escuela-light text-white px-6 py-2.5 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2 whitespace-nowrap"
                    >
                        <Plus className="w-5 h-5" />
                        <span>Nuevo Apoder

ado</span>
                    </button>
                </div>
            </div>

            {/* Stats Card */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 lg:gap-4 mb-3 lg:mb-4">
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Total Apoderados</p>
                            <p className="text-2xl font-bold text-gray-800">{apoderados.length}</p>
                        </div>
                        <Users className="w-10 h-10 text-primary opacity-50" />
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Con Correo</p>
                            <p className="text-2xl font-bold text-blue-600">
                                {apoderados.filter(a => a.correo && a.correo.trim() !== '').length}
                            </p>
                        </div>
                        <Mail className="w-10 h-10 text-blue-500 opacity-50" />
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Con Trabajo</p>
                            <p className="text-2xl font-bold text-green-600">
                                {apoderados.filter(a => a.lugarTrabajo && a.lugarTrabajo.trim() !== '').length}
                            </p>
                        </div>
                        <User className="w-10 h-10 text-green-500 opacity-50" />
                    </div>
                </div>
            </div>

            {/* Search Bar */}
            <div className="mb-3 lg:mb-4 bg-white rounded-lg shadow p-3 lg:p-3">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 lg:w-5 lg:h-5" />
                    <input
                        type="text"
                        placeholder="Buscar por nombre, apellido, documento, teléfono o correo..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 lg:pl-10 pr-4 py-2.5 text-sm lg:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                </div>
            </div>

            {/* Vista de Cards para móvil/tablet */}
            <div className="md:hidden space-y-3">
                {loading ? (
                    <div className="flex justify-center items-center h-64 bg-white rounded-lg shadow">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
                    </div>
                ) : apoderadosPaginados.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg shadow">
                        <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">
                            {searchTerm ? 'No se encontraron apoderados' : 'No hay apoderados registrados'}
                        </p>
                    </div>
                ) : (
                    apoderadosPaginados.map((apoderado) => (
                        <div key={apoderado.idApoderado} className="bg-white rounded-lg shadow p-4">
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-800 uppercase">
                                        {apoderado.nombres} {apoderado.apellidos}
                                    </h3>
                                    <p className="text-sm text-gray-600 flex items-center mt-1">
                                        <IdCard className="w-4 h-4 mr-1" />
                                        {apoderado.idTipoDoc.descripcion}: {apoderado.numeroDocumento}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEditar(apoderado)}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleEliminar(apoderado.idApoderado)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-1 text-sm text-gray-600">
                                <p className="flex items-center">
                                    <Phone className="w-4 h-4 mr-2" />
                                    {apoderado.telefonoPrincipal}
                                </p>
                                {apoderado.correo && (
                                    <p className="flex items-center">
                                        <Mail className="w-4 h-4 mr-2" />
                                        {apoderado.correo}
                                    </p>
                                )}
                                <p className="text-xs text-gray-500 mt-2">
                                    Sede: {apoderado.idSede.nombreSede}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Vista de Tabla para desktop */}
            <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                    Documento
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                    Nombre Completo
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                    Teléfono
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                    Correo
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                    Sede
                                </th>
                                <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-4 py-12 text-center">
                                        <div className="flex justify-center items-center">
                                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
                                        </div>
                                    </td>
                                </tr>
                            ) : apoderadosPaginados.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-4 py-12 text-center text-gray-500">
                                        {searchTerm ? 'No se encontraron apoderados' : 'No hay apoderados registrados'}
                                    </td>
                                </tr>
                            ) : (
                                apoderadosPaginados.map((apoderado) => (
                                    <tr key={apoderado.idApoderado} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                                            <div>
                                                <div className="font-medium text-gray-900">{apoderado.numeroDocumento}</div>
                                                <div className="text-xs text-gray-500">{apoderado.idTipoDoc.descripcion}</div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-sm">
                                            <div className="text-gray-900 font-medium uppercase">
                                                {apoderado.nombres} {apoderado.apellidos}
                                            </div>
                                            {apoderado.lugarTrabajo && (
                                                <div className="text-xs text-gray-500">{apoderado.lugarTrabajo}</div>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                            {apoderado.telefonoPrincipal}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-900">
                                            {apoderado.correo || <span className="text-gray-400">-</span>}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-900">
                                            {apoderado.idSede.nombreSede}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-center">
                                            <div className="flex items-center justify-center space-x-2">
                                                <button
                                                    onClick={() => handleEditar(apoderado)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Editar"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleEliminar(apoderado.idApoderado)}
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

            {/* Paginación */}
            {apoderadosFiltrados.length > 0 && (
                <div className="mt-4">
                    <Pagination
                        currentPage={currentPage}
                        totalItems={apoderadosFiltrados.length}
                        itemsPerPage={itemsPerPage}
                        onPageChange={setCurrentPage}
                        onItemsPerPageChange={setItemsPerPage}
                    />
                </div>
            )}

            {/* Modal del Formulario */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="bg-gradient-to-r from-[#064e3b] via-[#065f46] to-[#059669] p-6 text-white flex justify-between items-center">
                            <h2 className="text-2xl font-bold flex items-center space-x-2">
                                <UserCircle className="w-6 h-6" />
                                <span>{apoderadoEditar ? 'Editar Apoderado' : 'Nuevo Apoderado'}</span>
                            </h2>
                            <button
                                onClick={handleCancel}
                                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                                disabled={loading}
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="flex-1 p-6 overflow-y-auto">
                            <ApoderadoForm
                                apoderado={apoderadoEditar}
                                tiposDocumento={tiposDocumento}
                                onSubmit={handleSubmit}
                                onCancel={handleCancel}
                                isLoading={loading}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ApoderadosPage;
