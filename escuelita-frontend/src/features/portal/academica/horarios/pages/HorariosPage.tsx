import { BookOpen, ChevronDown, Clock, Edit, GraduationCap, Layers, Plus, Trash2, X } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { toast, Toaster } from 'sonner';
import { api, API_ENDPOINTS } from '../../../../../config/api.config';

// ==================== Types ====================

interface Grado {
    idGrado: number;
    nombreGrado: string;
}

interface SeccionOption {
    idSeccion: number;
    nombreSeccion: string;
    idGrado?: { idGrado: number; nombreGrado: string } | null;
}

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
    idArea?: { idArea: number; nombreArea: string } | null;
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

// Same hues as MallaCurricular AREA_COLORS for visual consistency
const AREA_COLORS = [
    { bg: 'bg-yellow-50',  border: 'border-yellow-300', text: 'text-yellow-900', sub: 'text-yellow-700' },
    { bg: 'bg-sky-50',     border: 'border-sky-300',    text: 'text-sky-900',    sub: 'text-sky-700'   },
    { bg: 'bg-pink-50',    border: 'border-pink-300',   text: 'text-pink-900',   sub: 'text-pink-700'  },
    { bg: 'bg-emerald-50', border: 'border-emerald-300',text: 'text-emerald-900',sub: 'text-emerald-700'},
    { bg: 'bg-orange-50',  border: 'border-orange-300', text: 'text-orange-900', sub: 'text-orange-700' },
    { bg: 'bg-purple-50',  border: 'border-purple-300', text: 'text-purple-900', sub: 'text-purple-700' },
    { bg: 'bg-teal-50',    border: 'border-teal-300',   text: 'text-teal-900',   sub: 'text-teal-700'  },
    { bg: 'bg-rose-50',    border: 'border-rose-300',   text: 'text-rose-900',   sub: 'text-rose-700'  },
];

function formatHora(hora: string): string {
    if (!hora) return '';
    return hora.substring(0, 5);
}

