import { Edit, Plus, Search, Trash2, DollarSign, BookOpen, Eye, EyeOff, Filter } from 'lucide-react';
import React, { useState } from 'react';
import { Toaster } from 'sonner';
import Pagination from '../../../../../components/common/Pagination';
import ConceptoPagoForm from '../components/ConceptoPagoForm';
import { useConceptosPago } from '../hooks/useConceptosPago';
import type { ConceptoPago, ConceptoPagoFormData } from '../types';

const ConceptosPagoPage: React.FC = () => {
    const { 
        conceptosPago, 
        isLoading, 
        crear, 
        actualizar, 
        eliminar 
    } = useConceptosPago();
    
    const [showForm, setShowForm] = useState(false);
    const [conceptoEditar, setConceptoEditar] = useState<ConceptoPago | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const normalizeText = (value?: string | number | null) =>
        String(value ?? '')
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');

    // Filtrar conceptos por búsqueda
    const conceptosFiltrados = conceptosPago.filter(concepto => {
        const search = normalizeText(searchTerm.trim());
        if (!search) return true;

        return (
            normalizeText(concepto.nombreConcepto).includes(search) ||
            normalizeText(concepto.idGrado?.nombreGrado || '').includes(search)
        );
    });

    // Aplicar paginación
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const conceptosPaginados = conceptosFiltrados.slice(indexOfFirstItem, indexOfLastItem);

    // Resetear a la página 1 cuando cambia el término de búsqueda
    React.useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const handleNuevo = () => {
        setConceptoEditar(null);
        setShowForm(true);
    };

    const handleEditar = (concepto: ConceptoPago) => {
        setConceptoEditar(concepto);
        setShowForm(true);
    };

    const handleEliminar = async (id: number) => {
        if (window.confirm('¿Está seguro de eliminar este concepto de pago?')) {
            try {
                await eliminar(id);
            } catch (error) {
                console.error('Error al eliminar:', error);
            }
        }
    };

    const handleSubmit = async (data: ConceptoPagoFormData) => {
        try {
            if (conceptoEditar) {
                await actualizar({
                    ...data,
                    idConcepto: conceptoEditar.idConcepto
                });
            } else {
                await crear(data);
            }
            setShowForm(false);
            setConceptoEditar(null);
        } catch (error) {
            console.error('Error al guardar:', error);
        }
    };

    const handleCancel = () => {
        setShowForm(false);
        setConceptoEditar(null);
    };

    const getEstadoBadge = (estado: number) => {
        return estado === 1
            ? 'bg-green-100 text-green-700'
            : 'bg-gray-100 text-gray-700';
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <Toaster />
            
            {/* Header mejorado */}
            <div className="mb-8">
                <div className="flex items-center gap-4 mb-3">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-3 shadow-lg">
                        <DollarSign className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900">Conceptos de Pago</h1>
                        <p className="text-gray-600 mt-1">Gestiona todos los conceptos de pago de tu institución</p>
                    </div>
                </div>
                <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"></div>
            </div>

            {/* Barra de búsqueda y botón nuevo mejorada */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-6">
                <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
                    <div className="flex-1 relative group">
                        <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Buscar por nombre o grado..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-11 pr-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all duration-200 hover:border-gray-300"
                        />
                    </div>
                    <button
                        onClick={handleNuevo}
                        className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-2.5 rounded-lg hover:shadow-lg active:scale-95 transition-all duration-200 font-semibold whitespace-nowrap shadow-md"
                    >
                        <div className="bg-white bg-opacity-30 rounded-lg p-1">
                            <Plus className="w-5 h-5" />
                        </div>
                        Nuevo Concepto
                    </button>
                </div>
            </div>

            {/* Tabla mejorada */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                {isLoading ? (
                    <div className="flex justify-center items-center h-96">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-14 w-14 border-4 border-gray-200 border-t-blue-600 mx-auto mb-4"></div>
                            <p className="text-gray-600 font-medium">Cargando conceptos de pago...</p>
                        </div>
                    </div>
                ) : conceptosPaginados.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="flex justify-center mb-4">
                            <div className="bg-blue-100 rounded-full p-4">
                                <BookOpen className="w-8 h-8 text-blue-600" />
                            </div>
                        </div>
                        <p className="text-gray-600 text-lg font-medium">No hay conceptos de pago registrados</p>
                        <p className="text-gray-500 text-sm mt-2">Comienza creando tu primer concepto de pago</p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gradient-to-r from-gray-100 to-gray-50 border-b-2 border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                            <div className="flex items-center gap-2">
                                                <div className="w-1 h-5 bg-blue-500 rounded-full"></div>
                                                Nombre
                                            </div>
                                        </th>
                                        <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                                            <div className="flex items-center justify-end gap-2">
                                                <DollarSign className="w-4 h-4" />
                                                Monto
                                            </div>
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                            <div className="flex items-center gap-2">
                                                <BookOpen className="w-4 h-4" />
                                                Grado
                                            </div>
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                            Institución
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
                                    {conceptosPaginados.map((concepto, index) => (
                                        <tr 
                                            key={concepto.idConcepto} 
                                            className="hover:bg-blue-50 transition-colors duration-150 border-l-4 border-transparent hover:border-l-blue-500"
                                        >
                                            <td className="px-6 py-4 text-sm text-gray-900 font-semibold">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg">
                                                        <span className="text-xs font-bold text-blue-600">{index + 1}</span>
                                                    </div>
                                                    {concepto.nombreConcepto}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900 text-right font-bold">
                                                <div className="bg-green-50 px-3 py-1 rounded-lg inline-block">
                                                    <span className="text-green-700">S/. {concepto.monto.toFixed(2)}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-700">
                                                <div className="bg-yellow-50 px-3 py-1 rounded-lg inline-block">
                                                    <span className="text-yellow-700 font-medium">{concepto.idGrado?.nombreGrado || 'N/A'}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-700">
                                                {concepto.idInstitucion?.nombre || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <span className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 w-fit ${getEstadoBadge(concepto.estadoConcepto)}`}>
                                                    {concepto.estadoConcepto === 1 ? (
                                                        <>
                                                            <Eye className="w-3 h-3" />
                                                            Activo
                                                        </>
                                                    ) : (
                                                        <>
                                                            <EyeOff className="w-3 h-3" />
                                                            Inactivo
                                                        </>
                                                    )}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() => handleEditar(concepto)}
                                                        className="p-2.5 text-blue-600 hover:bg-blue-100 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
                                                        title="Editar"
                                                    >
                                                        <Edit className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleEliminar(concepto.idConcepto)}
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
                                    className="px-4 py-2 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all bg-white hover:border-gray-400 font-medium"
                                >
                                    <option value={5}>5</option>
                                    <option value={10}>10</option>
                                    <option value={20}>20</option>
                                    <option value={50}>50</option>
                                </select>
                            </div>
                            <Pagination
                                currentPage={currentPage}
                                totalItems={conceptosFiltrados.length}
                                itemsPerPage={itemsPerPage}
                                onPageChange={setCurrentPage}
                                onItemsPerPageChange={setItemsPerPage}
                            />
                        </div>
                    </>
                )}
            </div>

            {/* Modal Formulario */}
            {showForm && (
                <ConceptoPagoForm
                    concepto={conceptoEditar}
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                    isLoading={isLoading}
                />
            )}
        </div>
    );
};

export default ConceptosPagoPage;
