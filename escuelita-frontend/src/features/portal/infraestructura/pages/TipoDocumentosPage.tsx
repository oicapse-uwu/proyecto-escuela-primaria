import { Edit, FileType, Plus, Search, Trash2 } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import { toast, Toaster } from 'sonner';
import Pagination from '../../../../components/common/Pagination';
import { api, API_ENDPOINTS } from '../../../../config/api.config';

interface TipoDocumento {
    idDocumento: number;
    abreviatura: string;
    descripcion: string;
    longitudMaxima: number | null;
    esLongitudExacta: number;
    estado: number;
}

const TipoDocumentosPage: React.FC = () => {
    const [tipos, setTipos] = useState<TipoDocumento[]>([]);
    const [cargando, setCargando] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [seleccionado, setSeleccionado] = useState<TipoDocumento | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const itemsPerPage = 10;

    // Form state
    const [formAbreviatura, setFormAbreviatura] = useState('');
    const [formDescripcion, setFormDescripcion] = useState('');
    const [formLongitudMaxima, setFormLongitudMaxima] = useState<string>('');
    const [formEsLongitudExacta, setFormEsLongitudExacta] = useState(1);

    const cargarDatos = useCallback(async () => {
        setCargando(true);
        try {
            const response = await api.get<TipoDocumento[]>(API_ENDPOINTS.TIPOS_DOCUMENTO);
            setTipos(response.data || []);
        } catch {
            toast.error('Error al cargar tipos de documento');
        } finally {
            setCargando(false);
        }
    }, []);

    useEffect(() => {
        cargarDatos();
    }, [cargarDatos]);

    const tiposFiltrados = tipos.filter(t =>
        t.abreviatura?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(tiposFiltrados.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const tiposPaginados = tiposFiltrados.slice(startIndex, startIndex + itemsPerPage);

    const handleNuevo = () => {
        setSeleccionado(null);
        setFormAbreviatura('');
        setFormDescripcion('');
        setFormLongitudMaxima('');
        setFormEsLongitudExacta(1);
        setShowModal(true);
    };

    const handleEditar = (tipo: TipoDocumento) => {
        setSeleccionado(tipo);
        setFormAbreviatura(tipo.abreviatura || '');
        setFormDescripcion(tipo.descripcion || '');
        setFormLongitudMaxima(tipo.longitudMaxima != null ? String(tipo.longitudMaxima) : '');
        setFormEsLongitudExacta(tipo.esLongitudExacta ?? 1);
        setShowModal(true);
    };

    const handleGuardar = async () => {
        if (!formAbreviatura.trim() || !formDescripcion.trim()) {
            toast.error('Complete los campos obligatorios');
            return;
        }
        setIsSubmitting(true);
        try {
            const body = {
                ...(seleccionado ? { idDocumento: seleccionado.idDocumento } : {}),
                abreviatura: formAbreviatura.trim(),
                descripcion: formDescripcion.trim(),
                longitudMaxima: formLongitudMaxima ? Number(formLongitudMaxima) : null,
                esLongitudExacta: formEsLongitudExacta,
            };
            if (seleccionado) {
                await api.put(API_ENDPOINTS.TIPOS_DOCUMENTO, body);
                toast.success('Tipo de documento actualizado');
            } else {
                await api.post(API_ENDPOINTS.TIPOS_DOCUMENTO, body);
                toast.success('Tipo de documento creado');
            }
            setShowModal(false);
            cargarDatos();
        } catch {
            toast.error('Error al guardar');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEliminar = async (id: number) => {
        if (!confirm('¿Está seguro de eliminar este tipo de documento?')) return;
        try {
            await api.delete(`${API_ENDPOINTS.TIPOS_DOCUMENTO}/${id}`);
            toast.success('Tipo de documento eliminado');
            cargarDatos();
        } catch {
            toast.error('Error al eliminar');
        }
    };

    if (cargando) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6 p-4 md:p-6">
            <Toaster richColors position="top-right" />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                        <FileType className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Tipos de Documento</h1>
                        <p className="text-sm text-gray-500">Gestión de tipos de documento de identidad</p>
                    </div>
                </div>
                <button
                    onClick={handleNuevo}
                    className="bg-gradient-to-r from-escuela to-escuela-light text-white px-6 py-2.5 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" /> Nuevo Tipo
                </button>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                    type="text"
                    placeholder="Buscar por abreviatura o descripción..."
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                    className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
            </div>

            {/* Mobile cards */}
            <div className="md:hidden space-y-3">
                {tiposPaginados.map((tipo) => (
                    <div key={tipo.idDocumento} className="bg-white rounded-xl border p-4 shadow-sm">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="font-semibold text-gray-900">{tipo.abreviatura}</p>
                                <p className="text-sm text-gray-500">{tipo.descripcion}</p>
                            </div>
                            <div className="flex gap-1">
                                <button onClick={() => handleEditar(tipo)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded">
                                    <Edit className="w-4 h-4" />
                                </button>
                                <button onClick={() => handleEliminar(tipo.idDocumento)} className="p-1.5 text-red-600 hover:bg-red-50 rounded">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        <div className="mt-2 text-xs text-gray-500">
                            Longitud máx: {tipo.longitudMaxima ?? 'N/A'} | {tipo.esLongitudExacta === 1 ? 'Exacta' : 'Variable'}
                        </div>
                    </div>
                ))}
            </div>

            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full bg-white border rounded-xl overflow-hidden shadow-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Abreviatura</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Descripción</th>
                            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Longitud Máx.</th>
                            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Tipo Longitud</th>
                            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {tiposPaginados.map((tipo) => (
                            <tr key={tipo.idDocumento} className="hover:bg-gray-50 transition-colors">
                                <td className="px-4 py-3 text-sm font-medium text-gray-900">{tipo.abreviatura}</td>
                                <td className="px-4 py-3 text-sm text-gray-600">{tipo.descripcion}</td>
                                <td className="px-4 py-3 text-sm text-center">{tipo.longitudMaxima ?? '-'}</td>
                                <td className="px-4 py-3 text-sm text-center">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        tipo.esLongitudExacta === 1
                                            ? 'bg-blue-100 text-blue-700'
                                            : 'bg-gray-100 text-gray-600'
                                    }`}>
                                        {tipo.esLongitudExacta === 1 ? 'Exacta' : 'Variable'}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <div className="flex items-center justify-center gap-1">
                                        <button onClick={() => handleEditar(tipo)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors">
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => handleEliminar(tipo.idDocumento)} className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {tiposPaginados.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                                    No se encontraron tipos de documento
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    totalItems={tiposFiltrados.length}
                />
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
                        <div className="p-6 border-b">
                            <h2 className="text-lg font-bold text-gray-900">
                                {seleccionado ? 'Editar Tipo de Documento' : 'Nuevo Tipo de Documento'}
                            </h2>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Abreviatura *</label>
                                <input
                                    type="text"
                                    value={formAbreviatura}
                                    onChange={(e) => setFormAbreviatura(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Ej: DNI"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción *</label>
                                <input
                                    type="text"
                                    value={formDescripcion}
                                    onChange={(e) => setFormDescripcion(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Ej: Documento Nacional de Identidad"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Longitud Máxima</label>
                                <input
                                    type="number"
                                    value={formLongitudMaxima}
                                    onChange={(e) => setFormLongitudMaxima(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Ej: 8"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Longitud</label>
                                <select
                                    value={formEsLongitudExacta}
                                    onChange={(e) => setFormEsLongitudExacta(Number(e.target.value))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value={1}>Longitud Exacta</option>
                                    <option value={0}>Longitud Variable</option>
                                </select>
                            </div>
                        </div>
                        <div className="p-6 border-t flex justify-end gap-3">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleGuardar}
                                disabled={isSubmitting}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                            >
                                {isSubmitting ? 'Guardando...' : seleccionado ? 'Actualizar' : 'Crear'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TipoDocumentosPage;
