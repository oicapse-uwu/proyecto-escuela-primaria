import { Calendar, CheckCircle, ClipboardCheck, FileText, GraduationCap, ShieldCheck } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import SearchableSelect from '../../../../components/common/SearchableSelect';
import type { Alumno } from '../../alumnos/types';
import { consultarVacantesDisponibles } from '../api/matriculasApi';
import type { AnioEscolar, Matricula, MatriculaFormData, Seccion } from '../types';

interface MatriculaFormProps {
    matricula?: Matricula | null;
    alumnos: Alumno[];
    secciones: Seccion[];
    aniosEscolares: AnioEscolar[];
    onSubmit: (data: MatriculaFormData) => Promise<void>;
    onCancel: () => void;
    isLoading?: boolean;
}

const MatriculaForm: React.FC<MatriculaFormProps> = ({
    matricula,
    alumnos,
    secciones,
    aniosEscolares,
    onSubmit,
    onCancel,
    isLoading = false
}) => {
    const [activeTab, setActiveTab] = useState<'basicos' | 'detalles'>('basicos');
    const [vacantesDisponibles, setVacantesDisponibles] = useState<number | null>(null);
    const [cargandoVacantes, setCargandoVacantes] = useState(false);

    const [formData, setFormData] = useState<MatriculaFormData>({
        idAlumno: 0,
        idSeccion: 0,
        idAnio: 0,
        codigoMatricula: '',
        tipoIngreso: 'Nuevo',
        estadoMatricula: 'Pendiente_Pago',
        fechaMatricula: new Date().toISOString().split('T')[0],
        vacanteGarantizada: false,
        observaciones: ''
    });

    // Cargar datos del formulario si se está editando
    useEffect(() => {
        if (matricula) {
            setFormData({
                idMatricula: matricula.idMatricula,
                idAlumno: matricula.idAlumno?.idAlumno || 0,
                idSeccion: matricula.idSeccion?.idSeccion || 0,
                idAnio: matricula.idAnio?.idAnioEscolar || 0,
                codigoMatricula: matricula.codigoMatricula || '',
                tipoIngreso: matricula.tipoIngreso || 'Nuevo',
                estadoMatricula: matricula.estadoMatricula || 'Pendiente_Pago',
                fechaMatricula: matricula.fechaMatricula || new Date().toISOString().split('T')[0],
                vacanteGarantizada: matricula.vacanteGarantizada || false,
                observaciones: matricula.observaciones || ''
            });
        }
    }, [matricula]);

    // Consultar vacantes cuando cambien sección o año escolar
    useEffect(() => {
        const consultarVacantes = async () => {
            if (formData.idSeccion > 0 && formData.idAnio > 0) {
                try {
                    setCargandoVacantes(true);
                    const vacantes = await consultarVacantesDisponibles(
                        formData.idSeccion,
                        formData.idAnio
                    );
                    setVacantesDisponibles(vacantes);
                } catch (error) {
                    console.error('Error consultando vacantes:', error);
                    setVacantesDisponibles(null);
                } finally {
                    setCargandoVacantes(false);
                }
            } else {
                setVacantesDisponibles(null);
            }
        };
        consultarVacantes();
    }, [formData.idSeccion, formData.idAnio, formData.vacanteGarantizada]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validaciones
        if (!formData.idAlumno || formData.idAlumno === 0) {
            toast.error('Debe seleccionar un alumno');
            setActiveTab('basicos');
            return;
        }
        if (!formData.idSeccion || formData.idSeccion === 0) {
            toast.error('Debe seleccionar una sección');
            setActiveTab('basicos');
            return;
        }
        if (!formData.idAnio || formData.idAnio === 0) {
            toast.error('Debe seleccionar un año escolar');
            setActiveTab('basicos');
            return;
        }
        if (!formData.tipoIngreso) {
            toast.error('Debe seleccionar un tipo de ingreso');
            setActiveTab('basicos');
            return;
        }
        if (!formData.fechaMatricula) {
            toast.error('La fecha de matrícula es obligatoria');
            setActiveTab('detalles');
            return;
        }

        // Verificar vacantes disponibles
        if (!matricula && vacantesDisponibles !== null && vacantesDisponibles <= 0) {
            toast.error('No hay vacantes disponibles para esta sección');
            return;
        }

        try {
            await onSubmit(formData);
        } catch (error) {
            console.error('Error en handleSubmit:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col">
            {/* Tabs Header */}
            <div className="bg-gray-50 border-b border-gray-200 -mx-6 -mt-4 px-6 mb-5">
                <div className="flex space-x-1">
                    <button
                        type="button"
                        onClick={() => setActiveTab('basicos')}
                        className={`px-6 py-3 font-medium text-sm transition-all ${
                            activeTab === 'basicos'
                                ? 'border-b-2 border-emerald-600 text-emerald-600 bg-white'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                        }`}
                    >
                        <GraduationCap className="inline w-4 h-4 mr-2" />
                        Datos Básicos
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('detalles')}
                        className={`px-6 py-3 font-medium text-sm transition-all ${
                            activeTab === 'detalles'
                                ? 'border-b-2 border-emerald-600 text-emerald-600 bg-white'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                        }`}
                    >
                        <ClipboardCheck className="inline w-4 h-4 mr-2" />
                        Información de Matrícula
                    </button>
                </div>
            </div>

            {/* Tab Content */}
            <div className="mb-6">
                {/* Tab 1: Datos Básicos */}
                {activeTab === 'basicos' && (
                    <div className="space-y-4">
                        {/* Alumno: always in its own row */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Alumno <span className="text-red-500">*</span>
                            </label>
                            <SearchableSelect
                                value={formData.idAlumno}
                                onChange={(v) => setFormData({ ...formData, idAlumno: Number(v) })}
                                options={alumnos}
                                getOptionId={(a) => a.idAlumno}
                                getOptionLabel={(a) => `${a.nombres} ${a.apellidos}`}
                                getOptionSubtext={(a) => a.numeroDocumento}
                                placeholder="Buscar por nombre o documento..."
                                required
                                emptyMessage="No se encontraron alumnos"
                            />
                        </div>

                        {/* Row: Sección & Año Escolar */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Sección <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={formData.idSeccion}
                                    onChange={(e) =>
                                        setFormData({ ...formData, idSeccion: Number(e.target.value) })
                                    }
                                    className="w-full px-3 py-2.5 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white transition-colors"
                                    required
                                >
                                    <option value={0}>Seleccione sección...</option>
                                    {secciones.map((s) => (
                                        <option key={s.idSeccion} value={s.idSeccion}>
                                            {s.idGrado?.nombreGrado
                                                ? `${s.idGrado.nombreGrado} - ${s.nombreSeccion}`
                                                : s.nombreSeccion}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Año Escolar <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={formData.idAnio}
                                    onChange={(e) =>
                                        setFormData({ ...formData, idAnio: Number(e.target.value) })
                                    }
                                    className="w-full px-3 py-2.5 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white transition-colors"
                                    required
                                >
                                    <option value={0}>Seleccione año escolar...</option>
                                    {aniosEscolares.map((a) => (
                                        <option key={a.idAnioEscolar} value={a.idAnioEscolar}>
                                            {a.nombreAnio}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Row: Tipo de Ingreso & Código Matrícula */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tipo de Ingreso <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={formData.tipoIngreso}
                                    onChange={(e) =>
                                        setFormData({ ...formData, tipoIngreso: e.target.value as 'Nuevo' | 'Promovido' | 'Repitente' | 'Trasladado_Entrante' })
                                    }
                                    className="w-full px-3 py-2.5 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white transition-colors"
                                    required
                                >
                                    <option value="Nuevo">Nuevo</option>
                                    <option value="Promovido">Promovido</option>
                                    <option value="Repitente">Repitente</option>
                                    <option value="Trasladado_Entrante">Trasladado Entrante</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    <FileText className="inline w-4 h-4 mr-1" />
                                    Código Matrícula
                                </label>
                                <input
                                    type="text"
                                    value={formData.codigoMatricula}
                                    onChange={(e) =>
                                        setFormData({ ...formData, codigoMatricula: e.target.value })
                                    }
                                    className="w-full px-3 py-2.5 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                                    placeholder="MAT-2026-0001"
                                />
                            </div>
                        </div>

                        {/* Vacante Garantizada */}
                        <div className="flex items-center">
                            <label htmlFor="vacanteGarantizada" className="inline-flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    id="vacanteGarantizada"
                                    checked={formData.vacanteGarantizada || false}
                                    onChange={(e) =>
                                        setFormData({ ...formData, vacanteGarantizada: e.target.checked })
                                    }
                                    className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500 cursor-pointer"
                                />
                                <ShieldCheck className="inline w-4 h-4 text-gray-600" />
                                <span className="text-sm text-gray-700 hover:text-gray-900 transition-colors">
                                    ¿Promovido o repitente? (Vacante garantizada)
                                </span>
                            </label>
                        </div>
                    </div>
                )}

                {/* Tab 2: Información de Matrícula */}
                {activeTab === 'detalles' && (
                    <div className="space-y-4">
                        {/* Row: Fecha Matrícula & Estado */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    <Calendar className="inline w-4 h-4 mr-1" />
                                    Fecha Matrícula <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    value={formData.fechaMatricula}
                                    onChange={(e) =>
                                        setFormData({ ...formData, fechaMatricula: e.target.value })
                                    }
                                    className="w-full px-3 py-2.5 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    <CheckCircle className="inline w-4 h-4 mr-1" />
                                    Estado Matrícula
                                </label>
                                <input
                                    type="text"
                                    value={
                                        formData.estadoMatricula === 'Pendiente_Pago'
                                            ? 'Pendiente de Pago'
                                            : formData.estadoMatricula === 'Activa'
                                            ? 'Activa'
                                            : formData.estadoMatricula === 'Finalizada'
                                            ? 'Finalizada'
                                            : formData.estadoMatricula === 'Cancelada'
                                            ? 'Cancelada'
                                            : formData.estadoMatricula
                                    }
                                    readOnly
                                    className="w-full px-3 py-2.5 text-base border border-gray-200 bg-gray-50 text-gray-600 rounded-lg cursor-not-allowed"
                                />
                                <p className="mt-1 text-xs text-gray-500">
                                    Este estado se asigna automáticamente según el flujo de la matrícula.
                                </p>
                            </div>
                        </div>

                        {/* Indicador de Vacantes Disponibles */}
                        {formData.idSeccion > 0 && formData.idAnio > 0 && (
                            <div>
                                {cargandoVacantes ? (
                                    <div className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-emerald-600"></div>
                                        <span className="text-sm text-gray-600">
                                            Consultando vacantes disponibles...
                                        </span>
                                    </div>
                                ) : vacantesDisponibles !== null ? (
                                    <div
                                        className={`flex items-center gap-3 p-3 rounded-lg border ${
                                            vacantesDisponibles === 0
                                                ? 'bg-red-50 border-red-200 text-red-800'
                                                : vacantesDisponibles <= 5
                                                ? 'bg-yellow-50 border-yellow-200 text-yellow-800'
                                                : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                                        }`}
                                    >
                                        {vacantesDisponibles === 0 ? (
                                            <>
                                                <span className="text-xl">❌</span>
                                                <span className="text-sm font-medium">
                                                    Sin vacantes disponibles - No se puede crear matrícula
                                                </span>
                                            </>
                                        ) : vacantesDisponibles <= 5 ? (
                                            <>
                                                <span className="text-xl">⚠️</span>
                                                <span className="text-sm font-medium">
                                                    ¡Atención! Solo quedan {vacantesDisponibles}{' '}
                                                    {vacantesDisponibles === 1 ? 'vacante' : 'vacantes'} disponibles
                                                </span>
                                            </>
                                        ) : (
                                            <>
                                                <span className="text-xl">✅</span>
                                                <span className="text-sm font-medium">
                                                    {vacantesDisponibles} vacantes disponibles
                                                </span>
                                            </>
                                        )}
                                    </div>
                                ) : null}
                            </div>
                        )}

                        {/* Observaciones */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                <FileText className="inline w-4 h-4 mr-1" />
                                Observaciones
                            </label>
                            <textarea
                                value={formData.observaciones || ''}
                                onChange={(e) =>
                                    setFormData({ ...formData, observaciones: e.target.value })
                                }
                                rows={4}
                                className="w-full px-3 py-2.5 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none transition-colors"
                                placeholder="Escribe alguna observación general aquí..."
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Botones */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 px-6 pt-5 pb-4 bg-gray-50 border-t border-gray-200 -mx-6 -mb-6 mt-auto rounded-b-xl">
                <button
                    type="button"
                    onClick={onCancel}
                    className="w-full sm:w-auto px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors duration-200 font-medium order-2 sm:order-1"
                    disabled={isLoading}
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={
                        isLoading ||
                        (!matricula && vacantesDisponibles !== null && vacantesDisponibles <= 0)
                    }
                    className={`w-full sm:w-auto px-4 py-3 rounded-lg transition-all duration-200 font-medium order-1 sm:order-2 ${
                        !matricula && vacantesDisponibles !== null && vacantesDisponibles <= 0
                            ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                            : 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white hover:from-emerald-700 hover:to-emerald-800 shadow-md hover:shadow-lg'
                    }`}
                >
                    {isLoading
                        ? 'Guardando...'
                        : matricula
                        ? 'Actualizar Matrícula'
                        : 'Crear Matrícula'}
                </button>
            </div>
        </form>
    );
};

export default MatriculaForm;
