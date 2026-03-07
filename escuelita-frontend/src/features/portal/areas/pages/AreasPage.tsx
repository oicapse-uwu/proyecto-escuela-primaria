import React, { useEffect, useState } from 'react';
import { Layers, Edit, Plus, Search, Trash2 } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import Pagination from '../../../../components/common/Pagination';
import AreaForm from '../components/AreaForm';
import { useAreas } from '../hooks/useAreas';
import type { Area, AreaDTO } from '../types/areas.types';

const AreasPage: React.FC = () => {
    const { areas, loading, cargarAreas, guardarArea, modificarArea, eliminarAreaById } = useAreas();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [areaEditar, setAreaEditar] = useState<Area | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    useEffect(() => { cargarAreas(); }, [cargarAreas]);

    // FILTRO PROTEGIDO CONTRA PANTALLAS BLANCAS (Usando ?.)
    const filtradas = areas.filter(a =>
        a.nombreArea?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const paginadas = filtradas.slice(indexOfFirstItem, indexOfLastItem);

    useEffect(() => { setCurrentPage(1); }, [searchTerm]);

    const handleEliminar = async (id: number) => {
        if (window.confirm('¿Eliminar esta área?')) {
            try {
                await eliminarAreaById(id);
                toast.success('Área eliminada');
            } catch (error) { toast.error('No se pudo eliminar'); }
        }
    };

    const handleSubmit = async (data: AreaDTO) => {
        try {
            if (areaEditar) {
                await modificarArea({ ...data, idArea: areaEditar.idArea });
                toast.success('Actualizada con éxito');
            } else {
                await guardarArea(data);
                toast.success('Creada con éxito');
            }
            setIsModalOpen(false);
        } catch (error) { toast.error('Error al guardar'); }
    };

    return (
        <div className="p-4 lg:p-6 max-w-7xl mx-auto">
            <Toaster position="top-right" richColors />

            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2"><Layers className="text-primary w-7 h-7" /> Áreas Académicas</h1>
                </div>
                <button onClick={() => { setAreaEditar(null); setIsModalOpen(true); }} className="bg-primary text-white px-4 py-2 rounded-lg flex items-center">
                    <Plus className="w-5 h-5 mr-2" /> Nueva Área
                </button>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-4">
                <div className="relative">
                    <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                    <input type="text" placeholder="Buscar..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary" />
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent"></div></div>
            ) : paginadas.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl shadow-sm"><p className="text-gray-500">No se encontraron áreas</p></div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b text-sm text-gray-600">
                                <th className="px-6 py-4 font-medium">Nombre</th>
                                <th className="px-6 py-4 font-medium">Descripción</th>
                                <th className="px-6 py-4 font-medium">Estado</th>
                                <th className="px-6 py-4 font-medium text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {paginadas.map((area) => (
                                <tr key={area.idArea} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium">{area.nombreArea}</td>
                                    <td className="px-6 py-4 text-gray-600 text-sm">{area.descripcion || 'Sin descripción'}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${area.estado === 1 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {area.estado === 1 ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 flex justify-center gap-2">
                                        <button onClick={() => { setAreaEditar(area); setIsModalOpen(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit className="w-4 h-4" /></button>
                                        <button onClick={() => handleEliminar(area.idArea)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <Pagination currentPage={currentPage} totalItems={filtradas.length} itemsPerPage={itemsPerPage} onPageChange={setCurrentPage} onItemsPerPageChange={setItemsPerPage} />
                </div>
            )}

            <AreaForm isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} area={areaEditar} onSubmit={handleSubmit} isLoading={loading} />
        </div>
    );
};
export default AreasPage;