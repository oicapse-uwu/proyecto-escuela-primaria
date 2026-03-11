import html2canvas from 'html2canvas';
import { BookOpen, Download, Edit, Grid3x3, List, Plus, Search, Trash2 } from 'lucide-react';
import React, { useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import MallaCurricularForm from '../components/MallaCurricularForm';
import { useMallaCurricular } from '../hooks/useMallaCurricular';
import type { MallaCurricular, MallaCurricularFormData } from '../types';

const AREA_COLORS = [
    { box: 'bg-yellow-300 text-yellow-900',   areaCell: 'bg-yellow-200 text-yellow-900',   legend: 'bg-yellow-100 text-yellow-800 border-yellow-300',   dot: 'bg-yellow-400'   },
    { box: 'bg-sky-300 text-sky-900',         areaCell: 'bg-sky-200 text-sky-900',         legend: 'bg-sky-100 text-sky-800 border-sky-300',            dot: 'bg-sky-400'      },
    { box: 'bg-pink-300 text-pink-900',       areaCell: 'bg-pink-200 text-pink-900',       legend: 'bg-pink-100 text-pink-800 border-pink-300',         dot: 'bg-pink-400'     },
    { box: 'bg-emerald-300 text-emerald-900', areaCell: 'bg-emerald-200 text-emerald-900', legend: 'bg-emerald-100 text-emerald-800 border-emerald-300', dot: 'bg-emerald-400'  },
    { box: 'bg-orange-300 text-orange-900',   areaCell: 'bg-orange-200 text-orange-900',   legend: 'bg-orange-100 text-orange-800 border-orange-300',   dot: 'bg-orange-400'   },
    { box: 'bg-purple-300 text-purple-900',   areaCell: 'bg-purple-200 text-purple-900',   legend: 'bg-purple-100 text-purple-800 border-purple-300',   dot: 'bg-purple-400'   },
    { box: 'bg-teal-300 text-teal-900',       areaCell: 'bg-teal-200 text-teal-900',       legend: 'bg-teal-100 text-teal-800 border-teal-300',         dot: 'bg-teal-400'     },
    { box: 'bg-rose-300 text-rose-900',       areaCell: 'bg-rose-200 text-rose-900',       legend: 'bg-rose-100 text-rose-800 border-rose-300',         dot: 'bg-rose-400'     },
];

const PAGE_SIZE = 10;

const MallaCurricularPage: React.FC = () => {
    const {
        mallasCurriculares, cursos, areas, grados, anios, loading, error,
        fetchMallasCurriculares, createMallaCurricular,
        updateMallaCurricular, deleteMallaCurricular
    } = useMallaCurricular();

    const gridRef = useRef<HTMLDivElement>(null);

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingMalla, setEditingMalla] = useState<MallaCurricular | null>(null);
    const [selectedAnio, setSelectedAnio] = useState<number | null>(null);
    const [selectedGrado, setSelectedGrado] = useState<number | null>(null);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [exporting, setExporting] = useState(false);

    const aniosEnUso = useMemo(() => {
        const ids = new Set(mallasCurriculares.map(m => m.idAnioEscolar.idAnioEscolar));
        return anios.filter(a => ids.has(a.idAnioEscolar))
            .sort((a, b) => Number(b.nombreAnio) - Number(a.nombreAnio));
    }, [mallasCurriculares, anios]);

    const anioActivo = selectedAnio ?? aniosEnUso[0]?.idAnioEscolar ?? null;

    // Todos los grados disponibles para el año activo
    const todosLosGrados = useMemo(() => {
        const map = new Map<number, { idGrado: number; nombreGrado: string }>();
        mallasCurriculares
            .filter(m => !anioActivo || m.idAnioEscolar.idAnioEscolar === anioActivo)
            .forEach(m => map.set(m.idGrado.idGrado, m.idGrado));
        return Array.from(map.values()).sort((a, b) => a.idGrado - b.idGrado);
    }, [mallasCurriculares, anioActivo]);

    const mallasFiltradas = useMemo(() => {
        let list = anioActivo
            ? mallasCurriculares.filter(m => m.idAnioEscolar.idAnioEscolar === anioActivo)
            : mallasCurriculares;
        if (selectedGrado !== null) {
            list = list.filter(m => m.idGrado.idGrado === selectedGrado);
        }
        if (searchTerm) {
            const q = searchTerm.toLowerCase();
            list = list.filter(m =>
                m.idCurso.nombreCurso.toLowerCase().includes(q) ||
                (m.idCurso.idArea?.nombreArea?.toLowerCase() ?? '').includes(q) ||
                m.idGrado.nombreGrado.toLowerCase().includes(q)
            );
        }
        // Ordenar por grado (1 al 6)
        list = [...list].sort((a, b) => a.idGrado.idGrado - b.idGrado.idGrado);
        return list;
    }, [mallasCurriculares, anioActivo, selectedGrado, searchTerm]);

    const areasEnUso = useMemo(() => {
        const map = new Map<number, { idArea: number; nombreArea: string }>();
        mallasFiltradas.forEach(m => {
            if (m.idCurso.idArea) map.set(m.idCurso.idArea.idArea, m.idCurso.idArea);
        });
        return Array.from(map.values());
    }, [mallasFiltradas]);

    const gradosEnUso = useMemo(() => {
        const map = new Map<number, { idGrado: number; nombreGrado: string }>();
        mallasFiltradas.forEach(m => map.set(m.idGrado.idGrado, m.idGrado));
        return Array.from(map.values()).sort((a, b) => a.idGrado - b.idGrado);
    }, [mallasFiltradas]);

    const mallaMap = useMemo(() => {
        const map = new Map<string, MallaCurricular[]>();
        mallasFiltradas.forEach(m => {
            const key = `${m.idCurso.idArea?.idArea ?? 0}-${m.idGrado.idGrado}`;
            if (!map.has(key)) map.set(key, []);
            map.get(key)!.push(m);
        });
        return map;
    }, [mallasFiltradas]);

    // Paginacion para vista lista
    const totalPages = Math.max(1, Math.ceil(mallasFiltradas.length / PAGE_SIZE));
    const mallasPagina = useMemo(() => {
        const start = (currentPage - 1) * PAGE_SIZE;
        return mallasFiltradas.slice(start, start + PAGE_SIZE);
    }, [mallasFiltradas, currentPage]);

    const handleCreate = async (data: MallaCurricularFormData) => {
        try { await createMallaCurricular(data); toast.success('Curso agregado a la malla'); }
        catch { toast.error('Error al crear la malla curricular'); }
    };

    const handleUpdate = async (data: MallaCurricularFormData) => {
        if (!editingMalla) return;
        try {
            await updateMallaCurricular(editingMalla.idMalla, data);
            toast.success('Malla curricular actualizada');
            setEditingMalla(null);
        } catch { toast.error('Error al actualizar'); }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Eliminar este curso de la malla?')) return;
        try { await deleteMallaCurricular(id); toast.success('Eliminado correctamente'); }
        catch { toast.error('Error al eliminar'); }
    };

    const handleEdit = (malla: MallaCurricular) => { setEditingMalla(malla); setIsFormOpen(true); };
    const handleCloseForm = () => { setIsFormOpen(false); setEditingMalla(null); };

    const handleSelectGrado = (idGrado: number | null) => {
        setSelectedGrado(idGrado);
        setCurrentPage(1);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const handleExportImage = async () => {
        if (!gridRef.current) return;
        setExporting(true);
        try {
            const canvas = await html2canvas(gridRef.current, {
                backgroundColor: '#ffffff',
                scale: 2,
                useCORS: true,
            });
            const link = document.createElement('a');
            const anioNombre = aniosEnUso.find(a => a.idAnioEscolar === anioActivo)?.nombreAnio ?? 'malla';
            const gradoNombre = selectedGrado
                ? todosLosGrados.find(g => g.idGrado === selectedGrado)?.nombreGrado ?? ''
                : 'completa';
            link.download = `malla-curricular-${anioNombre}-${gradoNombre}.png`.replace(/\s+/g, '-').toLowerCase();
            link.href = canvas.toDataURL('image/png');
            link.click();
            toast.success('Imagen exportada correctamente');
        } catch {
            toast.error('Error al exportar la imagen');
        } finally {
            setExporting(false);
        }
    };

    if (error) return (
        <div className="p-6">
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-red-800">Error: {error}</p>
            </div>
        </div>
    );

    return (
        <div className="pt-8 px-4 pb-8 lg:pt-10 lg:px-6 max-w-full">
            {/* Header */}
            <div className="mb-4 flex items-start justify-between gap-4 flex-wrap">
                <div className="flex items-start gap-3">
                    <BookOpen className="w-8 h-8 text-escuela flex-shrink-0 mt-1" />
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Malla Curricular</h1>
                        <p className="text-gray-600 text-base mt-1">Distribucion de cursos por area y grado</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                    {aniosEnUso.length > 1 && (
                        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                            {aniosEnUso.map(anio => (
                                <button
                                    key={anio.idAnioEscolar}
                                    onClick={() => setSelectedAnio(anio.idAnioEscolar)}
                                    className={`px-3 py-1.5 rounded-md text-sm font-semibold transition-all ${
                                        anioActivo === anio.idAnioEscolar
                                            ? 'bg-white shadow text-escuela'
                                            : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                >
                                    {anio.nombreAnio}
                                </button>
                            ))}
                        </div>
                    )}
                    <div className="flex bg-gray-100 rounded-lg p-1">
                        <button
                            onClick={() => setViewMode('grid')}
                            title="Vista malla"
                            className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow text-escuela' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            <Grid3x3 className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            title="Vista lista"
                            className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow text-escuela' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            <List className="w-4 h-4" />
                        </button>
                    </div>
                    {viewMode === 'grid' && (
                        <button
                            onClick={handleExportImage}
                            disabled={exporting}
                            className="px-4 py-2.5 border border-gray-300 bg-white text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all flex items-center gap-2 disabled:opacity-60"
                            title="Exportar malla como imagen"
                        >
                            <Download className="w-4 h-4" />
                            {exporting ? 'Exportando...' : 'Exportar PNG'}
                        </button>
                    )}
                    <button
                        onClick={() => setIsFormOpen(true)}
                        className="px-6 py-2.5 bg-gradient-to-r from-escuela to-escuela-light text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center gap-2"
                    >
                        <Plus className="w-5 h-5" />
                        Agregar Curso
                    </button>
                </div>
            </div>

            {/* Filtro por grado */}
            {todosLosGrados.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap mb-4">
                    <span className="text-sm text-gray-500 font-medium">Grado:</span>
                    <button
                        onClick={() => handleSelectGrado(null)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                            selectedGrado === null
                                ? 'bg-escuela text-white border-escuela shadow'
                                : 'bg-white text-gray-600 border-gray-300 hover:border-escuela hover:text-escuela'
                        }`}
                    >
                        Todos
                    </button>
                    {todosLosGrados.map(g => (
                        <button
                            key={g.idGrado}
                            onClick={() => handleSelectGrado(g.idGrado)}
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                                selectedGrado === g.idGrado
                                    ? 'bg-escuela text-white border-escuela shadow'
                                    : 'bg-white text-gray-600 border-gray-300 hover:border-escuela hover:text-escuela'
                            }`}
                        >
                            {g.nombreGrado}
                        </button>
                    ))}
                </div>
            )}

            {/* Buscador solo en lista */}
            {viewMode === 'list' && (
                <div className="bg-white rounded-lg shadow p-4 mb-4">
                    <div className="relative w-full">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Buscar curso, area o grado..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-escuela focus:border-transparent"
                        />
                    </div>
                </div>
            )}

            {loading ? (
                <div className="flex flex-col items-center justify-center gap-3 py-24">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-escuela border-t-transparent" />
                    <span className="text-gray-600">Cargando malla curricular...</span>
                </div>
            ) : mallasFiltradas.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-200 flex flex-col items-center justify-center py-24">
                    <BookOpen className="w-16 h-16 text-gray-300 mb-4" />
                    <p className="text-gray-500 text-lg mb-1">No hay cursos para mostrar</p>
                    <p className="text-gray-400 text-sm">Agrega cursos a la malla para comenzar</p>
                </div>
            ) : viewMode === 'grid' ? (

                /* ======================================================= VISTA MALLA / GRID ======================================================= */
                <div className="w-full pb-4">
                    <div ref={gridRef} className="w-full bg-white p-2 rounded-xl">
                        <div className="rounded-xl overflow-hidden border border-gray-300 shadow-md w-full">

                            {/* Cabecera oscura con nombres de grados */}
                            <div className="grid w-full" style={{ gridTemplateColumns: `minmax(100px,140px) repeat(${gradosEnUso.length}, minmax(0,1fr))` }}>
                                <div className="bg-gray-700 p-4 flex items-center justify-center">
                                    <span className="text-gray-400 text-xs font-bold uppercase tracking-wide">Area / Grado</span>
                                </div>
                                {gradosEnUso.map(grado => (
                                    <div
                                        key={grado.idGrado}
                                        className="bg-gray-700 border-l border-gray-600 p-3 flex items-center justify-center text-center"
                                    >
                                        <span className="text-white text-xs font-bold uppercase leading-tight">
                                            {grado.nombreGrado}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Filas por area */}
                            {areasEnUso.map((area, idx) => {
                                const color = AREA_COLORS[idx % AREA_COLORS.length];
                                return (
                                    <div
                                        key={area.idArea}
                                        className="grid border-t border-gray-300 w-full"
                                        style={{ gridTemplateColumns: `minmax(100px,140px) repeat(${gradosEnUso.length}, minmax(0,1fr))` }}
                                    >
                                        <div className={`${color.areaCell} border-r border-gray-300 flex items-center justify-center p-3`}>
                                            <span className="text-xs font-black text-center uppercase leading-tight tracking-wide">
                                                {area.nombreArea}
                                            </span>
                                        </div>
                                        {gradosEnUso.map((grado, gIdx) => {
                                            const key = `${area.idArea}-${grado.idGrado}`;
                                            const cells = mallaMap.get(key) || [];
                                            return (
                                                <div
                                                    key={grado.idGrado}
                                                    className={`bg-white ${gIdx < gradosEnUso.length - 1 ? 'border-r border-gray-300' : ''} p-2 min-h-[80px] flex flex-col items-start gap-1.5`}
                                                >
                                                    {cells.map(malla => (
                                                        <div
                                                            key={malla.idMalla}
                                                            className={`group flex items-center justify-between gap-1 px-2.5 py-2 rounded-lg text-xs font-semibold ${color.box}`}
                                                        >
                                                            <span className="leading-tight">{malla.idCurso.nombreCurso}</span>
                                                            <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                                                                <button onClick={() => handleEdit(malla)} className="p-0.5 hover:bg-black/10 rounded" title="Editar">
                                                                    <Edit className="w-3 h-3" />
                                                                </button>
                                                                <button onClick={() => handleDelete(malla.idMalla)} className="p-0.5 hover:bg-black/10 rounded" title="Eliminar">
                                                                    <Trash2 className="w-3 h-3" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            );
                                        })}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Leyenda de areas */}
                        <div className="mt-4 flex flex-wrap gap-2">
                            {areasEnUso.map((area, idx) => {
                                const color = AREA_COLORS[idx % AREA_COLORS.length];
                                const count = mallasFiltradas.filter(m => m.idCurso.idArea?.idArea === area.idArea).length;
                                return (
                                    <span key={area.idArea} className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${color.legend}`}>
                                        <span className={`w-2 h-2 rounded-full ${color.dot}`} />
                                        {area.nombreArea}
                                        <span className="opacity-60">({count})</span>
                                    </span>
                                );
                            })}
                        </div>
                    </div>
                </div>

            ) : (

                /* ======================================================= VISTA LISTA ======================================================= */
                <div>
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    {['Anio', 'Grado', 'Area', 'Curso', 'Acciones'].map(h => (
                                        <th key={h} className={`px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider ${h === 'Acciones' ? 'text-center' : 'text-left'}`}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {mallasPagina.map((malla) => {
                                    const areaIdx = areasEnUso.findIndex(a => a.idArea === malla.idCurso.idArea?.idArea);
                                    const color = AREA_COLORS[Math.max(areaIdx, 0) % AREA_COLORS.length];
                                    return (
                                        <tr key={malla.idMalla} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-3 text-sm font-semibold text-gray-900">{malla.idAnioEscolar.nombreAnio}</td>
                                            <td className="px-6 py-3 text-sm text-gray-700">{malla.idGrado.nombreGrado}</td>
                                            <td className="px-6 py-3">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${color.box}`}>
                                                    {malla.idCurso.idArea?.nombreArea ?? '-'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-3 text-sm text-gray-900">{malla.idCurso.nombreCurso}</td>
                                            <td className="px-6 py-3">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button onClick={() => handleEdit(malla)} className="p-1.5 text-escuela hover:bg-escuela/10 rounded-lg transition" title="Editar">
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button onClick={() => handleDelete(malla.idMalla)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition" title="Eliminar">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Paginacion */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between mt-4 px-1">
                            <span className="text-sm text-gray-500">
                                Mostrando {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, mallasFiltradas.length)} de {mallasFiltradas.length} registros
                            </span>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                                >
                                    Anterior
                                </button>
                                {Array.from({ length: totalPages }, (_, i) => i + 1)
                                    .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                                    .reduce<(number | 'ellipsis')[]>((acc, p, i, arr) => {
                                        if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push('ellipsis');
                                        acc.push(p);
                                        return acc;
                                    }, [])
                                    .map((p, i) =>
                                        p === 'ellipsis' ? (
                                            <span key={`e-${i}`} className="px-2 text-gray-400">...</span>
                                        ) : (
                                            <button
                                                key={p}
                                                onClick={() => setCurrentPage(p as number)}
                                                className={`w-9 h-9 rounded-lg text-sm font-medium transition ${
                                                    currentPage === p
                                                        ? 'bg-escuela text-white shadow'
                                                        : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                                                }`}
                                            >
                                                {p}
                                            </button>
                                        )
                                    )}
                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                                >
                                    Siguiente
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            <MallaCurricularForm
                isOpen={isFormOpen}
                onClose={handleCloseForm}
                onSubmit={editingMalla ? handleUpdate : handleCreate}
                initialData={editingMalla ? {
                    idMalla: editingMalla.idMalla,
                    idAnioEscolar: editingMalla.idAnioEscolar.idAnioEscolar,
                    idGrado: editingMalla.idGrado.idGrado,
                    idCurso: editingMalla.idCurso.idCurso,
                    idArea: editingMalla.idCurso.idArea?.idArea,
                    estado: editingMalla.estado
                } : undefined}
                cursos={cursos}
                grados={grados}
                anios={anios.filter(a => a.estado !== 0 && a.activo !== 0)}
                loading={loading}
            />
        </div>
    );
};

export default MallaCurricularPage;
