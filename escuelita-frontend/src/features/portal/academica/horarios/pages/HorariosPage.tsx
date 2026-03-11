import { Clock, Edit, Plus, Search, Trash2 } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { toast, Toaster } from 'sonner';
import Pagination from '../../../../../components/common/Pagination';
import { api, API_ENDPOINTS } from '../../../../../config/api.config';

// ==================== Types ====================

interface UsuarioNested {
    nombres: string;
    apellidos: string;
}

interface DocenteNested {
    idDocente: number;
    idUsuario: UsuarioNested | null;
}

interface CursoNested {
    idCurso: number;
    nombreCurso: string;
}

interface SeccionNested {
    idSeccion: number;
    nombreSeccion: string;
}

interface AsignacionNested {
    idAsignacion: number;
    idDocente: DocenteNested | null;
    idCurso: CursoNested | null;
    idSeccion: SeccionNested | null;
}

interface AulaNested {
    idAula: number;
    nombreAula: string;
}

interface Horario {
    idHorario: number;
    diaSemana: string;
    horaInicio: string;
    horaFin: string;
    idAsignacion: AsignacionNested | null;
    idAula: AulaNested | null;
    estado: number;
}

interface AsignacionOption {
    idAsignacion: number;
    label: string;
    idDocente: DocenteNested | null;
    idCurso: CursoNested | null;
    idSeccion: SeccionNested | null;
}

interface AulaOption {
    idAula: number;
    nombreAula: string;
}

// ==================== Helpers ====================

const DIAS_SEMANA = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

function formatHora(hora: string): string {
    if (!hora) return '';
    // "08:00:00" -> "08:00"
    return hora.substring(0, 5);
}

function getDocenteLabel(asignacion: AsignacionNested | null): string {
    if (!asignacion?.idDocente?.idUsuario) return 'Sin docente';
    const { nombres, apellidos } = asignacion.idDocente.idUsuario;
    return `${nombres} ${apellidos}`.trim();
}

function getCursoLabel(asignacion: AsignacionNested | null): string {
    return asignacion?.idCurso?.nombreCurso ?? 'Sin curso';
}

function getSeccionLabel(asignacion: AsignacionNested | null): string {
    return asignacion?.idSeccion?.nombreSeccion ?? 'Sin sección';
}

function getAulaLabel(aula: AulaNested | null): string {
    return aula?.nombreAula ?? 'Sin aula';
}

function buildAsignacionLabel(asignacion: AsignacionNested): string {
    const docente = asignacion.idDocente?.idUsuario
        ? `${asignacion.idDocente.idUsuario.nombres} ${asignacion.idDocente.idUsuario.apellidos}`.trim()
        : 'Sin docente';
    const curso = asignacion.idCurso?.nombreCurso ?? 'Sin curso';
    const seccion = asignacion.idSeccion?.nombreSeccion ?? 'Sin sección';
    return `${docente} - ${curso} - ${seccion}`;
}

// ==================== Modal Form ====================

interface FormState {
    diaSemana: string;
    horaInicio: string;
    horaFin: string;
    idAsignacion: string;
    idAula: string;
}

interface HorarioModalProps {
    horario: Horario | null;
    asignaciones: AsignacionOption[];
    aulas: AulaOption[];
    isLoading: boolean;
    onSubmit: (data: FormState) => void;
    onCancel: () => void;
}

