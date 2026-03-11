import { ClipboardList, Edit, Plus, Search, Trash2, X } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { toast, Toaster } from 'sonner';
import Pagination from '../../../../../components/common/Pagination';
import { api, API_ENDPOINTS } from '../../../../../config/api.config';

// ===================== TYPES =====================

interface UsuarioDocente {
    idUsuario: number;
    nombres: string;
    apellidos: string;
}

interface Docente {
    idDocente: number;
    idUsuario: UsuarioDocente | null;
}

interface Seccion {
    idSeccion: number;
    nombreSeccion: string;
}

interface Curso {
    idCurso: number;
    nombreCurso: string;
}

interface AnioEscolar {
    idAnioEscolar: number;
    nombreAnio: string;
}

interface AsignacionDocente {
    idAsignacion: number;
    idDocente: Docente | null;
    idSeccion: Seccion | null;
    idCurso: Curso | null;
    idAnioEscolar: AnioEscolar | null;
    estado: number;
}

interface AsignacionForm {
    idDocente: number | '';
    idSeccion: number | '';
    idCurso: number | '';
    idAnioEscolar: number | '';
}

// ===================== HELPERS =====================

const getNombreDocente = (docente: Docente | null): string => {
    if (!docente) return 'Sin docente';
    const usuario = docente.idUsuario;
    if (!usuario) return `Docente #${docente.idDocente}`;
    return `${usuario.nombres} ${usuario.apellidos}`.trim();
};

const FORM_EMPTY: AsignacionForm = {
    idDocente: '',
    idSeccion: '',
    idCurso: '',
    idAnioEscolar: '',
};

// ===================== COMPONENT =====================

