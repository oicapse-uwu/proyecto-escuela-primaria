import { ArrowRightLeft, CheckCircle, Clock, Edit, Eye, Plus, Trash2, X, XCircle } from 'lucide-react';
import React, { useState } from 'react';
import { Toaster } from 'sonner';
import Pagination from '../../../../components/common/Pagination';
import { SearchFilterBar } from '../../../../components/common/SearchFilterBar';
import Button from '../../../../components/ui/Button';
import AprobarRechazarMovimiento from '../components/AprobarRechazarMovimiento';
import MovimientoAlumnoForm from '../components/MovimientoAlumnoForm';
import { useMovimientosAlumno } from '../hooks/useMovimientosAlumno';
import type { MovimientoAlumno, MovimientoAlumnoFormData } from '../types';

const MovimientosAlumnoPage: React.FC = () => {
    const {
        movimientos,
        isLoading,
        crear,
        actualizar,
        aprobar,
        rechazar,
        eliminar
    } = useMovimientosAlumno();

    const [showForm, setShowForm] = useState(false);
    const [showApprovalForm, setShowApprovalForm] = useState(false);
    const [movimientoEditar, setMovimientoEditar] = useState<MovimientoAlumno | null>(null);
    const [movimientoAprobar, setMovimientoAprobar] = useState<MovimientoAlumno | null>(null);
    const [filtroEstado, setFiltroEstado] = useState<string>('Todos');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [selectedMovimiento, setSelectedMovimiento] = useState<MovimientoAlumno | null>(null);

    // Función para normalizar texto
    const normalizeText = (value?: string | number | null) =>
        String(value ?? '')
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');

    // Filtrar movimientos por búsqueda y estado
    const movimientosFiltrados = movimientos.filter(mov => {
        const search = normalizeText(searchTerm.trim());
        const matchSearch = !search || 
            normalizeText(mov.idMatricula.idAlumno.nombres).includes(search) ||
            normalizeText(mov.idMatricula.idAlumno.apellidos).includes(search) ||
            normalizeText(mov.tipoMovimiento).includes(search);
        
        const matchEstado = filtroEstado === 'Todos' || mov.estadoSolicitud === filtroEstado;
        
        return matchSearch && matchEstado;
    });

    // Aplicar paginación
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const movimientosPaginados = movimientosFiltrados.slice(indexOfFirstItem, indexOfLastItem);

    // Resetear a la página 1 cuando cambia el término de búsqueda
    React.useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, filtroEstado]);

    const handleNuevo = () => {
        setMovimientoEditar(null);
        setShowForm(true);
    };

    const handleEditar = (movimiento: MovimientoAlumno) => {
        setMovimientoEditar(movimiento);
        setShowForm(true);
    };

    const handleAprobarRechazar = (movimiento: MovimientoAlumno) => {
        setMovimientoAprobar(movimiento);
        setShowApprovalForm(true);
    };

    const handleEliminar = async (id: number) => {
        if (window.confirm('¿Está seguro de eliminar este movimiento?')) {
            try {
                await eliminar(id);
            } catch (error) {
                console.error('Error al eliminar:', error);
            }
        }
    };

    const handleSubmit = async (data: MovimientoAlumnoFormData) => {
        try {
            if (movimientoEditar) {
                await actualizar({
                    ...data,
                    idMovimiento: movimientoEditar.idMovimiento,
                    estadoSolicitud: movimientoEditar.estadoSolicitud
                });
            } else {
                await crear({
                    ...data,
                    estadoSolicitud: 'Pendiente'
                });
            }
            setShowForm(false);
            setMovimientoEditar(null);
        } catch (error) {
            console.error('Error al guardar:', error);
        }
    };

    const handleAprobarSubmit = async (id: number, observaciones?: string) => {
        try {
            await aprobar(id, observaciones);
            setShowApprovalForm(false);
            setMovimientoAprobar(null);
        } catch (error) {
            console.error('Error al aprobar:', error);
        }
    };

    const handleRechazarSubmit = async (id: number, observaciones: string) => {
        try {
            await rechazar(id, observaciones);
            setShowApprovalForm(false);
            setMovimientoAprobar(null);
        } catch (error) {
            console.error('Error al rechazar:', error);
        }
    };

    const handleCancel = () => {
        setShowForm(false);
        setShowApprovalForm(false);
        setMovimientoEditar(null);
        setMovimientoAprobar(null);
    };

    const getEstadoBadge = (estado: string) => {
        const estados: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
            'Pendiente': { 
                bg: 'bg-yellow-100', 
                text: 'text-yellow-800',
                icon: <Clock className="w-3.5 h-3.5" />
            },
            'Aprobada': { 
                bg: 'bg-green-100', 
                text: 'text-green-800',
                icon: <CheckCircle className="w-3.5 h-3.5" />
            },
            'Rechazada': { 
                bg: 'bg-red-100', 
                text: 'text-red-800',
                icon: <XCircle className="w-3.5 h-3.5" />
            }
        };

        const config = estados[estado] || { bg: 'bg-gray-100', text: 'text-gray-800', icon: null };
        
        return (
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
                {config.icon}
                {estado}
            </span>
        );
    };

    const getTipoMovimientoBadge = (tipo: string) => {
        const tipos: Record<string, { bg: string; text: string }> = {
            'Retiro': { bg: 'bg-red-50', text: 'text-red-700' },
            'Traslado_Saliente': { bg: 'bg-blue-50', text: 'text-blue-700' },
            'Cambio_Seccion': { bg: 'bg-purple-50', text: 'text-purple-700' }
        };

        const config = tipos[tipo] || { bg: 'bg-gray-50', text: 'text-gray-700' };
        
        return (
            <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${config.bg} ${config.text}`}>
                {tipo.replace('_', ' ')}
            </span>
        );
    };

    return (
        <div className="px-3 pt-6 pb-3 sm:px-4 sm:pt-8 sm:pb-4 lg:px-6 lg:pt-8 lg:pb-6 overflow-x-hidden">
            <Toaster position="top-right" richColors />
            
            {/* Header */}
            <div className="mb-3 lg:mb-4">
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 flex items-center space-x-3">
                            <ArrowRightLeft className="w-7 h-7 lg:w-7 lg:h-7 text-emerald-600" />
                            <span>Movimientos de Alumnos</span>
                        </h1>
                        <p className="text-gray-600 mt-1 text-sm lg:text-base">
                            Gestión de retiros, traslados y cambios de sección
                        </p>
                    </div>
                    <Button
                        onClick={() => handleNuevo()}
                        icon={<Plus className="w-5 h-5" />}
                        variant="success"
                    >
                        Nuevo Movimiento
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
                <div className="bg-white rounded-lg shadow p-4">
                    <p className="text-sm text-gray-600">Total</p>
                    <p className="text-2xl font-bold text-gray-800">{movimientos.length}</p>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                    <p className="text-sm text-yellow-700">Pendientes</p>
                    <p className="text-2xl font-bold text-yellow-800">
                        {movimientos.filter(m => m.estadoSolicitud === 'Pendiente').length}
                    </p>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                    <p className="text-sm text-green-700">Aprobadas</p>
                    <p className="text-2xl font-bold text-green-800">
                        {movimientos.filter(m => m.estadoSolicitud === 'Aprobada').length}
                    </p>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                    <p className="text-sm text-red-700">Rechazadas</p>
                    <p className="text-2xl font-bold text-red-800">
                        {movimientos.filter(m => m.estadoSolicitud === 'Rechazada').length}
                    </p>
                </div>
            </div>

            {/* Filtros y búsqueda */}
            <div className="mb-3">
                <SearchFilterBar
                    searchValue={searchTerm}
                    onSearchChange={setSearchTerm}
                    searchPlaceholder="Buscar por alumno, tipo..."
                />
                <div className="mt-3 flex gap-2 flex-wrap">
                    {['Todos', 'Pendiente', 'Aprobada', 'Rechazada'].map((estado) => (
                        <button
                            key={estado}
                            onClick={() => setFiltroEstado(estado)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                filtroEstado === estado
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                            }`}
                        >
                            {estado}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tabla */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Alumno
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tipo
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Fecha Movimiento
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Estado
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center">
                                        <div className="flex justify-center items-center">
                                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-600 border-t-transparent"></div>
                                        </div>
                                    </td>
                                </tr>
                            ) : movimientosPaginados.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center">
                                        <ArrowRightLeft className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                        <p className="text-gray-500 text-lg">No se encontraron movimientos</p>
                                    </td>
                                </tr>
                            ) : (
                                movimientosPaginados.map((mov) => (
                                    <tr key={mov.idMovimiento} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {mov.idMatricula.idAlumno.nombres} {mov.idMatricula.idAlumno.apellidos}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {mov.idMatricula.codigoMatricula}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getTipoMovimientoBadge(mov.tipoMovimiento)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {new Date(mov.fechaMovimiento).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getEstadoBadge(mov.estadoSolicitud)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                            {mov.estadoSolicitud === 'Pendiente' && (
                                                <button
                                                    onClick={() => handleAprobarRechazar(mov)}
                                                    className="text-emerald-600 hover:text-emerald-900"
                                                    title="Aprobar/Rechazar"
                                                >
                                                    <CheckCircle className="w-5 h-5 inline" />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => setSelectedMovimiento(mov)}
                                                className="text-blue-600 hover:text-blue-900"
                                                title="Ver detalles"
                                            >
                                                <Eye className="w-5 h-5 inline" />
                                            </button>
                                            {mov.estadoSolicitud === 'Pendiente' && (
                                                <>
                                                    <button
                                                        onClick={() => handleEditar(mov)}
                                                        className="text-yellow-600 hover:text-yellow-900"
                                                        title="Editar"
                                                    >
                                                        <Edit className="w-5 h-5 inline" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleEliminar(mov.idMovimiento)}
                                                        className="text-red-600 hover:text-red-900"
                                                        title="Eliminar"
                                                    >
                                                        <Trash2 className="w-5 h-5 inline" />
                                                    </button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Paginación */}
                {movimientosFiltrados.length > 0 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={Math.ceil(movimientosFiltrados.length / itemsPerPage)}
                        onPageChange={setCurrentPage}
                        itemsPerPage={itemsPerPage}
                        onItemsPerPageChange={setItemsPerPage}
                        totalItems={movimientosFiltrados.length}
                    />
                )}
            </div>

            {/* Modales */}
            {showForm && (
                <MovimientoAlumnoForm
                    movimiento={movimientoEditar}
                    idMatricula={movimientoEditar?.idMatricula.idMatricula || 0}
                    nombreAlumno={movimientoEditar 
                        ? `${movimientoEditar.idMatricula.idAlumno.nombres} ${movimientoEditar.idMatricula.idAlumno.apellidos}`
                        : 'Seleccione un alumno'
                    }
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                    isLoading={isLoading}
                />
            )}

            {showApprovalForm && movimientoAprobar && (
                <AprobarRechazarMovimiento
                    movimiento={movimientoAprobar}
                    onAprobar={handleAprobarSubmit}
                    onRechazar={handleRechazarSubmit}
                    onCancel={handleCancel}
                    isLoading={isLoading}
                />
            )}

            {/* Modal de detalles */}
            {selectedMovimiento && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setSelectedMovimiento(null)}>
                    <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
                        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 p-6 text-white flex justify-between items-center rounded-t-lg">
                            <h3 className="text-xl font-bold">Detalles del Movimiento</h3>
                            <button onClick={() => setSelectedMovimiento(null)} className="hover:bg-emerald-700/50 rounded-full p-2">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-600">Alumno</p>
                                    <p className="font-semibold">
                                        {selectedMovimiento.idMatricula.idAlumno.nombres} {selectedMovimiento.idMatricula.idAlumno.apellidos}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Tipo</p>
                                    {getTipoMovimientoBadge(selectedMovimiento.tipoMovimiento)}
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Estado</p>
                                    {getEstadoBadge(selectedMovimiento.estadoSolicitud)}
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Fecha del Movimiento</p>
                                    <p className="font-semibold">{new Date(selectedMovimiento.fechaMovimiento).toLocaleDateString()}</p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-sm text-gray-600">Motivo</p>
                                    <p className="font-semibold">{selectedMovimiento.motivo}</p>
                                </div>
                                {selectedMovimiento.colegioDestino && (
                                    <div className="col-span-2">
                                        <p className="text-sm text-gray-600">Colegio Destino</p>
                                        <p className="font-semibold">{selectedMovimiento.colegioDestino}</p>
                                    </div>
                                )}
                                {selectedMovimiento.observaciones && (
                                    <div className="col-span-2">
                                        <p className="text-sm text-gray-600">Observaciones</p>
                                        <p className="font-semibold">{selectedMovimiento.observaciones}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MovimientosAlumnoPage;
