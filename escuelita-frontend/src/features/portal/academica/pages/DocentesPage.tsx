import React, { useCallback, useEffect, useState } from 'react';
import { Edit, Plus, Search, Trash2, User } from 'lucide-react';
import { toast, Toaster } from 'sonner';
import Pagination from '../../../../components/common/Pagination';
import { api, API_ENDPOINTS } from '../../../../config/api.config';

interface Docente {
    idDocente: number;
    gradoAcademico: string;
    fechaContratacion: string;
    estadoLaboral: string;
    idUsuario: { idUsuario: number; nombres: string; apellidos: string } | null;
    idEspecialidad: { idEspecialidad: number; nombreEspecialidad: string } | null;
    estado: number;
}

interface Usuario {
    idUsuario: number;
    nombres: string;
    apellidos: string;
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
    const [formIdUsuario, setFormIdUsuario] = useState<string>('');
    const [formIdEspecialidad, setFormIdEspecialidad] = useState<string>('');
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
            setDocentes(docentesRes.data || []);
            setUsuarios(usuariosRes.data || []);
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

    return (
        <div className="space-y-6 p-4 md:p-6">
            <Toaster richColors position="top-right" />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                        <User className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Docentes</h1>
                        <p className="text-sm text-gray-500">Gestión de perfiles docentes</p>
                    </div>
                </div>
                <button
                    onClick={handleNuevo}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                    <Plus className="w-4 h-4" /> Nuevo Docente
                </button>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                    type="text"
                    placeholder="Buscar por nombre, apellido o especialidad..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
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
                    {totalItems > itemsPerPage && (
                        <Pagination
                            currentPage={currentPage}
                            totalItems={totalItems}
                            itemsPerPage={itemsPerPage}
                            onPageChange={setCurrentPage}
                            onItemsPerPageChange={setItemsPerPage}
                        />
                    )}
                </>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b">
                            <h2 className="text-lg font-bold text-gray-900">
                                {seleccionado ? 'Editar Docente' : 'Nuevo Docente'}
                            </h2>
                        </div>
                        <div className="p-6 space-y-4">
                            {/* Usuario */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Usuario *
                                </label>
                                <select
                                    value={formIdUsuario}
                                    onChange={(e) => setFormIdUsuario(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">Seleccione un usuario</option>
                                    {usuarios.map((u) => (
                                        <option key={u.idUsuario} value={u.idUsuario}>
                                            {u.nombres} {u.apellidos}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Especialidad */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Especialidad *
                                </label>
                                <select
                                    value={formIdEspecialidad}
                                    onChange={(e) => setFormIdEspecialidad(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">Seleccione una especialidad</option>
                                    {especialidades.map((e) => (
                                        <option key={e.idEspecialidad} value={e.idEspecialidad}>
                                            {e.nombreEspecialidad}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Grado Academico */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Grado Academico *
                                </label>
                                <input
                                    type="text"
                                    value={formGradoAcademico}
                                    onChange={(e) => setFormGradoAcademico(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Ej: Licenciado en Educacion"
                                />
                            </div>

                            {/* Estado Laboral */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Estado Laboral *
                                </label>
                                <select
                                    value={formEstadoLaboral}
                                    onChange={(e) => setFormEstadoLaboral(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    {ESTADOS_LABORALES.map((estado) => (
                                        <option key={estado} value={estado}>
                                            {estado}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Fecha Contratacion */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Fecha de Contratacion *
                                </label>
                                <input
                                    type="date"
                                    value={formFechaContratacion}
                                    onChange={(e) => setFormFechaContratacion(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>
                        <div className="p-6 border-t flex justify-end gap-3">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleGuardar}
                                disabled={isSubmitting}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                            >
                                {isSubmitting ? 'Guardando...' : seleccionado ? 'Actualizar' : 'Crear'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DocentesPage;