const AsignacionDocentePage: React.FC = () => {
    // Data
    const [asignaciones, setAsignaciones] = useState<AsignacionDocente[]>([]);
    const [docentes, setDocentes] = useState<Docente[]>([]);
    const [secciones, setSecciones] = useState<Seccion[]>([]);
    const [cursos, setCursos] = useState<Curso[]>([]);
    const [anios, setAnios] = useState<AnioEscolar[]>([]);

    // UI State
    const [loading, setLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAsignacion, setEditingAsignacion] = useState<AsignacionDocente | null>(null);
    const [formData, setFormData] = useState<AsignacionForm>(FORM_EMPTY);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // ===================== LOAD DATA =====================

    const cargarTodo = async () => {
        setLoading(true);
        try {
            const [resAsig, resDocentes, resSecciones, resCursos, resAnios] = await Promise.all([
                api.get(API_ENDPOINTS.ASIGNACION_DOCENTE),
                api.get(API_ENDPOINTS.PERFIL_DOCENTE),
                api.get(API_ENDPOINTS.SECCIONES),
                api.get(API_ENDPOINTS.CURSOS),
                api.get(API_ENDPOINTS.ANIO_ESCOLAR),
            ]);
            setAsignaciones(Array.isArray(resAsig.data) ? resAsig.data : []);
            setDocentes(Array.isArray(resDocentes.data) ? resDocentes.data : []);
            setSecciones(Array.isArray(resSecciones.data) ? resSecciones.data : []);
            setCursos(Array.isArray(resCursos.data) ? resCursos.data : []);
            setAnios(Array.isArray(resAnios.data) ? resAnios.data : []);
        } catch {
            toast.error('Error al cargar los datos');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarTodo();
    }, []);

    // ===================== FILTER + PAGINATION =====================

    const filtradas = useMemo(() => {
        const term = searchTerm.toLowerCase();
        return asignaciones.filter(a => {
            const docente = getNombreDocente(a.idDocente).toLowerCase();
            const seccion = a.idSeccion?.nombreSeccion?.toLowerCase() ?? '';
            const curso = a.idCurso?.nombreCurso?.toLowerCase() ?? '';
            return docente.includes(term) || seccion.includes(term) || curso.includes(term);
        });
    }, [asignaciones, searchTerm]);

    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const paginadas = filtradas.slice(indexOfFirst, indexOfLast);

    useEffect(() => { setCurrentPage(1); }, [searchTerm]);

    // ===================== MODAL =====================

    const openCrear = () => {
        setEditingAsignacion(null);
        setFormData(FORM_EMPTY);
        setIsModalOpen(true);
    };

    const openEditar = (asig: AsignacionDocente) => {
        setEditingAsignacion(asig);
        setFormData({
            idDocente: asig.idDocente?.idDocente ?? '',
            idSeccion: asig.idSeccion?.idSeccion ?? '',
            idCurso: asig.idCurso?.idCurso ?? '',
            idAnioEscolar: asig.idAnioEscolar?.idAnioEscolar ?? '',
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingAsignacion(null);
        setFormData(FORM_EMPTY);
    };

    // ===================== CRUD =====================

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.idDocente || !formData.idSeccion || !formData.idCurso || !formData.idAnioEscolar) {
            toast.error('Todos los campos son obligatorios');
            return;
        }

        setIsSubmitting(true);
        try {
            if (editingAsignacion) {
                await api.put(API_ENDPOINTS.ASIGNACION_DOCENTE, {
                    idAsignacion: editingAsignacion.idAsignacion,
                    idDocente: Number(formData.idDocente),
                    idSeccion: Number(formData.idSeccion),
                    idCurso: Number(formData.idCurso),
                    idAnioEscolar: Number(formData.idAnioEscolar),
                });
                toast.success('Asignación actualizada correctamente');
            } else {
                await api.post(API_ENDPOINTS.ASIGNACION_DOCENTE, {
                    idDocente: Number(formData.idDocente),
                    idSeccion: Number(formData.idSeccion),
                    idCurso: Number(formData.idCurso),
                    idAnioEscolar: Number(formData.idAnioEscolar),
                });
                toast.success('Asignación creada correctamente');
            }
            closeModal();
            await cargarTodo();
        } catch {
            toast.error('Error al guardar la asignación');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEliminar = async (id: number) => {
        if (!window.confirm('¿Eliminar esta asignación de docente?')) return;
        try {
            await api.delete(`${API_ENDPOINTS.ASIGNACION_DOCENTE}/${id}`);
            toast.success('Asignación eliminada');
            await cargarTodo();
        } catch {
            toast.error('No se pudo eliminar la asignación');
        }
    };

    // ===================== RENDER =====================

    return (
        <div className="p-4 lg:p-6 max-w-7xl mx-auto">
            <Toaster position="top-right" richColors />

            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <ClipboardList className="text-primary w-7 h-7" />
                        Asignación de Docentes
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">Gestione las asignaciones de docentes a secciones y cursos</p>
                </div>
                <button
                    onClick={openCrear}
                    className="bg-gradient-to-r from-escuela to-escuela-light text-white px-6 py-2.5 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    <span className="hidden sm:inline">Nueva Asignación</span>
                    <span className="sm:hidden">Nueva</span>
                </button>
            </div>

            {/* Search */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Buscar por docente, sección o curso..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                </div>
            </div>

            {/* Loading */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent" />
                </div>
            ) : filtradas.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
                    <ClipboardList className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">
                        {searchTerm ? 'No se encontraron asignaciones con ese criterio' : 'No hay asignaciones registradas'}
                    </p>
                </div>
            ) : (
                <>
                    {/* Desktop Table */}
                    <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 border-b text-sm text-gray-600">
                                        <th className="px-6 py-4 font-medium">Docente</th>
                                        <th className="px-6 py-4 font-medium">Sección</th>
                                        <th className="px-6 py-4 font-medium">Curso</th>
                                        <th className="px-6 py-4 font-medium">Año Escolar</th>
                                        <th className="px-6 py-4 font-medium text-center">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {paginadas.map(asig => (
                                        <tr key={asig.idAsignacion} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-gray-800">
                                                {getNombreDocente(asig.idDocente)}
                                            </td>
                                            <td className="px-6 py-4 text-gray-600 text-sm">
                                                {asig.idSeccion?.nombreSeccion ?? '�?"'}
                                            </td>
                                            <td className="px-6 py-4 text-gray-600 text-sm">
                                                {asig.idCurso?.nombreCurso ?? '�?"'}
                                            </td>
                                            <td className="px-6 py-4 text-gray-600 text-sm">
                                                {asig.idAnioEscolar?.nombreAnio ?? '�?"'}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex justify-center gap-2">
                                                    <button
                                                        onClick={() => openEditar(asig)}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="Editar"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleEliminar(asig.idAsignacion)}
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
                        <Pagination
                            currentPage={currentPage}
                            totalItems={filtradas.length}
                            itemsPerPage={itemsPerPage}
                            onPageChange={setCurrentPage}
                            onItemsPerPageChange={setItemsPerPage}
                        />
                    </div>

                    {/* Mobile Cards */}
                    <div className="md:hidden space-y-3">
                        {paginadas.map(asig => (
                            <div key={asig.idAsignacion} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <p className="font-semibold text-gray-800">{getNombreDocente(asig.idDocente)}</p>
                                        <p className="text-xs text-gray-400 mt-0.5">ID #{asig.idAsignacion}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => openEditar(asig)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleEliminar(asig.idAsignacion)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-1.5 text-sm text-gray-600">
                                    <p><span className="font-medium text-gray-700">Sección:</span> {asig.idSeccion?.nombreSeccion ?? '�?"'}</p>
                                    <p><span className="font-medium text-gray-700">Curso:</span> {asig.idCurso?.nombreCurso ?? '�?"'}</p>
                                    <p><span className="font-medium text-gray-700">Año Escolar:</span> {asig.idAnioEscolar?.nombreAnio ?? '�?"'}</p>
                                </div>
                            </div>
                        ))}
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
                            <Pagination
                                currentPage={currentPage}
                                totalItems={filtradas.length}
                                itemsPerPage={itemsPerPage}
                                onPageChange={setCurrentPage}
                                onItemsPerPageChange={setItemsPerPage}
                            />
                        </div>
                    </div>
                </>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
                        {/* Modal Header */}
                        <div className="flex justify-between items-center p-6 border-b border-gray-200">
                            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                <ClipboardList className="w-5 h-5 text-primary" />
                                {editingAsignacion ? 'Editar Asignación' : 'Nueva Asignación'}
                            </h2>
                            <button
                                onClick={closeModal}
                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            {/* Docente */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Docente <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={formData.idDocente}
                                    onChange={e => setFormData(prev => ({ ...prev, idDocente: e.target.value ? Number(e.target.value) : '' }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                                    required
                                >
                                    <option value="">Seleccionar docente...</option>
                                    {docentes.map(d => (
                                        <option key={d.idDocente} value={d.idDocente}>
                                            {getNombreDocente(d)}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Sección */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Sección <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={formData.idSeccion}
                                    onChange={e => setFormData(prev => ({ ...prev, idSeccion: e.target.value ? Number(e.target.value) : '' }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                                    required
                                >
                                    <option value="">Seleccionar sección...</option>
                                    {secciones.map(s => (
                                        <option key={s.idSeccion} value={s.idSeccion}>
                                            {s.nombreSeccion}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Curso */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Curso <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={formData.idCurso}
                                    onChange={e => setFormData(prev => ({ ...prev, idCurso: e.target.value ? Number(e.target.value) : '' }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                                    required
                                >
                                    <option value="">Seleccionar curso...</option>
                                    {cursos.map(c => (
                                        <option key={c.idCurso} value={c.idCurso}>
                                            {c.nombreCurso}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Año Escolar */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Año Escolar <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={formData.idAnioEscolar}
                                    onChange={e => setFormData(prev => ({ ...prev, idAnioEscolar: e.target.value ? Number(e.target.value) : '' }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                                    required
                                >
                                    <option value="">Seleccionar año escolar...</option>
                                    {anios.map(a => (
                                        <option key={a.idAnioEscolar} value={a.idAnioEscolar}>
                                            {a.nombreAnio}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Modal Footer */}
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed text-sm font-medium flex items-center justify-center gap-2"
                                >
                                    {isSubmitting && (
                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                                    )}
                                    {isSubmitting ? 'Guardando...' : editingAsignacion ? 'Actualizar' : 'Guardar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AsignacionDocentePage;
