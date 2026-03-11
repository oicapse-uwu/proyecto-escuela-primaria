import { Edit, FileCheck, FileText, Plus, Search, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Toaster, toast } from 'sonner';
import Modal from '../../../../components/common/Modal';
import Pagination from '../../../../components/common/Pagination';
import {
    actualizarRequisito,
    crearRequisito,
    eliminarRequisito,
    obtenerTodosRequisitos
} from '../api/requisitosApi';
import type { RequisitoDocumento, RequisitoDocumentoFormData } from '../types';

const RequisitosPage: React.FC = () => {
    const [requisitos, setRequisitos] = useState<RequisitoDocumento[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [requisitoEditar, setRequisitoEditar] = useState<RequisitoDocumento | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const [formData, setFormData] = useState<RequisitoDocumentoFormData>({
        nombreDocumento: '',
        descripcion: '',
        esObligatorio: true
    });

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        try {
            setLoading(true);
            const data = await obtenerTodosRequisitos();
            setRequisitos(data);
        } catch (error) {
            console.error('Error cargando datos:', error);
            toast.error('Error al cargar requisitos');
        } finally {
            setLoading(false);
        }
    };

    const normalizeText = (value?: string | number | null) =>
        String(value ?? '')
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');

    const requisitosFiltrados = requisitos.filter(req => {
        const search = normalizeText(searchTerm.trim());
        if (!search) return true;

        return (
            normalizeText(req.nombreDocumento).includes(search) ||
            normalizeText(req.descripcion || '').includes(search)
        );
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const requisitosPaginados = requisitosFiltrados.slice(indexOfFirstItem, indexOfLastItem);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const handleNuevo = () => {
        setRequisitoEditar(null);
        setFormData({
            nombreDocumento: '',
            descripcion: '',
            esObligatorio: true
        });
        setShowModal(true);
    };

    const handleEditar = (requisito: RequisitoDocumento) => {
        setRequisitoEditar(requisito);
        setFormData({
            idRequisito: requisito.idRequisito,
            nombreDocumento: requisito.nombreDocumento,
            descripcion: requisito.descripcion || '',
            esObligatorio: requisito.esObligatorio
        });
        setShowModal(true);
    };

    const handleEliminar = async (id: number) => {
        if (window.confirm('¿Está seguro de eliminar este requisito?')) {
            try {
                await eliminarRequisito(id);
                toast.success('Requisito eliminado exitosamente');
                cargarDatos();
            } catch (error) {
                toast.error('Error al eliminar el requisito');
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.nombreDocumento.trim()) {
            toast.error('El nombre del documento es obligatorio');
            return;
        }

        try {
            if (requisitoEditar) {
                await actualizarRequisito(formData);
                toast.success('Requisito actualizado exitosamente');
            } else {
                await crearRequisito(formData);
                toast.success('Requisito creado exitosamente');
            }
            setShowModal(false);
            cargarDatos();
        } catch (error) {
            toast.error(requisitoEditar ? 'Error al actualizar el requisito' : 'Error al crear el requisito');
        }
    };

    const totalRequisitos = requisitosFiltrados.length;
    const requisitosObligatorios = requisitosFiltrados.filter(r => r.esObligatorio).length;
    const requisitosOpcionales = requisitosFiltrados.filter(r => !r.esObligatorio).length;

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
                            <FileCheck className="w-7 h-7 text-primary" />
                            <span>Requisitos de Documentos</span>
                        </h1>
                        <p className="text-gray-600 mt-1 text-sm lg:text-base">
                            Configuración del catálogo de documentos requeridos para matrícula
                        </p>
                    </div>
                    <button
                        onClick={handleNuevo}
                        className="bg-gradient-to-r from-escuela to-escuela-light text-white px-6 py-2.5 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2 whitespace-nowrap"
                    >
                        <Plus className="w-5 h-5" />
                        <span>Nuevo Requisito</span>
                    </button>
                </div>
            </div>

            {/* Estadísticas */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Total Requisitos</p>
                            <p className="text-2xl font-bold text-gray-800">{totalRequisitos}</p>
                        </div>
                        <div className="p-3 bg-blue-50 rounded-lg">
                            <FileCheck className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Obligatorios</p>
                            <p className="text-2xl font-bold text-red-600">{requisitosObligatorios}</p>
                        </div>
                        <div className="p-3 bg-red-50 rounded-lg">
                            <FileText className="w-6 h-6 text-red-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Opcionales</p>
                            <p className="text-2xl font-bold text-green-600">{requisitosOpcionales}</p>
                        </div>
                        <div className="p-3 bg-green-50 rounded-lg">
                            <FileCheck className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Búsqueda */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Buscar por nombre o descripción..."
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

            {/* Tabla - Desktop */}
            <div className="hidden lg:block bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Documento
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Descripción
                                </th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tipo
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {requisitosPaginados.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                        <FileCheck className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                                        <p className="text-lg font-medium">No se encontraron requisitos</p>
                                        <p className="text-sm mt-1">
                                            {searchTerm 
                                                ? 'Intenta con otros criterios de búsqueda' 
                                                : 'Crea tu primer requisito haciendo clic en "Nuevo Requisito"'
                                            }
                                        </p>
                                    </td>
                                </tr>
                            ) : (
                                requisitosPaginados.map((requisito) => (
                                    <tr key={requisito.idRequisito} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <FileText className="w-5 h-5 mr-3 text-blue-500" />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900 uppercase">
                                                        {requisito.nombreDocumento}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-gray-600">
                                                {requisito.descripcion || '-'}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {requisito.esObligatorio ? (
                                                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                                                    Obligatorio
                                                </span>
                                            ) : (
                                                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                                    Opcional
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleEditar(requisito)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Editar"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleEliminar(requisito.idRequisito)}
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

            {/* Cards - Mobile */}
            <div className="lg:hidden space-y-3">
                {requisitosPaginados.length === 0 ? (
                    <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                        <FileCheck className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                        <p className="text-lg font-medium text-gray-900">No se encontraron requisitos</p>
                        <p className="text-sm text-gray-500 mt-1">
                            {searchTerm 
                                ? 'Intenta con otros criterios de búsqueda' 
                                : 'Crea tu primer requisito haciendo clic en "Nuevo Requisito"'
                            }
                        </p>
                    </div>
                ) : (
                    requisitosPaginados.map((requisito) => (
                        <div key={requisito.idRequisito} className="bg-white rounded-lg border border-gray-200 p-4">
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <FileText className="w-5 h-5 text-blue-500" />
                                        <h3 className="font-semibold text-gray-900 uppercase">
                                            {requisito.nombreDocumento}
                                        </h3>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-2">
                                        {requisito.descripcion || 'Sin descripción'}
                                    </p>
                                    {requisito.esObligatorio ? (
                                        <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                                            Obligatorio
                                        </span>
                                    ) : (
                                        <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                            Opcional
                                        </span>
                                    )}
                                </div>
                                <div className="flex gap-1 ml-2">
                                    <button
                                        onClick={() => handleEditar(requisito)}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleEliminar(requisito.idRequisito)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Paginación */}
            {requisitosFiltrados.length > 0 && (
                <div className="mt-4">
                    <Pagination
                        currentPage={currentPage}
                        totalItems={requisitosFiltrados.length}
                        itemsPerPage={itemsPerPage}
                        onPageChange={setCurrentPage}
                        onItemsPerPageChange={setItemsPerPage}
                    />
                </div>
            )}

            {/* Modal de formulario */}
            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title={requisitoEditar ? 'Editar Requisito' : 'Nuevo Requisito'}
                size="lg"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Nombre del Documento */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            <FileText className="inline w-4 h-4 mr-1" />
                            Nombre del Documento <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.nombreDocumento}
                            onChange={(e) => setFormData({...formData, nombreDocumento: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="Ej: Partida de Nacimiento, DNI, etc."
                            required
                        />
                    </div>

                    {/* Descripción */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Descripción
                        </label>
                        <textarea
                            value={formData.descripcion}
                            onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="Descripción adicional del documento..."
                            rows={3}
                        />
                    </div>

                    {/* Checkbox Obligatorio */}
                    <div>
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={formData.esObligatorio}
                                onChange={(e) => setFormData({...formData, esObligatorio: e.target.checked})}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">Es un documento obligatorio</span>
                        </label>
                    </div>

                    {/* Botones */}
                    <div className="flex justify-end gap-3 pt-4 border-t mt-6">
                        <button
                            type="button"
                            onClick={() => setShowModal(false)}
                            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 
                                     transition-colors duration-200 font-medium"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2.5 bg-gradient-to-r from-escuela to-escuela-light text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                        >
                            {requisitoEditar ? 'Actualizar' : 'Crear'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default RequisitosPage;
