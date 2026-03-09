import { AlertCircle, Edit, Plus, Search, Trash2, Filter, CheckCircle, Users, TrendingUp, Clock } from 'lucide-react';
import React, { useState } from 'react';
import { Toaster } from 'sonner';
import Pagination from '../../../../../components/common/Pagination';
import DeudasAlumnoForm from '../components/DeudasAlumnoForm';
import { useDeudasAlumnos } from '../hooks/useDeudasAlumnos';
import type { DeudasAlumno, DeudasAlumnoFormData } from '../types';

const DeudasAlumnosPage: React.FC = () => {
    const { 
        deudasAlumnos, 
        isLoading, 
        crear, 
        actualizar, 
        eliminar 
    } = useDeudasAlumnos();
    
    const [showForm, setShowForm] = useState(false);
    const [deudaEditar, setDeudaEditar] = useState<DeudasAlumno | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterEstado, setFilterEstado] = useState<string>('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const normalizeText = (value?: string | number | null) =>
        String(value ?? '')
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');

    // Filtrar deudas por búsqueda y estado
    const deudasFiltradas = deudasAlumnos.filter(deuda => {
        const search = normalizeText(searchTerm.trim());
        const matchesSearch = !search || (
            normalizeText(deuda.idMatricula.idAlumno.nombres).includes(search) ||
            normalizeText(deuda.idMatricula.idAlumno.apellidos).includes(search) ||
            normalizeText(deuda.descripcionCuota).includes(search)
        );

        const matchesEstado = !filterEstado || deuda.estadoDeuda === filterEstado;

        return matchesSearch && matchesEstado;
    });

    // Aplicar paginación
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const deudasPaginadas = deudasFiltradas.slice(indexOfFirstItem, indexOfLastItem);

    // Resetear a la página 1 cuando cambia el término de búsqueda
    React.useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, filterEstado]);

    const handleNuevo = () => {
        setDeudaEditar(null);
        setShowForm(true);
    };

    const handleEditar = (deuda: DeudasAlumno) => {
        setDeudaEditar(deuda);
        setShowForm(true);
    };

    const handleEliminar = async (id: number) => {
        if (window.confirm('¿Está seguro de eliminar esta deuda?')) {
            try {
                await eliminar(id);
            } catch (error) {
                console.error('Error al eliminar:', error);
            }
        }
    };

    const handleSubmit = async (data: DeudasAlumnoFormData) => {
        try {
            if (deudaEditar) {
                await actualizar({
                    ...data,
                    idDeuda: deudaEditar.idDeuda
                });
            } else {
                await crear(data);
            }
            setShowForm(false);
            setDeudaEditar(null);
        } catch (error) {
            console.error('Error al guardar:', error);
        }
    };

    const handleCancel = () => {
        setShowForm(false);
        setDeudaEditar(null);
    };

    const getEstadoBadge = (estado: string) => {
        const colores = {
            Pendiente: 'bg-red-100 text-red-800',
            Parcial: 'bg-yellow-100 text-yellow-800',
            Pagado: 'bg-green-100 text-green-800'
        };
        return colores[estado as keyof typeof colores] || 'bg-gray-100 text-gray-800';
    };

    const getEstadoIcon = (estado: string) => {
        if (estado === 'Pendiente') {
            return <AlertCircle className="w-4 h-4 inline mr-1" />;
        }
        return null;
    };

    const calcularDeudasPendientes = () => {
        return deudasAlumnos.filter(d => d.estadoDeuda === 'Pendiente').length;
    };

    const calcularMontoTotal = () => {
        return deudasAlumnos
            .filter(d => d.estadoDeuda === 'Pendiente')
            .reduce((sum, d) => sum + d.montoTotal, 0);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <Toaster />
            
            {/* Header mejorado */}
            <div className="mb-8">
                <div className="flex items-center gap-4 mb-3">
                    <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-3 shadow-lg">
                        <Users className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900">Deudas de Alumnos</h1>
                        <p className="text-gray-600 mt-1">Gestiona las deudas y cuotas de los alumnos</p>
                    </div>
                </div>
                <div className="h-1 w-20 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full"></div>
            </div>

            {/* Cards de Resumen mejoradas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-white rounded-xl shadow-md border border-red-100 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 mb-2">Deudas Pendientes</p>
                            <p className="text-3xl font-bold text-red-600">{calcularDeudasPendientes()}</p>
                        </div>
                        <div className="bg-red-100 rounded-lg p-3">
                            <TrendingUp className="w-6 h-6 text-red-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-md border border-purple-100 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 mb-2">Monto Pendiente</p>
                            <p className="text-3xl font-bold text-purple-600">S/. {calcularMontoTotal().toFixed(2)}</p>
                        </div>
                        <div className="bg-purple-100 rounded-lg p-3">
                            <Clock className="w-6 h-6 text-purple-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Barra de búsqueda, filtro y botón nuevo mejorada */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-6">
                <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
                    <div className="flex-1 relative group">
                        <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Buscar por alumno o descripción..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-11 pr-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-500 transition-all duration-200 hover:border-gray-300"
                        />
                    </div>
                    <select
                        value={filterEstado}
                        onChange={(e) => setFilterEstado(e.target.value)}
                        className="px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-500 transition-all duration-200 hover:border-gray-300 bg-white font-medium"
                    >
                        <option value="">Todos los estados</option>
                        <option value="Pendiente">Pendiente</option>
                        <option value="Parcial">Parcial</option>
                        <option value="Pagado">Pagado</option>
                    </select>
                    <button
                        onClick={handleNuevo}
                        className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-5 py-2.5 rounded-lg hover:shadow-lg active:scale-95 transition-all duration-200 font-semibold whitespace-nowrap shadow-md"
                    >
                        <div className="bg-white bg-opacity-30 rounded-lg p-1">
                            <Plus className="w-5 h-5" />
                        </div>
                        Nueva Deuda
                    </button>
                </div>
            </div>

            {/* Tabla mejorada */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                {isLoading ? (
                    <div className="flex justify-center items-center h-96">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-14 w-14 border-4 border-gray-200 border-t-purple-600 mx-auto mb-4"></div>
                            <p className="text-gray-600 font-medium">Cargando deudas...</p>
                        </div>
                    </div>
                ) : deudasPaginadas.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="flex justify-center mb-4">
                            <div className="bg-purple-100 rounded-full p-4">
                                <Users className="w-8 h-8 text-purple-600" />
                            </div>
                        </div>
                        <p className="text-gray-600 text-lg font-medium">No hay deudas registradas</p>
                        <p className="text-gray-500 text-sm mt-2">Comienza registrando una nueva deuda</p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gradient-to-r from-gray-100 to-gray-50 border-b-2 border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                            <div className="flex items-center gap-2">
                                                <div className="w-1 h-5 bg-purple-500 rounded-full"></div>
                                                Alumno
                                            </div>
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                            Concepto
                                        </th>
                                        <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                                            Monto
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                            Vencimiento
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                            Estado
                                        </th>
                                        <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {deudasPaginadas.map((deuda, index) => (
                                        <tr key={deuda.idDeuda} className="hover:bg-purple-50 transition-colors duration-150 border-l-4 border-l-transparent hover:border-l-purple-500">
                                            <td className="px-6 py-4 text-sm">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex items-center justify-center w-8 h-8 bg-purple-100 rounded-lg">
                                                        <span className="text-xs font-bold text-purple-600">{index + 1}</span>
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-gray-900">{deuda.idMatricula.idAlumno.nombres}</p>
                                                        <p className="text-xs text-gray-600">{deuda.idMatricula.idAlumno.apellidos}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-800">
                                                {deuda.idConcepto.nombreConcepto}
                                            </td>
                                            <td className="px-6 py-4 text-sm font-bold text-right">
                                                <span className="inline-block px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-sm font-bold">
                                                    S/. {deuda.montoTotal.toFixed(2)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-800">
                                                {new Date(deuda.fechaVencimiento).toLocaleDateString('es-PE')}
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <span className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 w-fit ${getEstadoBadge(deuda.estadoDeuda)}`}>
                                                    {getEstadoIcon(deuda.estadoDeuda)}
                                                    {deuda.estadoDeuda}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() => handleEditar(deuda)}
                                                        className="p-2.5 text-purple-600 hover:bg-purple-100 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
                                                        title="Editar"
                                                    >
                                                        <Edit className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleEliminar(deuda.idDeuda)}
                                                        className="p-2.5 text-red-600 hover:bg-red-100 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
                                                        title="Eliminar"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Paginación mejorada */}
                        <div className="flex flex-col sm:flex-row items-center justify-between p-5 border-t-2 border-gray-200 bg-gray-50">
                            <div className="flex items-center gap-3 mb-4 sm:mb-0">
                                <Filter className="w-4 h-4 text-gray-600" />
                                <span className="text-sm font-semibold text-gray-700">Items por página:</span>
                                <select
                                    value={itemsPerPage}
                                    onChange={(e) => {
                                        setItemsPerPage(parseInt(e.target.value));
                                        setCurrentPage(1);
                                    }}
                                    className="px-4 py-2 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-500 transition-all bg-white hover:border-gray-400 font-medium"
                                >
                                    <option value={5}>5</option>
                                    <option value={10}>10</option>
                                    <option value={20}>20</option>
                                    <option value={50}>50</option>
                                </select>
                            </div>
                            <Pagination
                                currentPage={currentPage}
                                totalPages={Math.ceil(deudasFiltradas.length / itemsPerPage)}
                                onPageChange={setCurrentPage}
                            />
                        </div>
                    </>
                )}
            </div>

            {/* Modal Formulario */}
            {showForm && (
                <DeudasAlumnoForm
                    deuda={deudaEditar}
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                    isLoading={isLoading}
                />
            )}
        </div>
    );
};

export default DeudasAlumnosPage;
