import { BookOpen, Clock, Edit, Plus, Search, Trash2, UserCheck, Users, X } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import { toast, Toaster } from 'sonner';
import Pagination from '../../../../../components/common/Pagination';
import SearchableSelect from '../../../../../components/common/SearchableSelect';
import { api, API_ENDPOINTS } from '../../../../../config/api.config';
import { escuelaAuthService } from '../../../../../services/escuelaAuth.service';

interface Docente {
    idDocente: number;
    gradoAcademico: string;
    fechaContratacion: string;
    estadoLaboral: string;
    idUsuario: { idUsuario: number; nombres: string; apellidos: string; idSede?: { idSede: number } | null } | null;
    idEspecialidad: { idEspecialidad: number; nombreEspecialidad: string } | null;
    estado: number;
}

interface Usuario {
    idUsuario: number;
    nombres: string;
    apellidos: string;
    idRol?: { idRol: number };
    idSede?: { idSede: number } | null;
}

interface Especialidad {
    idEspecialidad: number;
    nombreEspecialidad: string;
}

const ESTADOS_LABORALES = ['Activo', 'Inactivo', 'Licencia'];

const DocentesPage: React.FC = () => {
    const [docentes, setDocentes] = useState<Docente[]>([]);
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [especialidades, setEspecialidades] = useState<Especialidad[]>([]);
    const [cargando, setCargando] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [showModal, setShowModal] = useState(false);
    const [seleccionado, setSeleccionado] = useState<Docente | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form state
    const [formIdUsuario, setFormIdUsuario] = useState<number | string>('');
    const [formIdEspecialidad, setFormIdEspecialidad] = useState<number | string>('');
    const [formGradoAcademico, setFormGradoAcademico] = useState('');
    const [formEstadoLaboral, setFormEstadoLaboral] = useState('Activo');
    const [formFechaContratacion, setFormFechaContratacion] = useState('');

    const cargarDatos = useCallback(async () => {
        setCargando(true);
        try {
            const [docentesRes, usuariosRes, especialidadesRes] = await Promise.all([
                api.get<Docente[]>(API_ENDPOINTS.PERFIL_DOCENTE),
                api.get<Usuario[]>(API_ENDPOINTS.USUARIOS),
                api.get<Especialidad[]>(API_ENDPOINTS.ESPECIALIDADES),
            ]);
            const sedeActual = escuelaAuthService.getCurrentUser()?.sede?.idSede;
            const todosDocentes: Docente[] = docentesRes.data || [];
            setDocentes(sedeActual
                ? todosDocentes.filter(d => d.idUsuario?.idSede?.idSede === sedeActual)
                : todosDocentes
            );
            setUsuarios((usuariosRes.data || []).filter(u =>
                u.idRol?.idRol === 2 &&
                (!sedeActual || u.idSede?.idSede === sedeActual)
            ));
            setEspecialidades(especialidadesRes.data || []);
        } catch {
            toast.error('Error al cargar los datos');
        } finally {
            setCargando(false);
        }
    }, []);

    useEffect(() => {
        cargarDatos();
    }, [cargarDatos]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const docentesFiltrados = docentes.filter(d => {
        const nombre = d.idUsuario ? `${d.idUsuario.nombres} ${d.idUsuario.apellidos}` : '';
        const especialidad = d.idEspecialidad?.nombreEspecialidad ?? '';
        const term = searchTerm.toLowerCase();
        return (
            nombre.toLowerCase().includes(term) ||
            especialidad.toLowerCase().includes(term)
        );
    });

    const totalItems = docentesFiltrados.length;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const docentesPaginados = docentesFiltrados.slice(startIndex, startIndex + itemsPerPage);

    const resetForm = () => {
        setFormIdUsuario('');
        setFormIdEspecialidad('');
        setFormGradoAcademico('');
        setFormEstadoLaboral('Activo');
        setFormFechaContratacion('');
    };

    const handleNuevo = () => {
        setSeleccionado(null);
        resetForm();
        setShowModal(true);
    };

    const handleEditar = (docente: Docente) => {
        setSeleccionado(docente);
        setFormIdUsuario(docente.idUsuario ? String(docente.idUsuario.idUsuario) : '');
        setFormIdEspecialidad(docente.idEspecialidad ? String(docente.idEspecialidad.idEspecialidad) : '');
        setFormGradoAcademico(docente.gradoAcademico || '');
        setFormEstadoLaboral(docente.estadoLaboral || 'Activo');
        setFormFechaContratacion(docente.fechaContratacion ? docente.fechaContratacion.slice(0, 10) : '');
        setShowModal(true);
    };

    const handleGuardar = async () => {
        if (!formIdUsuario || !formIdEspecialidad || !formGradoAcademico.trim() || !formFechaContratacion) {
            toast.error('Complete todos los campos obligatorios');
            return;
        }
        setIsSubmitting(true);
        try {
            const body = {
                ...(seleccionado ? { idDocente: seleccionado.idDocente } : {}),
                gradoAcademico: formGradoAcademico.trim(),
                fechaContratacion: formFechaContratacion,
                estadoLaboral: formEstadoLaboral,
                idUsuario: Number(formIdUsuario),
                idEspecialidad: Number(formIdEspecialidad),
            };
            if (seleccionado) {
                await api.put(API_ENDPOINTS.PERFIL_DOCENTE, body);
                toast.success('Docente actualizado');
            } else {
                await api.post(API_ENDPOINTS.PERFIL_DOCENTE, body);
                toast.success('Docente creado');
            }
            setShowModal(false);
            cargarDatos();
        } catch {
            toast.error('Error al guardar');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEliminar = async (id: number) => {
        if (!confirm('¿Está seguro de eliminar este docente?')) return;
        try {
            await api.delete(`${API_ENDPOINTS.PERFIL_DOCENTE}/${id}`);
            toast.success('Docente eliminado');
            cargarDatos();
        } catch {
            toast.error('Error al eliminar');
        }
    };

    const getNombreCompleto = (docente: Docente) =>
        docente.idUsuario
            ? `${docente.idUsuario.nombres} ${docente.idUsuario.apellidos}`
            : 'Sin usuario';

    // Stats derivados
    const totalDocentes = docentes.length;
    const docentesActivos = docentes.filter(d => d.estadoLaboral === 'Activo').length;
    const especialidadesEnUso = new Set(docentes.map(d => d.idEspecialidad?.idEspecialidad).filter(Boolean)).size;
    const enLicencia = docentes.filter(d => d.estadoLaboral === 'Licencia').length;

    return (
        <div className="space-y-6 p-4 md:p-6">
            <Toaster richColors position="top-right" />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Users className="w-7 h-7 text-escuela" />
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Docentes</h1>
                        <p className="text-sm text-gray-500">Gestión de perfiles docentes</p>
                    </div>
                </div>
                <button
                    onClick={handleNuevo}
                    className="bg-gradient-to-r from-escuela to-escuela-light text-white px-6 py-2.5 rounded-lg font-semibold hover:shadow-lg transition-all inline-flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" /> Nuevo Docente
                </button>
            </div>

            {/* Stats Cards */}
            {!cargando && (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white rounded-xl border p-4 flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-medium tracking-wide">Total Docentes</p>
                            <p className="text-3xl font-bold text-gray-900 mt-1">{totalDocentes}</p>
                        </div>
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Users className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                    <div className="bg-white rounded-xl border p-4 flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-medium tracking-wide">Docentes Activos</p>
                            <p className="text-3xl font-bold text-green-600 mt-1">{docentesActivos}</p>
                        </div>
                        <div className="p-2 bg-green-100 rounded-lg">
                            <UserCheck className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                    <div className="bg-white rounded-xl border p-4 flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-medium tracking-wide">Especialidades</p>
                            <p className="text-3xl font-bold text-purple-600 mt-1">{especialidadesEnUso}</p>
                        </div>
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <BookOpen className="w-6 h-6 text-purple-600" />
                        </div>
                    </div>
                    <div className="bg-white rounded-xl border p-4 flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-medium tracking-wide">En Licencia</p>
                            <p className="text-3xl font-bold text-yellow-600 mt-1">{enLicencia}</p>
                        </div>
                        <div className="p-2 bg-yellow-100 rounded-lg">
                            <Clock className="w-6 h-6 text-yellow-600" />
                        </div>
                    </div>
                </div>
            )}

            {/* Search */}
            <div className="bg-white rounded-lg shadow p-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Buscar docente</label>
                <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Buscar por nombre, apellido o especialidad..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-escuela focus:border-transparent"
                    />
                </div>
            </div>

            {/* Loading */}
            {cargando ? (
                <div className="flex items-center justify-center min-h-[300px]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
                </div>
            ) : (
                <>
                    {/* Mobile cards */}
                    <div className="md:hidden space-y-3">
                        {docentesPaginados.length === 0 ? (
                            <div className="bg-white rounded-xl border p-8 text-center text-gray-400">
                                No se encontraron docentes
                            </div>
                        ) : (
                            docentesPaginados.map((docente) => (
                                <div key={docente.idDocente} className="bg-white rounded-xl border p-4 shadow-sm">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-semibold text-gray-900">{getNombreCompleto(docente)}</p>
                                            <p className="text-sm text-gray-500">
                                                {docente.idEspecialidad?.nombreEspecialidad ?? 'Sin especialidad'}
                                            </p>
                                            <p className="text-sm text-gray-600 mt-1">{docente.gradoAcademico}</p>
                                        </div>
                                        <div className="flex gap-1">
                                            <button
                                                onClick={() => handleEditar(docente)}
                                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleEliminar(docente.idDocente)}
                                                className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="mt-2 flex flex-wrap gap-2 text-xs">
                                        <span className={`px-2 py-1 rounded-full font-medium ${
                                            docente.estadoLaboral === 'Activo'
                                                ? 'bg-green-100 text-green-700'
                                                : docente.estadoLaboral === 'Licencia'
                                                ? 'bg-yellow-100 text-yellow-700'
                                                : 'bg-red-100 text-red-700'
                                        }`}>
                                            {docente.estadoLaboral}
                                        </span>
                                        <span className="text-gray-400">
                                            Contratado: {docente.fechaContratacion ? docente.fechaContratacion.slice(0, 10) : '-'}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Desktop table */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="min-w-full bg-white border rounded-xl overflow-hidden shadow-sm">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Nombre Completo</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Especialidad</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Grado Academico</th>
                                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Estado Laboral</th>
                                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Fecha Contratacion</th>
                                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {docentesPaginados.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                                            No se encontraron docentes
                                        </td>
                                    </tr>
                                ) : (
                                    docentesPaginados.map((docente) => (
                                        <tr key={docente.idDocente} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                                {getNombreCompleto(docente)}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-600">
                                                {docente.idEspecialidad?.nombreEspecialidad ?? '-'}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-600">
                                                {docente.gradoAcademico}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                    docente.estadoLaboral === 'Activo'
                                                        ? 'bg-green-100 text-green-700'
                                                        : docente.estadoLaboral === 'Licencia'
                                                        ? 'bg-yellow-100 text-yellow-700'
                                                        : 'bg-red-100 text-red-700'
                                                }`}>
                                                    {docente.estadoLaboral}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-center text-gray-600">
                                                {docente.fechaContratacion ? docente.fechaContratacion.slice(0, 10) : '-'}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <div className="flex items-center justify-center gap-1">
                                                    <button
                                                        onClick={() => handleEditar(docente)}
                                                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleEliminar(docente.idDocente)}
                                                        className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <Pagination
                        currentPage={currentPage}
                        totalItems={totalItems}
                        itemsPerPage={itemsPerPage}
                        onPageChange={setCurrentPage}
                        onItemsPerPageChange={setItemsPerPage}
                    />
                </>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl flex flex-col">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-6 py-5 bg-gradient-to-r from-escuela-light to-escuela-dark rounded-t-lg">
                            <div className="flex items-center gap-3">
                                <div className="w-1 self-stretch bg-white/60 rounded-full" />
                                <h2 className="text-lg font-bold text-white">
                                    {seleccionado ? 'Editar Docente' : 'Nuevo Docente'}
                                </h2>
                            </div>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/20 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 overflow-y-auto flex-1">
                            <div className="grid grid-cols-2 gap-x-6 gap-y-5">
                                {/* Usuario */}
                                <div>
                                    <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
                                        <Users className="w-4 h-4 text-gray-400" />
                                        Usuario <span className="text-red-500">*</span>
                                    </label>
                                    <SearchableSelect<Usuario>
                                        value={formIdUsuario}
                                        onChange={(v) => setFormIdUsuario(v)}
                                        options={usuarios}
                                        getOptionId={(u) => u.idUsuario}
                                        getOptionLabel={(u) => `${u.nombres} ${u.apellidos}`}
                                        placeholder="Buscar por nombre..."
                                        emptyMessage="No se encontraron usuarios"
                                    />
                                </div>

                                {/* Especialidad */}
                                <div>
                                    <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
                                        <BookOpen className="w-4 h-4 text-gray-400" />
                                        Especialidad <span className="text-red-500">*</span>
                                    </label>
                                    <SearchableSelect<Especialidad>
                                        value={formIdEspecialidad}
                                        onChange={(v) => setFormIdEspecialidad(v)}
                                        options={especialidades}
                                        getOptionId={(e) => e.idEspecialidad}
                                        getOptionLabel={(e) => e.nombreEspecialidad}
                                        placeholder="Buscar especialidad..."
                                        emptyMessage="No se encontraron especialidades"
                                    />
                                </div>

                                {/* Grado Academico */}
                                <div>
                                    <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
                                        <UserCheck className="w-4 h-4 text-gray-400" />
                                        Grado Académico <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formGradoAcademico}
                                        onChange={(e) => setFormGradoAcademico(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-escuela focus:border-transparent"
                                        placeholder="Ej: Licenciado en Educacion"
                                    />
                                </div>

                                {/* Estado Laboral */}
                                <div>
                                    <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
                                        <UserCheck className="w-4 h-4 text-gray-400" />
                                        Estado Laboral <span className="text-red-500">*</span>
                                    </label>
                                    <SearchableSelect<{ id: string; label: string }>
                                        value={formEstadoLaboral}
                                        onChange={(v) => setFormEstadoLaboral(String(v))}
                                        options={ESTADOS_LABORALES.map((e) => ({ id: e, label: e }))}
                                        getOptionId={(o) => o.id}
                                        getOptionLabel={(o) => o.label}
                                        placeholder="Seleccionar estado..."
                                    />
                                </div>

                                {/* Fecha Contratacion */}
                                <div className="col-span-2">
                                    <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
                                        <Clock className="w-4 h-4 text-gray-400" />
                                        Fecha de Contratación <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        value={formFechaContratacion}
                                        onChange={(e) => setFormFechaContratacion(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-escuela focus:border-transparent"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="px-6 py-4 bg-gray-50 border-t rounded-b-lg flex justify-end gap-3">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-6 py-2.5 font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleGuardar}
                                disabled={isSubmitting}
                                className="px-6 py-2.5 font-medium text-white bg-gradient-to-r from-escuela to-escuela-light rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
                            >
                                {isSubmitting ? 'Guardando...' : seleccionado ? 'Actualizar Docente' : 'Crear Docente'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DocentesPage;
