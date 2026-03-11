import { ArrowLeft, BookOpen, Edit, GraduationCap, Plus, Search, Trash2 } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { toast, Toaster } from 'sonner';
import Pagination from '../../../../../components/common/Pagination';
import CursoForm from '../components/CursoForm';
import { useAreas } from '../hooks/useAreas';
import { useCursos } from '../hooks/useCursos';
import type { Area } from '../types/areas.types';
import type { Curso, CursoDTO } from '../types/cursos.types';

const AreasYCursosPage: React.FC = () => {
    const { areas, loading: loadingAreas, cargarAreas } = useAreas();
    const { cursos, loading: loadingCursos, cargarCursos, guardarCurso, modificarCurso, eliminarCursoById } = useCursos();
    
    const [areaSeleccionada, setAreaSeleccionada] = useState<Area | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [cursoEditar, setCursoEditar] = useState<Curso | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    useEffect(() => {
        cargarAreas();
        cargarCursos();
    }, [cargarAreas, cargarCursos]);

    // Mostrar mensaje informativo al entrar a un área
    useEffect(() => {
        if (areaSeleccionada) {
            toast.info('Los cursos son específicos de tu sede y se pueden personalizar según tus necesidades.', {
                duration: 4000
            });
        }
    }, [areaSeleccionada?.idArea]);

    // Contar cursos por área
    const cursosContador = useMemo(() => {
        const contador: Record<number, number> = {};
        cursos.forEach(curso => {
            const idArea = curso.idArea?.idArea;
            if (idArea) {
                contador[idArea] = (contador[idArea] || 0) + 1;
            }
        });
        return contador;
    }, [cursos]);

    // Filtrar áreas por búsqueda
    const areasFiltradas = useMemo(() => {
        const search = searchTerm.toLowerCase().trim();
        if (!search) return areas;
        
        return areas.filter(area =>
            area.nombreArea?.toLowerCase().includes(search)
        );
    }, [areas, searchTerm]);

    // Cursos del área seleccionada
    const cursosDelArea = useMemo(() => {
        if (!areaSeleccionada) return [];
        return cursos.filter(curso => curso.idArea?.idArea === areaSeleccionada.idArea);
    }, [cursos, areaSeleccionada]);

    // Cursos paginados
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const cursosPaginados = cursosDelArea.slice(indexOfFirstItem, indexOfLastItem);

    // Resetear página al cambiar de área
    useEffect(() => {
        setCurrentPage(1);
    }, [areaSeleccionada]);

    const handleNuevoCurso = () => {
        setCursoEditar(null);
        setShowModal(true);
    };

    const handleEditarCurso = (curso: Curso) => {
        setCursoEditar(curso);
        setShowModal(true);
    };

    const handleEliminarCurso = async (id: number) => {
        if (window.confirm('¿Está seguro de eliminar este curso?')) {
            try {
                await eliminarCursoById(id);
                toast.success('Curso eliminado exitosamente');
            } catch {
                toast.error('Error al eliminar el curso');
            }
        }
    };

    const handleSubmitCurso = async (data: CursoDTO) => {
        try {
            // Validar que haya un área seleccionada
            if (!areaSeleccionada) {
                toast.error('Debe seleccionar un área primero');
                return;
            }

            // Asignar el idArea al curso
            const dataConArea: CursoDTO = {
                ...data,
                idArea: areaSeleccionada.idArea
            };

            if (cursoEditar) {
                await modificarCurso({ ...dataConArea, idCurso: cursoEditar.idCurso });
                toast.success('Curso actualizado exitosamente');
            } else {
                await guardarCurso(dataConArea);
                toast.success('Curso creado exitosamente');
            }
            setShowModal(false);
        } catch {
            toast.error(cursoEditar ? 'Error al actualizar el curso' : 'Error al crear el curso');
        }
    };

    const handleVerCursos = (area: Area) => {
        setAreaSeleccionada(area);
    };

    return (
        <div className="pt-8 px-4 pb-4 lg:pt-10 lg:px-6 lg:pb-6 max-w-7xl mx-auto">
            <Toaster position="top-right" richColors />

            {/* Header limpio */}
            <div className="mb-6">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                        {areaSeleccionada && (
                            <button
                                onClick={() => setAreaSeleccionada(null)}
                                className="bg-escuela text-white p-3 rounded-full hover:bg-escuela-dark transition shadow-md flex-shrink-0 mt-1"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                        )}
                        {!areaSeleccionada && (
                            <GraduationCap className="w-8 h-8 text-escuela flex-shrink-0 mt-1" />
                        )}
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                {areaSeleccionada ? areaSeleccionada.nombreArea : 'Áreas y Cursos'}
                            </h1>
                            <p className="text-gray-600 text-base mt-1">
                                {areaSeleccionada 
                                    ? `${cursosDelArea.length} ${cursosDelArea.length === 1 ? 'curso' : 'cursos'} registrados`
                                    : 'Gestiona los cursos de cada área académica del MINEDU'
                                }
                            </p>
                        </div>
                    </div>
                    {areaSeleccionada && (
                        <button
                            onClick={handleNuevoCurso}
                            className="bg-gradient-to-r from-escuela to-escuela-light text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center gap-2 flex-shrink-0"
                        >
                            <Plus className="w-5 h-5" />
                            Nuevo Curso
                        </button>
                    )}
                </div>
            </div>

            {/* Buscador */}
            {!areaSeleccionada && (
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Buscar área..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-escuela focus:border-transparent"
                        />
                    </div>
                </div>
            )}

            {areaSeleccionada ? (
                /* Vista de tabla de cursos */
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        {/* Tabla de cursos */}
                        <div className="p-6">
                        {loadingCursos ? (
                            <div className="flex justify-center py-12">
                                <div className="animate-spin rounded-full h-10 w-10 border-4 border-escuela border-t-transparent"></div>
                            </div>
                        ) : cursosDelArea.length === 0 ? (
                            <div className="text-center py-12">
                                <BookOpen className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                                <p className="text-gray-500 text-lg mb-2">No hay cursos registrados</p>
                                <p className="text-gray-400 text-sm">Crea el primer curso para esta área</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b text-left">
                                            <th className="pb-3 text-sm font-semibold text-gray-600">CURSO</th>
                                            <th className="pb-3 text-sm font-semibold text-gray-600">ÁREA</th>
                                            <th className="pb-3 text-sm font-semibold text-gray-600 text-center">ESTADO</th>
                                            <th className="pb-3 text-sm font-semibold text-gray-600 text-right">ACCIONES</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cursosPaginados.map((curso) => (
                                            <tr key={curso.idCurso} className="border-b last:border-b-0 hover:bg-gray-50 transition">
                                                <td className="py-4 text-gray-900">{curso.nombreCurso}</td>
                                                <td className="py-4 text-gray-600 text-sm">{areaSeleccionada.nombreArea}</td>
                                                <td className="py-4 text-center">
                                                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                                                        curso.estado === 1 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                                    }`}>
                                                        {curso.estado === 1 ? 'ACTIVO' : 'INACTIVO'}
                                                    </span>
                                                </td>
                                                <td className="py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => handleEditarCurso(curso)}
                                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                                            title="Editar"
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleEliminarCurso(curso.idCurso)}
                                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                                            title="Eliminar"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {cursosDelArea.length > 0 && (
                        <div className="border-t border-gray-200">
                            <Pagination
                                currentPage={currentPage}
                                totalItems={cursosDelArea.length}
                                itemsPerPage={itemsPerPage}
                                onPageChange={setCurrentPage}
                                onItemsPerPageChange={setItemsPerPage}
                            />
                        </div>
                    )}
                </div>
            ) : loadingAreas ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-10 w-10 border-4 border-escuela border-t-transparent"></div>
                </div>
            ) : areasFiltradas.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                    <BookOpen className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500 text-lg">No se encontraron áreas</p>
                </div>
            ) : (
                /* Grid de áreas */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {areasFiltradas.map((area) => {
                        const cantidadCursos = cursosContador[area.idArea] || 0;
                        
                        return (
                            <div
                                key={area.idArea}
                                onClick={() => handleVerCursos(area)}
                                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all cursor-pointer group hover:border-escuela"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="bg-gradient-to-br from-escuela to-escuela-light p-3 rounded-lg group-hover:scale-110 transition-transform">
                                        <BookOpen className="w-6 h-6 text-white" />
                                    </div>
                                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                                        area.estado === 1 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                    }`}>
                                        {area.estado === 1 ? 'Activa' : 'Inactiva'}
                                    </span>
                                </div>
                                
                                <h3 className="text-lg font-bold text-gray-800 mb-4 uppercase group-hover:text-escuela transition-colors">
                                    {area.nombreArea}
                                </h3>
                                
                                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                    <div className="flex items-center gap-2 text-escuela">
                                        <div className="text-2xl font-bold">{cantidadCursos}</div>
                                        <div className="text-xs text-gray-600">
                                            {cantidadCursos === 1 ? 'curso' : 'cursos'}
                                        </div>
                                    </div>
                                    <div className="text-xs text-escuela font-semibold group-hover:translate-x-1 transition-transform">
                                        Ver cursos →
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Modal de formulario de curso */}
            {showModal && areaSeleccionada && (
                <CursoForm
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    onSubmit={handleSubmitCurso}
                    curso={cursoEditar}
                    areaPreseleccionada={areaSeleccionada}
                />
            )}
        </div>
    );
};

export default AreasYCursosPage;
