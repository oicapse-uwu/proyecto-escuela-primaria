import { BookOpen, Edit, Plus, Search, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Toaster, toast } from 'sonner';
import Pagination from '../../../../../components/common/Pagination';
import CursoForm from '../components/CursoForm';
import { useAreas } from '../hooks/useAreas';
import { useCursos } from '../hooks/useCursos';
import type { Curso, CursoDTO } from '../types/cursos.types';

const CursosPage: React.FC = () => {
    const { cursos, loading: loadingCursos, cargarCursos, guardarCurso, modificarCurso, eliminarCursoById } = useCursos();
    const { areas, loading: loadingAreas, cargarAreas } = useAreas();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [cursoEditar, setCursoEditar] = useState<Curso | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    useEffect(() => { 
        cargarCursos(); 
        cargarAreas();
    }, [cargarCursos, cargarAreas]);

    const loading = loadingCursos || loadingAreas;

    // FILTRO
    const filtradas = cursos.filter(c => {
        const nombreCurso = c.nombreCurso?.toLowerCase() || '';
        const nombreArea = typeof c.idArea === 'object' 
            ? c.idArea?.nombreArea?.toLowerCase() || ''
            : '';
        const search = searchTerm.toLowerCase();
        return nombreCurso.includes(search) || nombreArea.includes(search);
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const paginadas = filtradas.slice(indexOfFirstItem, indexOfLastItem);

    // Resetear paginación cuando cambia el término de búsqueda (como AreasPage)
    React.useEffect(() => { setCurrentPage(1); }, [searchTerm]);

    const handleEliminar = async (id: number) => {
        if (window.confirm('¿Está seguro de eliminar este curso?')) {
            try {
                await eliminarCursoById(id);
                toast.success('Curso eliminado exitosamente');
            } catch {
                toast.error('Error al eliminar el curso'); 
            }
        }
    };

    const handleSubmit = async (data: CursoDTO) => {
        try {
            if (cursoEditar) {
                await modificarCurso({ ...data, idCurso: cursoEditar.idCurso });
                toast.success('Curso actualizado exitosamente');
            } else {
                await guardarCurso(data);
                toast.success('Curso creado exitosamente');
            }
            setIsModalOpen(false);
        } catch {
            toast.error(cursoEditar ? 'Error al actualizar el curso' : 'Error al crear el curso'); 
        }
    };

    const getNombreArea = (idArea: unknown): string => {
        if (typeof idArea === 'object' && idArea !== null && 'nombreArea' in idArea) {
            return (idArea as { nombreArea?: string }).nombreArea || 'Área desconocida';
        }
        // Buscar en la lista de áreas cargadas
        const area = areas.find(a => a.idArea === idArea);
        return area?.nombreArea || 'Área desconocida';
    };

    return (
        <div className="p-4 lg:p-6 max-w-7xl mx-auto">
            <Toaster position="top-right" richColors />

            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <BookOpen className="text-primary w-7 h-7" /> 
                        Cursos de tu Sede
                    </h1>
                    <p className="text-sm text-gray-600 mt-1">
                        Gestiona los cursos específicos dentro de las áreas académicas globales
                    </p>
                </div>
                <button 
                    onClick={() => { setCursoEditar(null); setIsModalOpen(true); }} 
                    className="bg-gradient-to-r from-escuela to-escuela-light text-white px-6 py-2.5 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" /> Nuevo Curso
                </button>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-4">
                <div className="relative">
                    <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                    <input 
                        type="text" 
                        placeholder="Buscar curso o área..." 
                        value={searchTerm} 
                        onChange={(e) => setSearchTerm(e.target.value)} 
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary" 
                    />
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent"></div>
                </div>
            ) : paginadas.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                    <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No se encontraron cursos</p>
                    <p className="text-sm text-gray-400 mt-1">Crea tu primer curso para comenzar</p>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b text-sm text-gray-600">
                                <th className="px-6 py-4 font-medium">Área</th>
                                <th className="px-6 py-4 font-medium">Nombre del Curso</th>
                                <th className="px-6 py-4 font-medium">Estado</th>
                                <th className="px-6 py-4 font-medium text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {paginadas.map((curso) => (
                                <tr key={curso.idCurso} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-700">
                                            {getNombreArea(curso.idArea)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-medium uppercase">{curso.nombreCurso}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                                            curso.estado === 1 
                                                ? 'bg-green-100 text-green-700' 
                                                : 'bg-red-100 text-red-700'
                                        }`}>
                                            {curso.estado === 1 ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 flex justify-center gap-2">
                                        <button 
                                            onClick={() => { setCursoEditar(curso); setIsModalOpen(true); }} 
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                            title="Editar"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button 
                                            onClick={() => handleEliminar(curso.idCurso)} 
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                            title="Eliminar"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <Pagination 
                        currentPage={currentPage} 
                        totalItems={filtradas.length} 
                        itemsPerPage={itemsPerPage} 
                        onPageChange={setCurrentPage} 
                        onItemsPerPageChange={setItemsPerPage} 
                    />
                </div>
            )}

            <CursoForm 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                curso={cursoEditar} 
                onSubmit={handleSubmit} 
                isLoading={loading}
                areas={areas}
            />
        </div>
    );
};

export default CursosPage;