const HorarioModal: React.FC<HorarioModalProps> = ({
    horario,
    asignaciones,
    aulas,
    isLoading,
    onSubmit,
    onCancel,
}) => {
    const [form, setForm] = useState<FormState>({
        diaSemana: horario?.diaSemana ?? '',
        horaInicio: horario?.horaInicio ? formatHora(horario.horaInicio) : '',
        horaFin: horario?.horaFin ? formatHora(horario.horaFin) : '',
        idAsignacion: horario?.idAsignacion?.idAsignacion?.toString() ?? '',
        idAula: horario?.idAula?.idAula?.toString() ?? '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.diaSemana || !form.horaInicio || !form.horaFin || !form.idAsignacion || !form.idAula) {
            toast.error('Por favor, complete todos los campos');
            return;
        }
        onSubmit(form);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
                <div className="flex items-center justify-between px-6 py-4 border-b">
                    <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-primary" />
                        {horario ? 'Editar Horario' : 'Nuevo Horario'}
                    </h2>
                    <button
                        onClick={onCancel}
                        className="text-gray-400 hover:text-gray-600 transition-colors text-xl leading-none"
                        aria-label="Cerrar"
                    >
                        &times;
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
                    {/* Día de semana */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Día de la semana <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="diaSemana"
                            value={form.diaSemana}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                            required
                        >
                            <option value="">Seleccionar día</option>
                            {DIAS_SEMANA.map(dia => (
                                <option key={dia} value={dia}>{dia}</option>
                            ))}
                        </select>
                    </div>

                    {/* Hora inicio */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Hora inicio <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="time"
                            name="horaInicio"
                            value={form.horaInicio}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                            required
                        />
                    </div>

                    {/* Hora fin */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Hora fin <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="time"
                            name="horaFin"
                            value={form.horaFin}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                            required
                        />
                    </div>

                    {/* Asignación */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Asignación (Docente - Curso - Sección) <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="idAsignacion"
                            value={form.idAsignacion}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                            required
                        >
                            <option value="">Seleccionar asignación</option>
                            {asignaciones.map(a => (
                                <option key={a.idAsignacion} value={a.idAsignacion}>
                                    {a.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Aula */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Aula <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="idAula"
                            value={form.idAula}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                            required
                        >
                            <option value="">Seleccionar aula</option>
                            {aulas.map(a => (
                                <option key={a.idAula} value={a.idAula}>
                                    {a.nombreAula}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onCancel}
                            disabled={isLoading}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                            {isLoading && (
                                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            )}
                            {horario ? 'Actualizar' : 'Crear'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// ==================== Main Page ====================

const HorariosPage: React.FC = () => {
    const [horarios, setHorarios] = useState<Horario[]>([]);
    const [asignaciones, setAsignaciones] = useState<AsignacionOption[]>([]);
    const [aulas, setAulas] = useState<AulaOption[]>([]);
    const [loading, setLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const [showModal, setShowModal] = useState(false);
    const [horarioSeleccionado, setHorarioSeleccionado] = useState<Horario | null>(null);

    // ---- Fetch data ----

    const fetchHorarios = async () => {
        setLoading(true);
        try {
            const res = await api.get<Horario[]>(API_ENDPOINTS.HORARIOS);
            const activos = (res.data ?? []).filter(h => h.estado === 1);
            setHorarios(activos);
        } catch {
            toast.error('Error al cargar los horarios');
        } finally {
            setLoading(false);
        }
    };

    const fetchAsignaciones = async () => {
        try {
            const res = await api.get<AsignacionNested[]>(API_ENDPOINTS.ASIGNACION_DOCENTE);
            const options: AsignacionOption[] = (res.data ?? []).map(a => ({
                idAsignacion: a.idAsignacion,
                label: buildAsignacionLabel(a),
                idDocente: a.idDocente ?? null,
                idCurso: a.idCurso ?? null,
                idSeccion: a.idSeccion ?? null,
            }));
            setAsignaciones(options);
        } catch {
            toast.error('Error al cargar las asignaciones');
        }
    };

    const fetchAulas = async () => {
        try {
            const res = await api.get<AulaNested[]>(API_ENDPOINTS.AULAS);
            setAulas(res.data ?? []);
        } catch {
            toast.error('Error al cargar las aulas');
        }
    };

    useEffect(() => {
        fetchHorarios();
        fetchAsignaciones();
        fetchAulas();
    }, []);

    // ---- Filter + Pagination ----

    const horariosFiltrados = useMemo(() => {
        const term = searchTerm.toLowerCase().trim();
        if (!term) return horarios;
        return horarios.filter(h => {
            const dia = h.diaSemana?.toLowerCase() ?? '';
            const docente = getDocenteLabel(h.idAsignacion).toLowerCase();
            const curso = getCursoLabel(h.idAsignacion).toLowerCase();
            const aula = getAulaLabel(h.idAula).toLowerCase();
            return dia.includes(term) || docente.includes(term) || curso.includes(term) || aula.includes(term);
        });
    }, [horarios, searchTerm]);

    const totalPages = Math.ceil(horariosFiltrados.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const horariosPaginados = horariosFiltrados.slice(startIndex, startIndex + itemsPerPage);

    // ---- Handlers ----

    const handleNuevoHorario = () => {
        setHorarioSeleccionado(null);
        setShowModal(true);
    };

    const handleEditarHorario = (horario: Horario) => {
        setHorarioSeleccionado(horario);
        setShowModal(true);
    };

    const handleEliminarHorario = async (id: number) => {
        if (!window.confirm('¿Está seguro de eliminar este horario?')) return;
        try {
            await api.delete(`${API_ENDPOINTS.HORARIOS}/${id}`);
            toast.success('Horario eliminado exitosamente');
            await fetchHorarios();
        } catch {
            toast.error('Error al eliminar el horario');
        }
    };

    const handleSubmit = async (formData: FormState) => {
        setIsSubmitting(true);
        try {
            const body = {
                diaSemana: formData.diaSemana,
                horaInicio: formData.horaInicio,
                horaFin: formData.horaFin,
                idAsignacion: Number(formData.idAsignacion),
                idAula: Number(formData.idAula),
                ...(horarioSeleccionado ? { idHorario: horarioSeleccionado.idHorario } : {}),
            };

            if (horarioSeleccionado) {
                await api.put(API_ENDPOINTS.HORARIOS, body);
                toast.success('Horario actualizado exitosamente');
            } else {
                await api.post(API_ENDPOINTS.HORARIOS, body);
                toast.success('Horario creado exitosamente');
            }

            setShowModal(false);
            setHorarioSeleccionado(null);
            await fetchHorarios();
        } catch {
            toast.error(horarioSeleccionado ? 'Error al actualizar el horario' : 'Error al crear el horario');
        } finally {
            setIsSubmitting(false);
        }
    };

    // ==================== Render ====================

    return (
        <div className="p-6">
            <Toaster position="top-right" richColors />

            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <Clock className="w-7 h-7 text-primary" />
                    <span>Gestión de Horarios</span>
                </h1>
                <p className="text-gray-600 mt-1">
                    Administre los horarios de clases asignados por docente, curso y sección.
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Total Horarios</p>
                            <p className="text-2xl font-bold text-gray-800">{horarios.length}</p>
                        </div>
                        <Clock className="w-10 h-10 text-blue-500 opacity-50" />
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Días con clases</p>
                            <p className="text-2xl font-bold text-gray-800">
                                {new Set(horarios.map(h => h.diaSemana)).size}
                            </p>
                        </div>
                        <Clock className="w-10 h-10 text-green-500 opacity-50" />
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Resultados</p>
                            <p className="text-2xl font-bold text-gray-800">{horariosFiltrados.length}</p>
                        </div>
                        <Search className="w-10 h-10 text-purple-500 opacity-50" />
                    </div>
                </div>
            </div>

            {/* Search + Action */}
            <div className="bg-white rounded-lg shadow mb-6 p-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Buscar por día, docente, curso o aula..."
                            value={searchTerm}
                            onChange={e => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                        />
                    </div>
                    <button
                        onClick={handleNuevoHorario}
                        className="bg-gradient-to-r from-escuela to-escuela-light text-white px-6 py-2.5 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                        <Plus className="w-5 h-5" />
                        <span>Nuevo Horario</span>
                    </button>
                </div>
            </div>

            {/* Table / Cards */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-gray-500">Cargando horarios...</div>
                ) : horariosPaginados.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        {searchTerm ? 'No se encontraron horarios con ese criterio' : 'No hay horarios registrados'}
                    </div>
                ) : (
                    <>
                        {/* Desktop table */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Día</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Hora Inicio</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Hora Fin</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Docente</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Curso</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Sección</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Aula</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wide">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {horariosPaginados.map(horario => (
                                        <tr key={horario.idHorario} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    <Clock className="w-3 h-3" />
                                                    {horario.diaSemana}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-700">
                                                {formatHora(horario.horaInicio)}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-700">
                                                {formatHora(horario.horaFin)}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-700">
                                                {getDocenteLabel(horario.idAsignacion)}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-700">
                                                {getCursoLabel(horario.idAsignacion)}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-700">
                                                {getSeccionLabel(horario.idAsignacion)}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-700">
                                                {getAulaLabel(horario.idAula)}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleEditarHorario(horario)}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="Editar"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleEliminarHorario(horario.idHorario)}
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
                        <div className="md:hidden divide-y divide-gray-200">
                            {horariosPaginados.map(horario => (
                                <div key={horario.idHorario} className="p-4">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-5 h-5 text-primary flex-shrink-0" />
                                            <span className="font-medium text-gray-900">{horario.diaSemana}</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEditarHorario(horario)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleEliminarHorario(horario.idHorario)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="space-y-1 text-sm text-gray-600 pl-7">
                                        <p>
                                            <span className="font-medium text-gray-700">Horario: </span>
                                            {formatHora(horario.horaInicio)} - {formatHora(horario.horaFin)}
                                        </p>
                                        <p>
                                            <span className="font-medium text-gray-700">Docente: </span>
                                            {getDocenteLabel(horario.idAsignacion)}
                                        </p>
                                        <p>
                                            <span className="font-medium text-gray-700">Curso: </span>
                                            {getCursoLabel(horario.idAsignacion)}
                                        </p>
                                        <p>
                                            <span className="font-medium text-gray-700">Sección: </span>
                                            {getSeccionLabel(horario.idAsignacion)}
                                        </p>
                                        <p>
                                            <span className="font-medium text-gray-700">Aula: </span>
                                            {getAulaLabel(horario.idAula)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Pagination */}
            {!loading && horariosFiltrados.length > 0 && (
                <div className="mt-6">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                        itemsPerPage={itemsPerPage}
                        totalItems={horariosFiltrados.length}
                    />
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <HorarioModal
                    horario={horarioSeleccionado}
                    asignaciones={asignaciones}
                    aulas={aulas}
                    isLoading={isSubmitting}
                    onSubmit={handleSubmit}
                    onCancel={() => {
                        setShowModal(false);
                        setHorarioSeleccionado(null);
                    }}
                />
            )}
        </div>
    );
};

export default HorariosPage;
