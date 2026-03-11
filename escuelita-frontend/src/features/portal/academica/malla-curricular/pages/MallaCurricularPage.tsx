import { BookOpen, Edit, Grid3x3, List, Plus, Trash2 } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import MallaCurricularForm from '../components/MallaCurricularForm';
import { useMallaCurricular } from '../hooks/useMallaCurricular';
import type { MallaCurricular, MallaCurricularFormData } from '../types';

const GRADO_LABELS: Record<string, string> = {
    'PRIMERO': '1°', 'SEGUNDO': '2°', 'TERCERO': '3°',
    'CUARTO': '4°', 'QUINTO': '5°', 'SEXTO': '6°'
};
const GRADO_ORDER = ['PRIMERO', 'SEGUNDO', 'TERCERO', 'CUARTO', 'QUINTO', 'SEXTO'];

const AREA_COLORS = [
    { bg: 'bg-blue-50',    border: 'border-blue-200',   header: 'bg-blue-100',   text: 'text-blue-800',   pill: 'bg-blue-100 text-blue-800 border-blue-200'   },
    { bg: 'bg-emerald-50', border: 'border-emerald-200', header: 'bg-emerald-100', text: 'text-emerald-800', pill: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
    { bg: 'bg-purple-50',  border: 'border-purple-200',  header: 'bg-purple-100',  text: 'text-purple-800',  pill: 'bg-purple-100 text-purple-800 border-purple-200'  },
    { bg: 'bg-orange-50',  border: 'border-orange-200',  header: 'bg-orange-100',  text: 'text-orange-800',  pill: 'bg-orange-100 text-orange-800 border-orange-200'  },
    { bg: 'bg-rose-50',    border: 'border-rose-200',    header: 'bg-rose-100',    text: 'text-rose-800',    pill: 'bg-rose-100 text-rose-800 border-rose-200'       },
    { bg: 'bg-cyan-50',    border: 'border-cyan-200',    header: 'bg-cyan-100',    text: 'text-cyan-800',    pill: 'bg-cyan-100 text-cyan-800 border-cyan-200'       },
    { bg: 'bg-yellow-50',  border: 'border-yellow-200',  header: 'bg-yellow-100',  text: 'text-yellow-800',  pill: 'bg-yellow-100 text-yellow-800 border-yellow-200'  },
    { bg: 'bg-indigo-50',  border: 'border-indigo-200',  header: 'bg-indigo-100',  text: 'text-indigo-800',  pill: 'bg-indigo-100 text-indigo-800 border-indigo-200'  },
];

const MallaCurricularPage: React.FC = () => {
    const {
        mallasCurriculares, cursos, areas, loading, error,
        fetchMallasCurriculares, createMallaCurricular,
        updateMallaCurricular, deleteMallaCurricular
    } = useMallaCurricular();

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingMalla, setEditingMalla] = useState<MallaCurricular | null>(null);
    const [selectedAnio, setSelectedAnio] = useState<number | null>(null);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => { fetchMallasCurriculares(); }, [fetchMallasCurriculares]);

    const anios = useMemo(() => {
        const set = new Set(mallasCurriculares.map(m => m.anio));
        return Array.from(set).sort((a, b) => b - a);
    }, [mallasCurriculares]);

    const anioActivo = selectedAnio ?? anios[0] ?? null;

    const mallasFiltradas = useMemo(() => {
        let list = anioActivo ? mallasCurriculares.filter(m => m.anio === anioActivo) : mallasCurriculares;
        if (searchTerm) {
            const q = searchTerm.toLowerCase();
            list = list.filter(m =>
                m.idCurso.nombreCurso.toLowerCase().includes(q) ||
                m.idArea.nombreArea.toLowerCase().includes(q) ||
                m.grado.toLowerCase().includes(q)
            );
        }
        return list;
    }, [mallasCurriculares, anioActivo, searchTerm]);

    const areasEnUso = useMemo(() => {
        const ids = new Set(mallasFiltradas.map(m => m.idArea.idArea));
        return areas.filter(a => ids.has(a.idArea));
    }, [mallasFiltradas, areas]);

    const gradosEnUso = useMemo(() => {
        const set = new Set(mallasFiltradas.map(m => m.grado));
        return GRADO_ORDER.filter(g => set.has(g));
    }, [mallasFiltradas]);

    const mallaMap = useMemo(() => {
        const map = new Map<string, MallaCurricular[]>();
        mallasFiltradas.forEach(m => {
            const key = `${m.idArea.idArea}-${m.grado}`;
            if (!map.has(key)) map.set(key, []);
            map.get(key)!.push(m);
        });
        return map;
    }, [mallasFiltradas]);

    const handleCreate = async (data: MallaCurricularFormData) => {
        try { await createMallaCurricular(data); toast.success('Curso agregado a la malla'); }
        catch { toast.error('Error al crear la malla curricular'); }
    };

    const handleUpdate = async (data: MallaCurricularFormData) => {
        if (!editingMalla) return;
        try {
            await updateMallaCurricular(editingMalla.idMallaCurricular, data);
            toast.success('Malla curricular actualizada');
            setEditingMalla(null);
        } catch { toast.error('Error al actualizar'); }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('¿Eliminar este curso de la malla?')) return;
        try { await deleteMallaCurricular(id); toast.success('Eliminado correctamente'); }
        catch { toast.error('Error al eliminar'); }
    };

    const handleEdit = (malla: MallaCurricular) => { setEditingMalla(malla); setIsFormOpen(true); };
    const handleCloseForm = () => { setIsFormOpen(false); setEditingMalla(null); };

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
            <div className="mb-6 flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                    <BookOpen className="w-8 h-8 text-escuela flex-shrink-0 mt-1" />
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Malla Curricular</h1>
                        <p className="text-gray-600 text-base mt-1">Distribución de cursos por área y grado</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="flex bg-gray-100 rounded-lg p-1">
                        <button onClick={() => setViewMode('grid')} title="Vista malla" className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow text-escuela' : 'text-gray-400 hover:text-gray-600'}`}>
                            <Grid3x3 className="w-4 h-4" />
                        </button>
                        <button onClick={() => setViewMode('list')} title="Vista lista" className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow text-escuela' : 'text-gray-400 hover:text-gray-600'}`}>
                            <List className="w-4 h-4" />
                        </button>
                    </div>
                    <button
                        onClick={() => setIsFormOpen(true)}
                        className="px-6 py-2.5 bg-gradient-to-r from-escuela to-escuela-light text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center gap-2"
                    >
                        <Plus className="w-5 h-5" />
                        Agregar Curso
                    </button>
                </div>
            </div>

            {/* Filtros */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
                {anios.length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium text-gray-500">Año:</span>
                        {anios.map(anio => (
                            <button
                                key={anio}
                                onClick={() => setSelectedAnio(anio)}
                                className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                                    anioActivo === anio
                                        ? 'bg-escuela text-white shadow-md'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                {anio}
                            </button>
                        ))}
                    </div>
                )}
                {viewMode === 'list' && (
                    <input
                        type="text"
                        placeholder="Buscar curso, área o grado..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="ml-auto px-4 py-1.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-escuela focus:border-transparent w-72"
                    />
                )}
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center gap-3 py-24">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-escuela border-t-transparent" />
                    <span className="text-gray-600">Cargando malla curricular...</span>
                </div>
            ) : mallasFiltradas.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-200 flex flex-col items-center justify-center py-24">
                    <BookOpen className="w-16 h-16 text-gray-300 mb-4" />
                    <p className="text-gray-500 text-lg mb-1">No hay cursos para este año</p>
                    <p className="text-gray-400 text-sm">Agrega cursos a la malla para comenzar</p>
                </div>
            ) : viewMode === 'grid' ? (

                /* �.��.��.��.��.��.��.��.��.��.��.��.��.��.� VISTA MALLA / GRID �.��.��.��.��.��.��.��.��.��.��.��.��.��.� */
                <div className="overflow-x-auto pb-4">
                    <div style={{ minWidth: `${gradosEnUso.length * 190 + 160}px` }}>

                        {/* Cabecera de grados */}
                        <div className="grid mb-2" style={{ gridTemplateColumns: `160px repeat(${gradosEnUso.length}, 1fr)` }}>
                            <div />
                            {gradosEnUso.map(grado => (
                                <div key={grado} className="flex flex-col items-center gap-1 px-2 py-2">
                                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-escuela to-escuela-dark text-white flex items-center justify-center font-bold text-lg shadow-md">
                                        {GRADO_LABELS[grado]}
                                    </div>
                                    <span className="text-xs text-gray-500 font-medium">
                                        {grado.charAt(0) + grado.slice(1).toLowerCase()} Grado
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Filas por área */}
                        <div className="flex flex-col gap-2">
                            {areasEnUso.map((area, idx) => {
                                const color = AREA_COLORS[idx % AREA_COLORS.length];
                                return (
                                    <div
                                        key={area.idArea}
                                        className={`grid rounded-xl overflow-hidden border ${color.border} shadow-sm`}
                                        style={{ gridTemplateColumns: `160px repeat(${gradosEnUso.length}, 1fr)` }}
                                    >
                                        {/* Nombre del área */}
                                        <div className={`${color.header} ${color.border} border-r flex items-center justify-center p-3`}>
                                            <span className={`text-xs font-bold text-center ${color.text} leading-tight`}>
                                                {area.nombreArea}
                                            </span>
                                        </div>

                                        {/* Celdas por grado */}
                                        {gradosEnUso.map((grado, gIdx) => {
                                            const key = `${area.idArea}-${grado}`;
                                            const cells = mallaMap.get(key) || [];
                                            return (
                                                <div
                                                    key={grado}
                                                    className={`${color.bg} ${gIdx < gradosEnUso.length - 1 ? `${color.border} border-r` : ''} p-2 min-h-[72px] flex flex-col gap-1.5`}
                                                >
                                                    {cells.map(malla => (
                                                        <div
                                                            key={malla.idMallaCurricular}
                                                            className={`group flex items-center justify-between gap-1 px-2 py-1.5 rounded-lg border text-xs font-medium ${color.pill}`}
                                                        >
                                                            <span className="truncate leading-tight">{malla.idCurso.nombreCurso}</span>
                                                            <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                                                                <button
                                                                    onClick={() => handleEdit(malla)}
                                                                    className="p-0.5 hover:bg-black/10 rounded"
                                                                    title="Editar"
                                                                >
                                                                    <Edit className="w-3 h-3" />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDelete(malla.idMallaCurricular)}
                                                                    className="p-0.5 hover:bg-black/10 rounded"
                                                                    title="Eliminar"
                                                                >
                                                                    <Trash2 className="w-3 h-3" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    {cells.length === 0 && (
                                                        <div className="flex-1 flex items-center justify-center">
                                                            <span className="text-gray-300 text-lg">�?"</span>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Leyenda resumen */}
                        <div className="mt-4 flex flex-wrap gap-2">
                            {areasEnUso.map((area, idx) => {
                                const color = AREA_COLORS[idx % AREA_COLORS.length];
                                const count = mallasFiltradas.filter(m => m.idArea.idArea === area.idArea).length;
                                return (
                                    <span key={area.idArea} className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${color.pill}`}>
                                        <span className={`w-2 h-2 rounded-full ${color.header}`} />
                                        {area.nombreArea}
                                        <span className="opacity-60">({count})</span>
                                    </span>
                                );
                            })}
                        </div>
                    </div>
                </div>

            ) : (

                /* �.��.��.��.��.��.��.��.��.��.��.��.��.��.� VISTA LISTA �.��.��.��.��.��.��.��.��.��.��.��.��.��.� */
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                {['Año', 'Grado', 'Área', 'Curso', 'Acciones'].map(h => (
                                    <th key={h} className={`px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider ${h === 'Acciones' ? 'text-center' : 'text-left'}`}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {mallasFiltradas.map((malla) => {
                                const areaIdx = areas.findIndex(a => a.idArea === malla.idArea.idArea);
                                const color = AREA_COLORS[areaIdx % AREA_COLORS.length];
                                return (
                                    <tr key={malla.idMallaCurricular} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-3 text-sm font-semibold text-gray-900">{malla.anio}</td>
                                        <td className="px-6 py-3 text-sm text-gray-700">
                                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-escuela/10 text-escuela font-bold text-sm">
                                                {GRADO_LABELS[malla.grado]}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${color.pill}`}>
                                                {malla.idArea.nombreArea}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3 text-sm text-gray-900">{malla.idCurso.nombreCurso}</td>
                                        <td className="px-6 py-3">
                                            <div className="flex items-center justify-center gap-2">
                                                <button onClick={() => handleEdit(malla)} className="p-1.5 text-escuela hover:bg-escuela/10 rounded-lg transition" title="Editar">
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => handleDelete(malla.idMallaCurricular)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition" title="Eliminar">
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
            )}

            <MallaCurricularForm
                isOpen={isFormOpen}
                onClose={handleCloseForm}
                onSubmit={editingMalla ? handleUpdate : handleCreate}
                initialData={editingMalla ? {
                    idMallaCurricular: editingMalla.idMallaCurricular,
                    anio: editingMalla.anio,
                    grado: editingMalla.grado,
                    idCurso: editingMalla.idCurso.idCurso,
                    idArea: editingMalla.idArea.idArea,
                    estado: editingMalla.estado
                } : undefined}
                cursos={cursos}
                areas={areas}
                loading={loading}
            />
        </div>
    );
};

export default MallaCurricularPage;
