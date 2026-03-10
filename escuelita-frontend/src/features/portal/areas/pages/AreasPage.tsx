import React, { useEffect, useState } from 'react';
import { BookOpen, Edit, Layers, Plus, Search, Trash2 } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import Pagination from '../../../../components/common/Pagination';
import AreaForm from '../components/AreaForm';
import CursoForm from '../components/CursoForm';
import { useAreas } from '../hooks/useAreas';
import type { Area, AreaDTO, Curso, CursoDTO } from '../types/areas.types';

const AreasPage: React.FC = () => {
    const {
        areas, cursos, loading,
        cargarAreas, cargarCursos,
        guardarArea, modificarArea, eliminarAreaById,
        guardarCurso, modificarCurso, eliminarCursoById
    } = useAreas();

    const [activeTab, setActiveTab] = useState<'areas' | 'cursos'>('areas');

    // Estado para Áreas
    const [isAreaModalOpen, setIsAreaModalOpen] = useState(false);
    const [areaEditar, setAreaEditar] = useState<Area | null>(null);
    const [searchAreas, setSearchAreas] = useState('');
    const [pageAreas, setPageAreas] = useState(1);
    const [itemsPerPageAreas, setItemsPerPageAreas] = useState(10);

    // Estado para Cursos
    const [isCursoModalOpen, setIsCursoModalOpen] = useState(false);
    const [cursoEditar, setCursoEditar] = useState<Curso | null>(null);
    const [searchCursos, setSearchCursos] = useState('');
    const [pageCursos, setPageCursos] = useState(1);
    const [itemsPerPageCursos, setItemsPerPageCursos] = useState(10);

    useEffect(() => {
        cargarAreas();
        cargarCursos();
    }, [cargarAreas, cargarCursos]);

    // === LÓGICA ÁREAS ===
    const areasFiltradas = areas.filter(a =>
        a.nombreArea?.toLowerCase().includes(searchAreas.toLowerCase()) ||
        a.descripcion?.toLowerCase().includes(searchAreas.toLowerCase())
    );
    const areasPaginadas = areasFiltradas.slice((pageAreas - 1) * itemsPerPageAreas, pageAreas * itemsPerPageAreas);

    useEffect(() => { setPageAreas(1); }, [searchAreas]);

    const handleEliminarArea = async (id: number) => {
        if (window.confirm('¿Está seguro de eliminar esta área? También se eliminarán los cursos asociados.')) {
            try {
                await eliminarAreaById(id);
                toast.success('Área eliminada exitosamente');
            } catch { toast.error('Error al eliminar el área'); }
        }
    };

    const handleSubmitArea = async (data: AreaDTO) => {
        try {
            if (areaEditar) {
                await modificarArea({ ...data, idArea: areaEditar.idArea });
                toast.success('Área actualizada exitosamente');
            } else {
                await guardarArea(data);
                toast.success('Área creada exitosamente');
            }
            setIsAreaModalOpen(false);
            setAreaEditar(null);
        } catch { toast.error(areaEditar ? 'Error al actualizar el área' : 'Error al crear el área'); }
    };

    // === LÓGICA CURSOS ===
    const cursosFiltrados = cursos.filter(c =>
        c.nombreCurso?.toLowerCase().includes(searchCursos.toLowerCase()) ||
        c.idArea?.nombreArea?.toLowerCase().includes(searchCursos.toLowerCase())
    );
    const cursosPaginados = cursosFiltrados.slice((pageCursos - 1) * itemsPerPageCursos, pageCursos * itemsPerPageCursos);

    useEffect(() => { setPageCursos(1); }, [searchCursos]);

    const handleEliminarCurso = async (id: number) => {
        if (window.confirm('¿Está seguro de eliminar este curso?')) {
            try {
                await eliminarCursoById(id);
                toast.success('Curso eliminado exitosamente');
            } catch { toast.error('Error al eliminar el curso'); }
        }
    };

    const handleSubmitCurso = async (data: CursoDTO) => {
        try {
            if (cursoEditar) {
                await modificarCurso({ ...data, idCurso: cursoEditar.idCurso });
                toast.success('Curso actualizado exitosamente');
            } else {
                await guardarCurso(data);
                toast.success('Curso creado exitosamente');
            }
            setIsCursoModalOpen(false);
            setCursoEditar(null);
        } catch { toast.error(cursoEditar ? 'Error al actualizar el curso' : 'Error al crear el curso'); }
    };

    return (
        <div className="p-4 lg:p-6 max-w-7xl mx-auto">
            <Toaster position="top-right" richColors />

            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <Layers className="text-primary w-7 h-7" /> Áreas y Cursos
                </h1>
                <button
                    onClick={() => {
                        if (activeTab === 'areas') { setAreaEditar(null); setIsAreaModalOpen(true); }
                        else { setCursoEditar(null); setIsCursoModalOpen(true); }
                    }}
                    className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    {activeTab === 'areas' ? 'Nueva Área' : 'Nuevo Curso'}
                </button>
            </div>

            {/* Pestañas */}
            <div className="flex border-b border-gray-200 mb-6">
                <button
                    onClick={() => setActiveTab('areas')}
                    className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === 'areas'
                            ? 'border-primary text-primary'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                >
                    <Layers className="w-4 h-4" /> Áreas ({areas.length})
                </button>
                <button
                    onClick={() => setActiveTab('cursos')}
                    className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === 'cursos'
                            ? 'border-primary text-primary'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                >
                    <BookOpen className="w-4 h-4" /> Cursos ({cursos.length})
                </button>
            </div>

            {/* ===== TAB ÁREAS ===== */}
            {activeTab === 'areas' && (
                <>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Buscar área..."
                                value={searchAreas}
                                onChange={(e) => setSearchAreas(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                            />
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-12">
                            <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent"></div>
                        </div>
                    ) : areasPaginadas.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                            <Layers className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500">No se encontraron áreas</p>
                        </div>
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
                                    {areasPaginadas.map((area) => (
                                        <tr key={area.idArea} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 font-medium uppercase">{area.nombreArea}</td>
                                            <td className="px-6 py-4 text-gray-600 text-sm">{area.descripcion || 'Sin descripción'}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${area.estado === 1 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                    {area.estado === 1 ? 'Activo' : 'Inactivo'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 flex justify-center gap-2">
                                                <button onClick={() => { setAreaEditar(area); setIsAreaModalOpen(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit className="w-4 h-4" /></button>
                                                <button onClick={() => handleEliminarArea(area.idArea)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <Pagination
                                currentPage={pageAreas}
                                totalItems={areasFiltradas.length}
                                itemsPerPage={itemsPerPageAreas}
                                onPageChange={setPageAreas}
                                onItemsPerPageChange={setItemsPerPageAreas}
                            />
                        </div>
                    )}
                </>
            )}

            {/* ===== TAB CURSOS ===== */}
            {activeTab === 'cursos' && (
                <>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Buscar curso o área..."
                                value={searchCursos}
                                onChange={(e) => setSearchCursos(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                            />
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-12">
                            <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent"></div>
                        </div>
                    ) : cursosPaginados.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500 mb-2">No hay cursos registrados</p>
                            <p className="text-gray-400 text-sm">Crea un área primero y luego agrega cursos</p>
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 border-b text-sm text-gray-600">
                                        <th className="px-6 py-4 font-medium">Nombre del Curso</th>
                                        <th className="px-6 py-4 font-medium">Área</th>
                                        <th className="px-6 py-4 font-medium">Estado</th>
                                        <th className="px-6 py-4 font-medium text-center">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {cursosPaginados.map((curso) => (
                                        <tr key={curso.idCurso} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 font-medium">{curso.nombreCurso}</td>
                                            <td className="px-6 py-4 text-gray-600 text-sm">
                                                <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-medium uppercase">
                                                    {curso.idArea?.nombreArea || 'Sin área'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${curso.estado === 1 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                    {curso.estado === 1 ? 'Activo' : 'Inactivo'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 flex justify-center gap-2">
                                                <button onClick={() => { setCursoEditar(curso); setIsCursoModalOpen(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit className="w-4 h-4" /></button>
                                                <button onClick={() => handleEliminarCurso(curso.idCurso)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <Pagination
                                currentPage={pageCursos}
                                totalItems={cursosFiltrados.length}
                                itemsPerPage={itemsPerPageCursos}
                                onPageChange={setPageCursos}
                                onItemsPerPageChange={setItemsPerPageCursos}
                            />
                        </div>
                    )}
                </>
            )}

            {/* Modales */}
            <AreaForm
                isOpen={isAreaModalOpen}
                onClose={() => { setIsAreaModalOpen(false); setAreaEditar(null); }}
                area={areaEditar}
                onSubmit={handleSubmitArea}
                isLoading={loading}
            />
            <CursoForm
                key={cursoEditar?.idCurso ?? 'nuevo-curso'}
                isOpen={isCursoModalOpen}
                onClose={() => { setIsCursoModalOpen(false); setCursoEditar(null); }}
                curso={cursoEditar}
                areas={areas}
                onSubmit={handleSubmitCurso}
                isLoading={loading}
            />
        </div>
    );
};
export default AreasPage;