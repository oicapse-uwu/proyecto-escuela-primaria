import { Edit, Plus, Search, Trash2 } from 'lucide-react';
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
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800';
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <Toaster />
            
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Conceptos de Pago</h1>
                <p className="text-gray-600">Gestiona los conceptos de pago de la institución</p>
            </div>

            {/* Barra de búsqueda y botón nuevo */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Buscar por nombre o grado..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <button
                    onClick={handleNuevo}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium whitespace-nowrap"
                >
                    <Plus className="w-5 h-5" />
                    Nuevo Concepto
                </button>
            </div>

            {/* Tabla */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {isLoading ? (
                    <div className="flex justify-center items-center h-96">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : conceptosPaginados.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No hay conceptos de pago registrados</p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-100 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                                            Nombre
                                        </th>
                                        <th className="px-6 py-3 text-right text-sm font-medium text-gray-500 uppercase tracking-wider">
                                            Monto
                                        </th>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                                            Grado
                                        </th>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                                            Institución
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
                                    {conceptosPaginados.map((concepto) => (
                                        <tr key={concepto.idConcepto} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 text-sm text-gray-800 font-medium">
                                                {concepto.nombreConcepto}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-800 text-right font-medium">
                                                S/. {concepto.monto.toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-800">
                                                {concepto.idGrado?.nombreGrado || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-800">
                                                {concepto.idInstitucion?.nombre || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getEstadoBadge(concepto.estadoConcepto)}`}>
                                                    {concepto.estadoConcepto === 1 ? 'Activo' : 'Inactivo'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() => handleEditar(concepto)}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="Editar"
                                                    >
                                                        <Edit className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleEliminar(concepto.idConcepto)}
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
