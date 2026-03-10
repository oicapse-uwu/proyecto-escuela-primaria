import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Edit, Layers, Plus, Search, Trash2, X } from 'lucide-react';
import { toast, Toaster } from 'sonner';
import { api, API_ENDPOINTS } from '../../../../config/api.config';
import Pagination from '../../../../components/common/Pagination';

// ===================== TYPES =====================

interface AnioEscolar {
    idAnioEscolar: number;
    nombreAnio: string;
}

interface Grado {
    idGrado: number;
    nombreGrado: string;
}

interface Curso {
    idCurso: number;
    nombreCurso: string;
}

interface MallaCurricular {
    idMalla: number;
    idAnioEscolar: AnioEscolar | null;
    idGrado: Grado | null;
    idCurso: Curso | null;
    estado: number;
}

interface MallaFormData {
    idAnioEscolar: number | '';
    idGrado: number | '';
    idCurso: number | '';
}

// ===================== MODAL FORM =====================

interface MallaModalProps {
    isOpen: boolean;
    onClose: () => void;
    mallaEditar: MallaCurricular | null;
    anios: AnioEscolar[];
    grados: Grado[];
    cursos: Curso[];
    onSubmit: (data: MallaFormData) => Promise<void>;
    isSubmitting: boolean;
}

const MallaModal: React.FC<MallaModalProps> = ({
    isOpen,
    onClose,
    mallaEditar,
    anios,
    grados,
    cursos,
    onSubmit,
    isSubmitting,
}) => {
    const [formData, setFormData] = useState<MallaFormData>({
        idAnioEscolar: '',
        idGrado: '',
        idCurso: '',
    });

    useEffect(() => {
        if (mallaEditar) {
            setFormData({
                idAnioEscolar: mallaEditar.idAnioEscolar?.idAnioEscolar ?? '',
                idGrado: mallaEditar.idGrado?.idGrado ?? '',
                idCurso: mallaEditar.idCurso?.idCurso ?? '',
            });
        } else {
            setFormData({ idAnioEscolar: '', idGrado: '', idCurso: '' });
        }
    }, [mallaEditar, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value === '' ? '' : Number(value) }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.idAnioEscolar === '' || formData.idGrado === '' || formData.idCurso === '') {
            toast.error('Todos los campos son obligatorios');
            return;
        }
        await onSubmit(formData);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b">
                    <h2 className="text-lg font-semibold text-gray-800">
                        {mallaEditar ? 'Editar Malla Curricular' : 'Nueva Malla Curricular'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
                    {/* Año Escolar */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Año Escolar <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="idAnioEscolar"
                            value={formData.idAnioEscolar}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            required
                        >
                            <option value="">Seleccionar año escolar</option>
                            {anios.map((a) => (
                                <option key={a.idAnioEscolar} value={a.idAnioEscolar}>
                                    {a.nombreAnio}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Grado */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Grado <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="idGrado"
                            value={formData.idGrado}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            required
                        >
                            <option value="">Seleccionar grado</option>
                            {grados.map((g) => (
                                <option key={g.idGrado} value={g.idGrado}>
                                    {g.nombreGrado}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Curso */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Curso <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="idCurso"
                            value={formData.idCurso}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            required
                        >
                            <option value="">Seleccionar curso</option>
                            {cursos.map((c) => (
                                <option key={c.idCurso} value={c.idCurso}>
                                    {c.nombreCurso}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                            {isSubmitting && (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            )}
                            {mallaEditar ? 'Actualizar' : 'Crear'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// ===================== PAGE =====================

const MallaCurricularPage: React.FC = () => {
    const [mallas, setMallas] = useState<MallaCurricular[]>([]);
    const [anios, setAnios] = useState<AnioEscolar[]>([]);
    const [grados, setGrados] = useState<Grado[]>([]);
    const [cursos, setCursos] = useState<Curso[]>([]);

    const [loading, setLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const [showModal, setShowModal] = useState(false);
    const [mallaEditar, setMallaEditar] = useState<MallaCurricular | null>(null);

    // ---- Data fetching ----

    const cargarMallas = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.get<MallaCurricular[]>(API_ENDPOINTS.MALLA_CURRICULAR);
            setMallas(res.data);
        } catch {
            toast.error('Error al cargar la malla curricular');
        } finally {
            setLoading(false);
        }
    }, []);

    const cargarCatalogos = useCallback(async () => {
        try {
            const [resAnios, resGrados, resCursos] = await Promise.all([
                api.get<AnioEscolar[]>(API_ENDPOINTS.ANIO_ESCOLAR),
                api.get<Grado[]>(API_ENDPOINTS.GRADOS),
                api.get<Curso[]>(API_ENDPOINTS.CURSOS),
            ]);
            setAnios(resAnios.data);
            setGrados(resGrados.data);
            setCursos(resCursos.data);
        } catch {
            toast.error('Error al cargar los catálogos');
        }
    }, []);

    useEffect(() => {
        cargarMallas();
        cargarCatalogos();
    }, [cargarMallas, cargarCatalogos]);

    // Reset page on search change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    // ---- Filtering & pagination ----

    const mallasFiltradas = useMemo(() => {
        const term = searchTerm.toLowerCase();
        return mallas.filter((m) => {
            const anio = m.idAnioEscolar?.nombreAnio?.toLowerCase() ?? '';
            const grado = m.idGrado?.nombreGrado?.toLowerCase() ?? '';
            const curso = m.idCurso?.nombreCurso?.toLowerCase() ?? '';
            return anio.includes(term) || grado.includes(term) || curso.includes(term);
        });
    }, [mallas, searchTerm]);

    const totalPages = Math.ceil(mallasFiltradas.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const mallasPaginadas = mallasFiltradas.slice(startIndex, startIndex + itemsPerPage);

    // ---- Handlers ----

    const handleNuevaMalla = () => {
        setMallaEditar(null);
        setShowModal(true);
    };

    const handleEditarMalla = (malla: MallaCurricular) => {
        setMallaEditar(malla);
        setShowModal(true);
    };

    const handleEliminar = async (id: number) => {
        if (!window.confirm('¿Está seguro de eliminar este registro de malla curricular?')) return;
        try {
            await api.delete(`${API_ENDPOINTS.MALLA_CURRICULAR}/${id}`);
            toast.success('Malla curricular eliminada exitosamente');
            cargarMallas();
        } catch {
            toast.error('Error al eliminar la malla curricular');
        }
    };

    const handleSubmit = async (data: MallaFormData) => {
        setIsSubmitting(true);
        try {
            if (mallaEditar) {
                await api.put(API_ENDPOINTS.MALLA_CURRICULAR, {
                    idMalla: mallaEditar.idMalla,
                    idAnioEscolar: data.idAnioEscolar,
                    idGrado: data.idGrado,
                    idCurso: data.idCurso,
                });
                toast.success('Malla curricular actualizada exitosamente');
            } else {
                await api.post(API_ENDPOINTS.MALLA_CURRICULAR, {
                    idAnioEscolar: data.idAnioEscolar,
                    idGrado: data.idGrado,
                    idCurso: data.idCurso,
                });
                toast.success('Malla curricular creada exitosamente');
            }
            setShowModal(false);
            setMallaEditar(null);
            cargarMallas();
        } catch {
            toast.error(mallaEditar ? 'Error al actualizar la malla curricular' : 'Error al crear la malla curricular');
        } finally {
            setIsSubmitting(false);
        }
    };

    // ===================== RENDER =====================

    return (
        <div className="p-4 lg:p-6 max-w-7xl mx-auto">
            <Toaster position="top-right" richColors />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <Layers className="w-7 h-7 text-primary" />
                        Malla Curricular
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Administre la asignación de cursos por grado y año escolar
                    </p>
                </div>
                <button
                    onClick={handleNuevaMalla}
                    className="flex items-center justify-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors shrink-0"
                >
                    <Plus className="w-5 h-5" />
                    <span>Nueva Malla</span>
                </button>
            </div>

            {/* Search bar */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Buscar por año escolar, grado o curso..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                    />
                </div>
            </div>

            {/* Content */}
            {loading ? (
                <div className="flex justify-center items-center py-16">
                    <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent" />
                </div>
            ) : mallasPaginadas.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 py-16 text-center">
                    <Layers className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">
                        {searchTerm ? 'No se encontraron registros con ese criterio' : 'No hay registros de malla curricular'}
                    </p>
                    {!searchTerm && (
                        <button
                            onClick={handleNuevaMalla}
                            className="mt-4 inline-flex items-center gap-2 text-primary hover:underline text-sm font-medium"
                        >
                            <Plus className="w-4 h-4" />
                            Agregar el primero
                        </button>
                    )}
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    {/* Desktop table */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Año Escolar
                                    </th>
                                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Grado
                                    </th>
                                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Curso
                                    </th>
                                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                                        Estado
                                    </th>
                                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {mallasPaginadas.map((malla) => (
                                    <tr key={malla.idMalla} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                            {malla.idAnioEscolar?.nombreAnio ?? <span className="text-gray-400 italic">Sin año</span>}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700">
                                            {malla.idGrado?.nombreGrado ?? <span className="text-gray-400 italic">Sin grado</span>}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700">
                                            {malla.idCurso?.nombreCurso ?? <span className="text-gray-400 italic">Sin curso</span>}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span
                                                className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full ${
                                                    malla.estado === 1
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-red-100 text-red-700'
                                                }`}
                                            >
                                                {malla.estado === 1 ? 'Activo' : 'Inactivo'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleEditarMalla(malla)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Editar"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleEliminar(malla.idMalla)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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

                    {/* Mobile cards */}
                    <div className="md:hidden divide-y divide-gray-100">
                        {mallasPaginadas.map((malla) => (
                            <div key={malla.idMalla} className="p-4">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <Layers className="w-5 h-5 text-primary shrink-0" />
                                        <span className="font-medium text-gray-900 text-sm">
                                            {malla.idCurso?.nombreCurso ?? 'Sin curso'}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1 shrink-0">
                                        <button
                                            onClick={() => handleEditarMalla(malla)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleEliminar(malla.idMalla)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                                    <div>
                                        <span className="font-medium text-gray-500">Año Escolar:</span>{' '}
                                        {malla.idAnioEscolar?.nombreAnio ?? 'N/A'}
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-500">Grado:</span>{' '}
                                        {malla.idGrado?.nombreGrado ?? 'N/A'}
                                    </div>
                                </div>
                                <div className="mt-2">
                                    <span
                                        className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${
                                            malla.estado === 1
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-red-100 text-red-700'
                                        }`}
                                    >
                                        {malla.estado === 1 ? 'Activo' : 'Inactivo'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalItems={mallasFiltradas.length}
                        itemsPerPage={itemsPerPage}
                        onPageChange={setCurrentPage}
                        onItemsPerPageChange={setItemsPerPage}
                    />
                </div>
            )}

            {/* Modal */}
            <MallaModal
                isOpen={showModal}
                onClose={() => {
                    setShowModal(false);
                    setMallaEditar(null);
                }}
                mallaEditar={mallaEditar}
                anios={anios}
                grados={grados}
                cursos={cursos}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
            />
        </div>
    );
};

export default MallaCurricularPage;
