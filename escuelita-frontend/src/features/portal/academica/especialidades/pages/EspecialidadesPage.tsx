import { BookOpen, Edit, Plus, Search, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Toaster, toast } from 'sonner';
import Pagination from '../../../../../components/common/Pagination';
import EspecialidadForm from '../components/EspecialidadForm';
import { useEspecialidades } from '../hooks/useEspecialidades';
import type { Especialidad, EspecialidadDTO } from '../types';

const EspecialidadesPage: React.FC = () => {
    const { especialidades, loading, cargarEspecialidades, guardarEspecialidad, modificarEspecialidad, eliminarEspecialidadById } = useEspecialidades();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [especialidadEditar, setEspecialidadEditar] = useState<Especialidad | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    useEffect(() => { cargarEspecialidades(); }, [cargarEspecialidades]);

    const filtradas = especialidades.filter(e =>
        e.nombreEspecialidad?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const paginadas = filtradas.slice(indexOfFirstItem, indexOfLastItem);

    useEffect(() => { setCurrentPage(1); }, [searchTerm]);

    const handleEliminar = async (id: number) => {
        if (window.confirm('¿Está seguro de eliminar esta especialidad?')) {
            try { await eliminarEspecialidadById(id); toast.success('Especialidad eliminada exitosamente'); } catch (error) { toast.error('Error al eliminar la especialidad'); }
        }
    };

    const handleSubmit = async (data: EspecialidadDTO) => {
        try {
            if (especialidadEditar) { await modificarEspecialidad({ ...data, idEspecialidad: especialidadEditar.idEspecialidad }); toast.success('Especialidad actualizada exitosamente'); }
            else { await guardarEspecialidad(data); toast.success('Especialidad creada exitosamente'); }
            setIsModalOpen(false);
        } catch (error) { toast.error(especialidadEditar ? 'Error al actualizar la especialidad' : 'Error al crear la especialidad'); }
    };

    return (
        <div className="p-4 lg:p-6 max-w-7xl mx-auto">
            <Toaster position="top-right" richColors />
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2"><BookOpen className="text-primary w-7 h-7" /> Especialidades</h1>
                <button onClick={() => { setEspecialidadEditar(null); setIsModalOpen(true); }} className="bg-gradient-to-r from-escuela to-escuela-light text-white px-6 py-2.5 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center gap-2"><Plus className="w-5 h-5" /> Nueva Especialidad</button>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-4 relative">
                <Search className="absolute left-7 top-7 text-gray-400 w-5 h-5" />
                <input type="text" placeholder="Buscar especialidad..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" />
            </div>

            {loading ? <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent"></div></div>
                : paginadas.length === 0 ? <div className="text-center py-12 bg-white rounded-xl shadow-sm"><p className="text-gray-500">No hay especialidades registradas</p></div>
                    : (
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
                                    {paginadas.map(esp => (
                                        <tr key={esp.idEspecialidad} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 font-medium uppercase">{esp.nombreEspecialidad}</td>
                                            <td className="px-6 py-4 text-gray-600 text-sm">{esp.descripcion || 'Sin descripción'}</td>
                                            <td className="px-6 py-4"><span className={`px-3 py-1 text-xs font-semibold rounded-full ${esp.estado === 1 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{esp.estado === 1 ? 'Activo' : 'Inactivo'}</span></td>
                                            <td className="px-6 py-4 flex justify-center gap-2">
                                                <button onClick={() => { setEspecialidadEditar(esp); setIsModalOpen(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit className="w-4 h-4" /></button>
                                                <button onClick={() => handleEliminar(esp.idEspecialidad)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <Pagination currentPage={currentPage} totalItems={filtradas.length} itemsPerPage={itemsPerPage} onPageChange={setCurrentPage} onItemsPerPageChange={setItemsPerPage} />
                        </div>
                    )}
            <EspecialidadForm isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} especialidad={especialidadEditar} onSubmit={handleSubmit} isLoading={loading} />
        </div>
    );
};
export default EspecialidadesPage;