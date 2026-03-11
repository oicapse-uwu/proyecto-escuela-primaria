import React, { useEffect } from 'react';
import { toast } from 'sonner';
import Modal from '../../../../../components/common/Modal';
import { api, API_ENDPOINTS } from '../../../../../config/api.config';
import type { Especialidad, PerfilDocenteFormData, Usuario } from '../types';

interface DocenteFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: PerfilDocenteFormData) => Promise<void>;
    initialData?: PerfilDocenteFormData;
    usuarios: Usuario[];
    especialidades: Especialidad[];
    loading?: boolean;
    fetchUsuarios?: () => Promise<void>;
}

const ESTADOS_LABORALES = [
    { value: 'ACTIVO', label: 'Activo' },
    { value: 'INACTIVO', label: 'Inactivo' },
    { value: 'SUSPENDIDO', label: 'Suspendido' },
    { value: 'RENUNCIA', label: 'Renuncia' }
];

const GRADOS_ACADEMICOS = [
    { value: 'LICENCIATURA', label: 'Licenciatura' },
    { value: 'MAESTRIA', label: 'Maestría' },
    { value: 'DOCTORADO', label: 'Doctorado' },
    { value: 'TECNICO', label: 'Técnico' },
    { value: 'PROFESIONAL', label: 'Profesional' },
    { value: 'BACHILLER', label: 'Bachiller' }
];

const DocenteForm: React.FC<DocenteFormProps> = ({
    isOpen,
    onClose,
    onSubmit,
    initialData,
    usuarios,
    especialidades,
    loading = false,
    fetchUsuarios
}) => {
    const [formData, setFormData] = React.useState<PerfilDocenteFormData>({
        gradoAcademico: '',
        fechaContratacion: '',
        estadoLaboral: '',
        idUsuario: 0,
        idEspecialidad: 0
    });

    // Cargar datos iniciales cuando se edita
    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData({
                gradoAcademico: '',
                fechaContratacion: '',
                estadoLaboral: '',
                idUsuario: 0,
                idEspecialidad: 0
            });
        }
    }, [initialData, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.gradoAcademico || !formData.fechaContratacion || !formData.estadoLaboral || !formData.idUsuario || !formData.idEspecialidad) {
            alert('Todos los campos son obligatorios');
            return;
        }

        try {
            await onSubmit(formData);
            onClose();
        } catch (error) {
            // Error ya manejado en el hook
        }
    };

    const handleClose = () => {
        setFormData({
            gradoAcademico: '',
            fechaContratacion: '',
            estadoLaboral: '',
            idUsuario: 0,
            idEspecialidad: 0
        });
        onClose();
    };

    const [emailSearch, setEmailSearch] = React.useState('');

    const searchByEmail = async () => {
        if (!emailSearch) return;
        try {
            const res = await api.get(`${API_ENDPOINTS.USUARIOS}?email=${encodeURIComponent(emailSearch)}`);
            const data = res.data;
            if (Array.isArray(data) && data.length > 0) {
                const u = data[0];
                setFormData(prev => ({ ...prev, idUsuario: Number(u.idUsuario || u.id) }));
                toast.success('Usuario encontrado y seleccionado');
            } else if (data && data.idUsuario) {
                setFormData(prev => ({ ...prev, idUsuario: Number(data.idUsuario) }));
                toast.success('Usuario encontrado y seleccionado');
            } else {
                toast.error('No se encontró usuario con ese correo');
            }
        } catch (err) {
            console.error('Error buscando usuario por email:', err);
            toast.error('Error al buscar usuario por email');
        }
    };

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={handleClose}
            title={initialData?.idDocente ? 'Editar Docente' : 'Nuevo Docente'}
        >

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Usuario */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Usuario *
                        </label>
                        <div className="mb-2">
                            {usuarios.length === 0 ? (
                                <div className="text-sm text-gray-600 mb-2">No hay usuarios disponibles en la lista.</div>
                            ) : null}
                            <div className="flex space-x-2">
                                <select
                                    value={formData.idUsuario}
                                    onChange={(e) => setFormData({...formData, idUsuario: Number(e.target.value)})}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                >
                                    <option value={0}>Seleccionar usuario</option>
                                    {usuarios.map(usuario => {
                                        const nombre = usuario?.nombreUsuario || `${(usuario as any)?.nombres || ''} ${(usuario as any)?.apellidos || ''}`.trim();
                                        const label = nombre || usuario?.email || `ID ${usuario?.idUsuario}`;
                                        return (
                                            <option key={usuario.idUsuario} value={usuario.idUsuario}>
                                                {label}
                                            </option>
                                        );
                                    })}
                                </select>
                                <button
                                    type="button"
                                    onClick={() => { if (typeof fetchUsuarios === 'function') fetchUsuarios(); }}
                                    className="px-3 py-2 bg-gray-100 rounded-md text-sm"
                                >Refrescar</button>
                            </div>
                        </div>

                        {/* Buscar por email si la lista está vacía o no contiene el usuario */}
                        <div className="mt-2 flex items-center space-x-2">
                            <input
                                type="email"
                                placeholder="Buscar por correo (si no aparece)"
                                value={emailSearch}
                                onChange={(e) => setEmailSearch(e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                            />
                            <button
                                type="button"
                                onClick={searchByEmail}
                                className="px-4 py-2 bg-gradient-to-r from-escuela to-escuela-light text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                            >Buscar</button>
                        </div>
                    </div>

                    {/* Grado Académico */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Grado Académico *
                        </label>
                        <select
                            value={formData.gradoAcademico}
                            onChange={(e) => setFormData({...formData, gradoAcademico: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        >
                            <option value="">Seleccionar grado</option>
                            {GRADOS_ACADEMICOS.map(grado => (
                                <option key={grado.value} value={grado.value}>
                                    {grado.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Fecha de Contratación */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Fecha de Contratación *
                        </label>
                        <input
                            type="date"
                            value={formData.fechaContratacion}
                            onChange={(e) => setFormData({...formData, fechaContratacion: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {/* Estado Laboral */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Estado Laboral *
                        </label>
                        <select
                            value={formData.estadoLaboral}
                            onChange={(e) => setFormData({...formData, estadoLaboral: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        >
                            <option value="">Seleccionar estado</option>
                            {ESTADOS_LABORALES.map(estado => (
                                <option key={estado.value} value={estado.value}>
                                    {estado.label}
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
                            value={formData.idEspecialidad}
                            onChange={(e) => setFormData({...formData, idEspecialidad: Number(e.target.value)})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        >
                            <option value={0}>Seleccionar especialidad</option>
                            {especialidades.map(especialidad => (
                                <option key={especialidad.idEspecialidad} value={especialidad.idEspecialidad}>
                                    {especialidad.nombreEspecialidad}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                            disabled={loading}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors disabled:opacity-50"
                            disabled={loading}
                        >
                            {loading ? 'Guardando...' : (initialData?.idDocente ? 'Actualizar' : 'Crear')}
                        </button>
                    </div>
                </form>
        </Modal>
    );
};

export default DocenteForm;