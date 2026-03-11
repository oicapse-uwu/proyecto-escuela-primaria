import React, { useEffect } from 'react';
import Modal from '../../../../../components/common/Modal';
import type { AsignacionDocente, Aula, HorarioFormData } from '../types';

interface HorarioFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: HorarioFormData) => Promise<void>;
    initialData?: HorarioFormData;
    asignacionesDocente: AsignacionDocente[];
    aulas: Aula[];
    loading?: boolean;
}

const DIAS_SEMANA = [
    { value: 'LUNES', label: 'Lunes' },
    { value: 'MARTES', label: 'Martes' },
    { value: 'MIERCOLES', label: 'Miércoles' },
    { value: 'JUEVES', label: 'Jueves' },
    { value: 'VIERNES', label: 'Viernes' },
    { value: 'SABADO', label: 'Sábado' },
    { value: 'DOMINGO', label: 'Domingo' }
];

const HorarioForm: React.FC<HorarioFormProps> = ({
    isOpen,
    onClose,
    onSubmit,
    initialData,
    asignacionesDocente,
    aulas,
    loading = false
}) => {
    const [formData, setFormData] = React.useState<HorarioFormData>({
        diaSemana: '',
        horaInicio: '',
        horaFin: '',
        idAsignacion: 0,
        idAula: 0
    });

    // Cargar datos iniciales cuando se edita
    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData({
                diaSemana: '',
                horaInicio: '',
                horaFin: '',
                idAsignacion: 0,
                idAula: 0
            });
        }
    }, [initialData, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.diaSemana || !formData.horaInicio || !formData.horaFin || !formData.idAsignacion || !formData.idAula) {
            alert('Todos los campos son obligatorios');
            return;
        }

        // Validar que hora fin sea mayor que hora inicio
        if (formData.horaInicio >= formData.horaFin) {
            alert('La hora de fin debe ser mayor que la hora de inicio');
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
            diaSemana: '',
            horaInicio: '',
            horaFin: '',
            idAsignacion: 0,
            idAula: 0
        });
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title={initialData?.idHorario ? 'Editar Horario' : 'Nuevo Horario'}
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Día de la semana */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Día de la Semana *
                    </label>
                    <select
                        value={formData.diaSemana}
                        onChange={(e) => setFormData({...formData, diaSemana: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    >
                        <option value="">Seleccionar día</option>
                        {DIAS_SEMANA.map(dia => (
                            <option key={dia.value} value={dia.value}>
                                {dia.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Hora inicio */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Hora de Inicio *
                    </label>
                    <input
                        type="time"
                        value={formData.horaInicio}
                        onChange={(e) => setFormData({...formData, horaInicio: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                {/* Hora fin */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Hora de Fin *
                    </label>
                    <input
                        type="time"
                        value={formData.horaFin}
                        onChange={(e) => setFormData({...formData, horaFin: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                {/* Asignación docente */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Asignación Docente *
                    </label>
                    <select
                        value={formData.idAsignacion}
                        onChange={(e) => setFormData({...formData, idAsignacion: Number(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    >
                        <option value={0}>Seleccionar asignación</option>
                        {asignacionesDocente.map(asignacion => (
                            <option key={asignacion.idAsignacion} value={asignacion.idAsignacion}>
                                {asignacion.idDocente.idUsuario.nombreUsuario} - {asignacion.idCurso.nombreCurso} - {asignacion.idSeccion.nombreSeccion}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Aula */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Aula *
                    </label>
                    <select
                        value={formData.idAula}
                        onChange={(e) => setFormData({...formData, idAula: Number(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    >
                        <option value={0}>Seleccionar aula</option>
                        {aulas.map(aula => (
                            <option key={aula.idAula} value={aula.idAula}>
                                {aula.nombreAula}
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
                        {loading ? 'Guardando...' : (initialData?.idHorario ? 'Actualizar' : 'Crear')}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default HorarioForm;