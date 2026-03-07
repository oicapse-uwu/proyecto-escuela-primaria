import { AlertCircle, Edit, Plus, Search, Trash2 } from 'lucide-react';
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
            
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Deudas de Alumnos</h1>
                <p className="text-gray-600">Gestiona las deudas y cuotas de los alumnos</p>
            </div>

            {/* Cards de Resumen */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-white rounded-lg shadow-md p-4">
                    <h3 className="text-sm font-medium text-gray-600 mb-1">Deudas Pendientes</h3>
                    <p className="text-2xl font-bold text-red-600">{calcularDeudasPendientes()}</p>
                </div>
                <div className="bg-white rounded-lg shadow-md p-4">
                    <h3 className="text-sm font-medium text-gray-600 mb-1">Monto Pendiente</h3>
                    <p className="text-2xl font-bold text-orange-600">S/. {calcularMontoTotal().toFixed(2)}</p>
                </div>
            </div>

            {/* Barra de búsqueda y botón nuevo */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Buscar por alumno o descripción..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <select
                    value={filterEstado}
                    onChange={(e) => setFilterEstado(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">Todos los estados</option>
                    <option value="Pendiente">Pendiente</option>
                    <option value="Parcial">Parcial</option>
                    <option value="Pagado">Pagado</option>
                </select>
                <button
                    onClick={handleNuevo}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium whitespace-nowrap"
                >
                    <Plus className="w-5 h-5" />
                    Nueva Deuda
                </button>
            </div>

            {/* Tabla */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                {isLoading ? (
                    <div className="flex justify-center items-center h-96">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : deudasPaginadas.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No hay deudas registradas</p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-100 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                                            Alumno
                                        </th>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                                            Concepto
                                        </th>
                                        <th className="px-6 py-3 text-right text-sm font-medium text-gray-500 uppercase tracking-wider">
                                            Monto
                                        </th>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                                            Vencimiento
                                        </th>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                                            Estado
                                        </th>
                                        <th className="px-6 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider">
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {deudasPaginadas.map((deuda) => (
                                        <tr key={deuda.idDeuda} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 text-sm text-gray-800 font-medium">
                                                {deuda.idMatricula.idAlumno.nombres} {deuda.idMatricula.idAlumno.apellidos}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-800">
                                                {deuda.idConcepto.nombreConcepto}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-800 font-semibold text-right">
                                                S/. {deuda.montoTotal.toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-800">
                                                {new Date(deuda.fechaVencimiento).toLocaleDateString('es-PE')}
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${getEstadoBadge(deuda.estadoDeuda)}`}>
                                                    {getEstadoIcon(deuda.estadoDeuda)}
                                                    {deuda.estadoDeuda}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() => handleEditar(deuda)}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="Editar"
                                                    >
                                                        <Edit className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleEliminar(deuda.idDeuda)}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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

                        {/* Paginación */}
                        <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-t border-gray-200">
                            <div className="flex items-center gap-2 mb-4 sm:mb-0">
                                <span className="text-sm text-gray-600">Items por página:</span>
                                <select
                                    value={itemsPerPage}
                                    onChange={(e) => {
                                        setItemsPerPage(parseInt(e.target.value));
                                        setCurrentPage(1);
                                    }}
                                    className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