function formatHoraDisplay(hora: string): string {
    if (!hora) return '';
    const [hStr, mStr] = hora.substring(0, 5).split(':');
    const h = parseInt(hStr, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12}:${mStr} ${ampm}`;
}

function getDocenteLabel(asignacion: AsignacionNested | null): string {
    if (!asignacion?.idDocente?.idUsuario) return 'Sin docente';
    const { nombres, apellidos } = asignacion.idDocente.idUsuario;
    return `${nombres} ${apellidos}`.trim();
}

function buildAsignacionLabel(asignacion: AsignacionNested): string {
    const docente = asignacion.idDocente?.idUsuario
        ? `${asignacion.idDocente.idUsuario.nombres} ${asignacion.idDocente.idUsuario.apellidos}`.trim()
        : 'Sin docente';
    const curso = asignacion.idCurso?.nombreCurso ?? 'Sin curso';
    const seccion = asignacion.idSeccion?.nombreSeccion ?? 'Sin sección';
    return `${docente} — ${curso} (${seccion})`;
}

function getColorByAreaId(idArea: number | undefined, map: Map<number, number>) {
    const idx = idArea !== undefined ? (map.get(idArea) ?? 0) : 0;
    return AREA_COLORS[idx % AREA_COLORS.length];
}

// ==================== Modal ====================

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
    prefill?: { diaSemana?: string; horaInicio?: string };
    onSubmit: (data: FormState) => void;
    onCancel: () => void;
}

const HorarioModal: React.FC<HorarioModalProps> = ({
    horario, asignaciones, aulas, isLoading, prefill, onSubmit, onCancel,
}) => {
    const [form, setForm] = useState<FormState>({
        diaSemana: horario?.diaSemana ?? prefill?.diaSemana ?? '',
        horaInicio: horario?.horaInicio ? formatHora(horario.horaInicio) : prefill?.horaInicio ?? '',
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
            toast.error('Complete todos los campos');
            return;
        }
        onSubmit(form);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg flex flex-col">
                <div className="flex items-center justify-between px-6 py-5 bg-gradient-to-r from-escuela-light to-escuela-dark rounded-t-lg">
                    <div className="flex items-center gap-3">
                        <div className="w-1 self-stretch bg-white/60 rounded-full" />
                        <h2 className="text-lg font-bold text-white">
                            {horario ? 'Editar Horario' : 'Nuevo Horario'}
                        </h2>
                    </div>
                    <button onClick={onCancel} className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/20 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="p-6 grid grid-cols-2 gap-x-6 gap-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Día <span className="text-red-500">*</span></label>
                            <select name="diaSemana" value={form.diaSemana} onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-escuela focus:border-transparent" required>
                                <option value="">Seleccionar día</option>
                                {DIAS_SEMANA.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Aula <span className="text-red-500">*</span></label>
                            <select name="idAula" value={form.idAula} onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-escuela focus:border-transparent" required>
                                <option value="">Seleccionar aula</option>
                                {aulas.map(a => <option key={a.idAula} value={a.idAula}>{a.nombreAula}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Hora inicio <span className="text-red-500">*</span></label>
                            <input type="time" name="horaInicio" value={form.horaInicio} onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-escuela focus:border-transparent" required />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Hora fin <span className="text-red-500">*</span></label>
                            <input type="time" name="horaFin" value={form.horaFin} onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-escuela focus:border-transparent" required />
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Asignación (Docente · Curso · Sección) <span className="text-red-500">*</span></label>
                            <select name="idAsignacion" value={form.idAsignacion} onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-escuela focus:border-transparent" required>
                                <option value="">Seleccionar asignación</option>
                                {asignaciones.map(a => <option key={a.idAsignacion} value={a.idAsignacion}>{a.label}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="px-6 py-4 bg-gray-50 border-t rounded-b-lg flex justify-end gap-3">
                        <button type="button" onClick={onCancel} disabled={isLoading}
                            className="px-6 py-2.5 font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50">
                            Cancelar
                        </button>
                        <button type="submit" disabled={isLoading}
                            className="px-6 py-2.5 font-medium text-white bg-gradient-to-r from-escuela to-escuela-light rounded-lg hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2">
                            {isLoading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                            {horario ? 'Actualizar' : 'Crear Horario'}
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
    const [grados, setGrados] = useState<Grado[]>([]);
    const [secciones, setSecciones] = useState<SeccionOption[]>([]);
    const [loading, setLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [selectedGradoId, setSelectedGradoId] = useState<number | null>(null);
    const [selectedSeccionId, setSelectedSeccionId] = useState<number | null>(null);

    const [showModal, setShowModal] = useState(false);
    const [horarioSeleccionado, setHorarioSeleccionado] = useState<Horario | null>(null);
    const [prefill, setPrefill] = useState<{ diaSemana?: string; horaInicio?: string } | undefined>();

    // ---- Fetch ----

    const fetchHorarios = async () => {
        try {
            const res = await api.get<Horario[]>(API_ENDPOINTS.HORARIOS);
            setHorarios((res.data ?? []).filter(h => h.estado === 1));
        } catch {
            toast.error('Error al actualizar los horarios');
        }
    };

    useEffect(() => {
        const init = async () => {
            setLoading(true);
            try {
                const [resHorarios, resAsig, resAulas, resGrados, resSecciones] = await Promise.all([
                    api.get<Horario[]>(API_ENDPOINTS.HORARIOS),
                    api.get<AsignacionNested[]>(API_ENDPOINTS.ASIGNACION_DOCENTE),
                    api.get<AulaNested[]>(API_ENDPOINTS.AULAS),
                    api.get<Grado[]>(API_ENDPOINTS.GRADOS),
                    api.get<SeccionOption[]>(API_ENDPOINTS.SECCIONES),
                ]);
                setHorarios((resHorarios.data ?? []).filter(h => h.estado === 1));
                setAsignaciones((resAsig.data ?? []).map(a => ({
                    idAsignacion: a.idAsignacion,
                    label: buildAsignacionLabel(a),
                    idDocente: a.idDocente ?? null,
                    idCurso: a.idCurso ?? null,
                    idSeccion: a.idSeccion ?? null,
                })));
                setAulas(resAulas.data ?? []);
                setGrados(resGrados.data ?? []);
                setSecciones(resSecciones.data ?? []);
            } catch {
                toast.error('Error al cargar los datos');
            } finally {
                setLoading(false);
            }
        };
        init();
    }, []);

    // ---- Derived ----

    const seccionesFiltradas = useMemo(
        () => selectedGradoId ? secciones.filter(s => s.idGrado?.idGrado === selectedGradoId) : [],
        [secciones, selectedGradoId]
    );

    const horariosFiltrados = useMemo(
        () => selectedSeccionId
            ? horarios.filter(h => h.idAsignacion?.idSeccion?.idSeccion === selectedSeccionId)
            : [],
        [horarios, selectedSeccionId]
    );

    const timeSlots = useMemo(() => {
        const slots = new Set(horariosFiltrados.map(h => formatHora(h.horaInicio)));
        return Array.from(slots).sort();
    }, [horariosFiltrados]);

    const activeDays = useMemo(() => {
        const withData = new Set(horariosFiltrados.map(h => h.diaSemana));
        return DIAS_SEMANA.filter(d => d !== 'Sábado' || withData.has('Sábado'));
    }, [horariosFiltrados]);

    const gridMap = useMemo(() => {
        const map: Record<string, Record<string, Horario[]>> = {};
        for (const h of horariosFiltrados) {
            const dia = h.diaSemana;
            const hora = formatHora(h.horaInicio);
            if (!map[dia]) map[dia] = {};
            if (!map[dia][hora]) map[dia][hora] = [];
            map[dia][hora].push(h);
        }
        return map;
    }, [horariosFiltrados]);

    // Stable area → color index map (same area always = same color, ordered by first occurrence across all asignaciones)
    const areaColorMap = useMemo(() => {
        const map = new Map<number, number>();
        let idx = 0;
        for (const a of asignaciones) {
            const areaId = a.idCurso?.idArea?.idArea;
            if (areaId !== undefined && !map.has(areaId)) {
                map.set(areaId, idx++);
            }
        }
        return map;
    }, [asignaciones]);

    // ---- Handlers ----

    const handleNuevo = (diaSemana?: string, horaInicio?: string) => {
        setHorarioSeleccionado(null);
        setPrefill({ diaSemana, horaInicio });
        setShowModal(true);
    };

    const handleEditar = (horario: Horario) => {
        setHorarioSeleccionado(horario);
        setPrefill(undefined);
        setShowModal(true);
    };

    const handleEliminar = async (id: number) => {
        if (!window.confirm('¿Eliminar este horario?')) return;
        try {
            await api.delete(`${API_ENDPOINTS.HORARIOS}/${id}`);
            toast.success('Horario eliminado');
            await fetchHorarios();
        } catch {
            toast.error('Error al eliminar');
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
                toast.success('Horario actualizado');
            } else {
                await api.post(API_ENDPOINTS.HORARIOS, body);
                toast.success('Horario creado');
            }
            setShowModal(false);
            await fetchHorarios();
        } catch {
            toast.error('Error al guardar');
        } finally {
            setIsSubmitting(false);
        }
    };

    // ==================== Render ====================

    const selectedGrado = grados.find(g => g.idGrado === selectedGradoId);
    const selectedSeccion = secciones.find(s => s.idSeccion === selectedSeccionId);

    return (
        <div className="space-y-6 p-4 md:p-6">
            <Toaster position="top-right" richColors />

            {/* Header */}
            <div className="flex items-center gap-3">
                <Clock className="w-7 h-7 text-escuela" />
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Horarios</h1>
                    <p className="text-sm text-gray-500">Gestione los horarios de clases por sección</p>
                </div>
            </div>

            {/* Stats */}
            {!loading && (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white rounded-xl border p-4 flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-medium tracking-wide">Total Horarios</p>
                            <p className="text-3xl font-bold text-blue-600 mt-1">{horarios.length}</p>
                        </div>
                        <div className="p-2 bg-blue-100 rounded-lg"><Clock className="w-6 h-6 text-blue-600" /></div>
                    </div>
                    <div className="bg-white rounded-xl border p-4 flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-medium tracking-wide">Grados</p>
                            <p className="text-3xl font-bold text-emerald-600 mt-1">{grados.length}</p>
                        </div>
                        <div className="p-2 bg-emerald-100 rounded-lg"><GraduationCap className="w-6 h-6 text-emerald-600" /></div>
                    </div>
                    <div className="bg-white rounded-xl border p-4 flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-medium tracking-wide">Secciones</p>
                            <p className="text-3xl font-bold text-purple-600 mt-1">{secciones.length}</p>
                        </div>
                        <div className="p-2 bg-purple-100 rounded-lg"><Layers className="w-6 h-6 text-purple-600" /></div>
                    </div>
                    <div className="bg-white rounded-xl border p-4 flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-medium tracking-wide">Esta sección</p>
                            <p className="text-3xl font-bold text-amber-600 mt-1">{horariosFiltrados.length}</p>
                        </div>
                        <div className="p-2 bg-amber-100 rounded-lg"><BookOpen className="w-6 h-6 text-amber-600" /></div>
                    </div>
                </div>
            )}

            {/* Selectors + button row */}
            <div className="bg-white rounded-lg shadow px-5 py-4 flex flex-wrap items-end gap-3">
                <div className="w-44">
                    <label className="block text-xs text-gray-500 mb-1.5">Grado</label>
                    <div className="relative">
                        <GraduationCap className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <select
                            value={selectedGradoId ?? ''}
                            onChange={e => {
                                const v = e.target.value ? Number(e.target.value) : null;
                                setSelectedGradoId(v);
                                setSelectedSeccionId(null);
                            }}
                            className="w-full pl-10 pr-10 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-escuela focus:border-transparent appearance-none"
                        >
                            <option value="">— Grado —</option>
                            {grados.map(g => <option key={g.idGrado} value={g.idGrado}>{g.nombreGrado}</option>)}
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                </div>
                <div className="w-40">
                    <label className="block text-xs text-gray-500 mb-1.5">Sección</label>
                    <div className="relative">
                        <Layers className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <select
                            value={selectedSeccionId ?? ''}
                            onChange={e => setSelectedSeccionId(e.target.value ? Number(e.target.value) : null)}
                            disabled={!selectedGradoId}
                            className="w-full pl-8 pr-7 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-escuela focus:border-transparent appearance-none disabled:bg-gray-50 disabled:text-gray-400"
                        >
                            <option value="">— Sección —</option>
                            {seccionesFiltradas.map(s => <option key={s.idSeccion} value={s.idSeccion}>{s.nombreSeccion}</option>)}
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                </div>
                <div className="flex-1" />
                <button
                    onClick={() => handleNuevo()}
                    disabled={!selectedSeccionId}
                    className="bg-gradient-to-r from-escuela to-escuela-light text-white px-6 py-2.5 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
                    title={!selectedSeccionId ? 'Selecciona un grado y sección primero' : undefined}
                >
                    <Plus className="w-4 h-4" />
                    Nuevo Horario
                </button>
            </div>

            {/* Grid / Empty state */}
            {loading ? (
                <div className="flex justify-center py-16">
                    <div className="animate-spin rounded-full h-10 w-10 border-4 border-escuela border-t-transparent" />
                </div>
            ) : !selectedSeccionId ? (
                <div className="bg-white rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center py-20 gap-3">
                    <Clock className="w-12 h-12 text-gray-200" />
                    <p className="text-gray-400 font-medium">Selecciona un grado y una sección</p>
                    <p className="text-gray-300 text-sm">para visualizar su horario semanal</p>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    {/* Panel header */}
                    <div className="px-5 py-4 border-b">
                        <h2 className="font-bold text-gray-800">
                            {selectedGrado?.nombreGrado} — {selectedSeccion?.nombreSeccion}
                        </h2>
                        <p className="text-xs text-gray-400 mt-0.5">
                            {new Set(horariosFiltrados.map(h => h.diaSemana)).size} días con clases · {horariosFiltrados.length} bloques
                        </p>
                    </div>

                    {timeSlots.length === 0 ? (
                        <div className="py-16 text-center text-gray-400">
                            <p>No hay horarios para esta sección aún.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse min-w-[600px]">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th className="w-20 px-4 py-3 text-xs font-semibold text-gray-500 uppercase border-b border-r text-center">
                                            Hora
                                        </th>
                                        {activeDays.map(dia => (
                                            <th key={dia} className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase border-b text-center">
                                                {dia}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {timeSlots.map((slot, rowIdx) => (
                                        <tr key={slot} className={rowIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'}>
                                            <td className="px-3 py-3 text-xs font-bold text-gray-500 text-center border-r whitespace-nowrap align-top">
                                                {formatHoraDisplay(slot)}
                                            </td>
                                            {activeDays.map(dia => {
                                                const blocks = gridMap[dia]?.[slot] ?? [];
                                                return (
                                                    <td key={dia} className="px-2 py-2 align-top border-l border-gray-100 min-w-[130px]">
                                                        <div className="space-y-1">
                                                            {blocks.map(h => {
                                                                const color = getColorByAreaId(h.idAsignacion?.idCurso?.idArea?.idArea, areaColorMap);
                                                                return (
                                                                    <div
                                                                        key={h.idHorario}
                                                                        className={`group relative rounded-lg border px-2.5 py-2 ${color.bg} ${color.border}`}
                                                                    >
                                                                        <p className={`text-xs font-bold leading-tight ${color.text}`}>
                                                                            {h.idAsignacion?.idCurso?.nombreCurso ?? '—'}
                                                                        </p>
                                                                        <p className={`text-xs mt-0.5 truncate ${color.sub}`}>
                                                                            {getDocenteLabel(h.idAsignacion)}
                                                                        </p>
                                                                        <p className={`text-xs opacity-70 ${color.sub}`}>
                                                                            {h.idAula?.nombreAula ?? '—'} · {formatHoraDisplay(h.horaInicio)}–{formatHoraDisplay(h.horaFin)}
                                                                        </p>
                                                                        <div className="absolute top-1 right-1 hidden group-hover:flex gap-0.5 bg-white/80 rounded p-0.5">
                                                                            <button
                                                                                onClick={() => handleEditar(h)}
                                                                                className="p-1 text-blue-500 hover:text-blue-700 rounded transition-colors"
                                                                            >
                                                                                <Edit className="w-3 h-3" />
                                                                            </button>
                                                                            <button
                                                                                onClick={() => handleEliminar(h.idHorario)}
                                                                                className="p-1 text-red-500 hover:text-red-700 rounded transition-colors"
                                                                            >
                                                                                <Trash2 className="w-3 h-3" />
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <HorarioModal
                    horario={horarioSeleccionado}
                    asignaciones={asignaciones}
                    aulas={aulas}
                    isLoading={isSubmitting}
                    prefill={prefill}
                    onSubmit={handleSubmit}
                    onCancel={() => { setShowModal(false); setHorarioSeleccionado(null); }}
                />
            )}
        </div>
    );
};

export default HorariosPage;
