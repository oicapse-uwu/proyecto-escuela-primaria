import { Building2, Edit, MapPin, Plus, Star, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import { Toaster } from 'sonner';
import Pagination from '../../../../components/common/Pagination';
import { SearchFilterBar } from '../../../../components/common/SearchFilterBar';
import SedeForm from '../components/SedeForm';
import { useSedes } from '../hooks/useSedes';
import type { Sede, SedeFormData } from '../types';

const SedesPage: React.FC = () => {
    const { 
        sedes, 
        isLoading, 
        crear, 
        actualizar, 
        eliminar 
    } = useSedes();
    
    const [showForm, setShowForm] = useState(false);
    const [sedeEditar, setSedeEditar] = useState<Sede | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const normalizeText = (value?: string | number | null) =>
        String(value ?? '')
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');

    // Filtrar sedes por búsqueda
    const sedesFiltradas = sedes.filter(sede => {
        const search = normalizeText(searchTerm.trim());
        if (!search) return true;

        return (
            normalizeText(sede.nombreSede).includes(search) ||
            normalizeText(sede.idInstitucion?.nombre).includes(search) ||
            normalizeText(sede.distrito).includes(search) ||
            normalizeText(sede.provincia).includes(search) ||
            normalizeText(sede.departamento).includes(search)
        );
    });

    // Aplicar paginación
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const sedesPaginadas = sedesFiltradas.slice(indexOfFirstItem, indexOfLastItem);

    // Resetear a la página 1 cuando cambia el término de búsqueda
    React.useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const handleNueva = () => {
        setSedeEditar(null);
        setShowForm(true);
    };

    const handleEditar = (sede: Sede) => {
        setSedeEditar(sede);
        setShowForm(true);
    };

    const handleEliminar = async (id: number) => {
        if (window.confirm('¿Está seguro de eliminar esta sede?')) {
            try {
                await eliminar(id);
            } catch (error) {
                console.error('Error al eliminar:', error);
            }
        }
    };

    const handleSubmit = async (data: SedeFormData) => {
        try {
            if (sedeEditar) {
                await actualizar({
                    ...data,
                    idSede: sedeEditar.idSede
                });
            } else {
                await crear(data);
            }
            setShowForm(false);
            setSedeEditar(null);
        } catch (error) {
            console.error('Error al guardar:', error);
        }
    };

    const handleCancel = () => {
        setShowForm(false);
        setSedeEditar(null);
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <Toaster position="top-right" richColors />
            
            {/* Header */}
            <div className="mb-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
                            <Building2 className="w-8 h-8 text-primary" />
                            <span>Gestión de Sedes</span>
                        </h1>
                        <p className="text-gray-600 mt-2">
                            Administre las sedes de todas las instituciones del sistema
                        </p>
                    </div>
                    <button
                        onClick={handleNueva}
                        className="bg-gradient-to-r from-[#1e3a8a] to-[#1e1b4b] text-white px-6 py-2.5 rounded-lg flex items-center gap-2 transition-all shadow-md hover:from-[#1e40af] hover:to-[#312e81] hover:shadow-lg font-semibold whitespace-nowrap"
                    >
                        <Plus className="w-5 h-5" />
                        <span>Nueva Sede</span>
                    </button>
                </div>
            </div>

            {/* Barra de búsqueda */}
            <SearchFilterBar
                searchValue={searchTerm}
                onSearchChange={setSearchTerm}
                searchPlaceholder="Buscar por nombre de sede, institución, distrito..."
            />

            {/* Resultados de búsqueda */}
            {searchTerm && (
                <div className="mb-4 text-sm text-gray-600">
                    Mostrando {sedesFiltradas.length} de {sedes.length} sedes
                </div>
            )}

            {/* Tabla */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gradient-to-r from-primary to-primary-light text-white">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold">Sede</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold">Institución</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold">Código SUNAT</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold">Principal</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold">Ubicación</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold">Contacto</th>
                                <th className="px-6 py-4 text-center text-xs font-semibold">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-8 text-center">
                                        <div className="flex items-center justify-center space-x-2">
                                            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                            <span className="text-gray-500">Cargando sedes...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : sedesPaginadas.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                                        {searchTerm 
                                            ? 'No se encontraron sedes que coincidan con la búsqueda' 
                                            : 'No hay sedes registradas'}
                                    </td>
                                </tr>
                            ) : (
                                sedesPaginadas.map((sede) => (
                                    <tr 
                                        key={sede.idSede} 
                                        className="hover:bg-gray-50 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="flex-shrink-0">
                                                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                                        <Building2 className="w-5 h-5 text-primary" />
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-gray-900">
                                                        {sede.nombreSede}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-xs text-gray-900">
                                                {sede.idInstitucion?.nombre || 'N/A'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                                                {sede.codigoEstablecimiento}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {sede.esSedePrincipal ? (
                                                <span className="inline-flex items-center space-x-1 text-yellow-600">
                                                    <Star className="w-4 h-4 fill-current" />
                                                    <span className="text-xs font-medium">Principal</span>
                                                </span>
                                            ) : (
                                                <span className="text-xs text-gray-500">Anexo</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-start space-x-2">
                                                <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                                                <div className="text-xs text-gray-600">
                                                    <div>{sede.distrito}</div>
                                                    <div className="text-xs text-gray-500">
                                                        {sede.provincia}, {sede.departamento}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-xs text-gray-600">
                                                <div className="flex items-center space-x-1">
                                                    <span className="text-xs">📞</span>
                                                    <span>{sede.telefono}</span>
                                                </div>
                                                <div className="text-xs text-gray-500 mt-1">
                                                    {sede.correoInstitucional}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center space-x-2">
                                                <button
                                                    onClick={() => handleEditar(sede)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Editar"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleEliminar(sede.idSede)}
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

                {/* Paginación */}
                {sedesFiltradas.length > 0 && (
                    <Pagination
                        currentPage={currentPage}
                        totalItems={sedesFiltradas.length}
                        itemsPerPage={itemsPerPage}
                        onPageChange={setCurrentPage}
                        onItemsPerPageChange={setItemsPerPage}
                    />
                )}
            </div>

            {/* Modal de formulario */}
            {showForm && (
                <SedeForm
                    sede={sedeEditar}
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                    isLoading={isLoading}
                />
            )}
        </div>
    );
};

export default SedesPage;
