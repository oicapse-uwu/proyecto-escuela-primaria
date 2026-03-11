import { AlertCircle, BookOpen, Calendar, Check, DollarSign, FileText, Loader2, Users, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { api, API_ENDPOINTS } from '../../../../../config/api.config';
import type { DeudasAlumno, DeudasAlumnoFormData } from '../types';

interface ConceptoPago { idConcepto: number; nombreConcepto: string; monto: number; }
interface MatriculaOpt {
    idMatricula: number;
    codigoMatricula: string;
    estadoMatricula: string;
    idAlumno?: { nombres: string; apellidos: string } | null;
}

interface DeudasAlumnoFormProps {
    deuda?: DeudasAlumno | null;
    onSubmit: (data: DeudasAlumnoFormData) => Promise<void>;
    onCancel: () => void;
    isLoading?: boolean;
}

const today = () => new Date().toISOString().split('T')[0];
const in30days = () => {
    const d = new Date(); d.setDate(d.getDate() + 30); return d.toISOString().split('T')[0];
};

const DeudasAlumnoForm: React.FC<DeudasAlumnoFormProps> = ({ 
    deuda, 
    onSubmit, 
    onCancel, 
    isLoading = false 
}) => {
    const [conceptos, setConceptos] = useState<ConceptoPago[]>([]);
    const [matriculas, setMatriculas] = useState<MatriculaOpt[]>([]);
    const [loadingOpts, setLoadingOpts] = useState(true);

    const [formData, setFormData] = useState<DeudasAlumnoFormData>({
        descripcionCuota: '',
        montoTotal: 0,
        fechaEmision: today(),
        fechaVencimiento: in30days(),
        estadoDeuda: 'Pendiente',
        idConcepto: 0,
        idMatricula: 0
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Cargar conceptos y matrículas al montar
    useEffect(() => {
        Promise.all([
            api.get<ConceptoPago[]>(API_ENDPOINTS.CONCEPTOS_PAGO),
            api.get<MatriculaOpt[]>(API_ENDPOINTS.MATRICULAS),
        ]).then(([cRes, mRes]) => {
            setConceptos(cRes.data || []);
            setMatriculas(mRes.data || []);
        }).catch(() => toast.error('Error al cargar datos del formulario'))
          .finally(() => setLoadingOpts(false));
    }, []);

    useEffect(() => {
        if (deuda) {
            setFormData({
                descripcionCuota: deuda.descripcionCuota,
                montoTotal: deuda.montoTotal,
                fechaEmision: deuda.fechaEmision,
                fechaVencimiento: deuda.fechaVencimiento,
                estadoDeuda: deuda.estadoDeuda,
                idConcepto: deuda.idConcepto.idConcepto,
                idMatricula: deuda.idMatricula.idMatricula
            });
        }
    }, [deuda]);

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};
        if (!formData.descripcionCuota.trim()) newErrors.descripcionCuota = 'La descripción es requerida';
        if (formData.montoTotal <= 0) newErrors.montoTotal = 'El monto debe ser mayor a 0';
        if (!formData.fechaEmision) newErrors.fechaEmision = 'La fecha de emisión es requerida';
        if (!formData.fechaVencimiento) newErrors.fechaVencimiento = 'La fecha de vencimiento es requerida';
        if (formData.idConcepto === 0) newErrors.idConcepto = 'Debe seleccionar un concepto de pago';
        if (formData.idMatricula === 0) newErrors.idMatricula = 'Debe seleccionar una matrícula';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        let parsedValue: string | number = value;
        if (name === 'montoTotal') parsedValue = parseFloat(value) || 0;
        if (name === 'idConcepto' || name === 'idMatricula') parsedValue = parseInt(value);
        
        setFormData(prev => {
            const next = { ...prev, [name]: parsedValue };
            // Al cambiar concepto, auto-rellenar monto y descripción
            if (name === 'idConcepto') {
                const c = conceptos.find(c => c.idConcepto === parseInt(value));
                if (c) {
                    next.montoTotal = c.monto;
                    if (!prev.descripcionCuota || prev.idConcepto === 0)
                        next.descripcionCuota = c.nombreConcepto;
                }
            }
            return next;
        });
        if (errors[name]) setErrors(prev => { const n = { ...prev }; delete n[name]; return n; });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) { toast.error('Por favor, completa todos los campos correctamente'); return; }
        setIsSubmitting(true);
        try { await onSubmit(formData); }
        catch (error) { console.error('Error al guardar:', error); }
        finally { setIsSubmitting(false); }
    };

    const matriculaLabel = (m: MatriculaOpt) => {
        const alumno = m.idAlumno ? `${m.idAlumno.nombres} ${m.idAlumno.apellidos}` : '';
        return `${m.codigoMatricula}${alumno ? ' — ' + alumno : ''} [${m.estadoMatricula}]`;
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto transform transition-all">
                <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 border-b-2 border-purple-200 sticky top-0">
                    <div className="flex justify-between items-start">
                        <div className="flex items-start gap-3">
                            <div className="bg-purple-600 rounded-lg p-2.5">
                                <FileText className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">
                                    {deuda ? 'Editar Deuda' : 'Nueva Deuda'}
                                </h2>
                                <p className="text-xs text-gray-700 mt-1">
                                    {deuda ? 'Actualiza los datos de la deuda' : 'Registra una nueva deuda de alumno'}
                                </p>
                            </div>
                        </div>
                        <button onClick={onCancel} className="p-2 hover:bg-purple-200 rounded-lg transition-all duration-200">
                            <X className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>
                </div>

                {loadingOpts ? (
                    <div className="flex items-center justify-center p-12 gap-3 text-gray-500">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Cargando datos...
                    </div>
                ) : (
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Concepto + Matrícula */}
                    <div className="space-y-4 bg-purple-50 p-4 rounded-lg border border-purple-100">
                        {/* Concepto de Pago */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
                                <BookOpen className="w-4 h-4 text-yellow-600" />
                                Concepto de Pago *
                            </label>
                            <select
                                name="idConcepto"
                                value={formData.idConcepto}
                                onChange={handleChange}
                                className={`w-full px-4 py-2.5 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                                    errors.idConcepto ? 'border-red-400 focus:ring-red-300 bg-red-50' : 'border-gray-200 focus:ring-yellow-300 focus:border-yellow-500 bg-white'
                                }`}
                            >
                                <option value="0">— Seleccionar concepto —</option>
                                {conceptos.map(c => (
                                    <option key={c.idConcepto} value={c.idConcepto}>
                                        {c.nombreConcepto} — S/. {Number(c.monto).toFixed(2)}
                                    </option>
                                ))}
                            </select>
                            {errors.idConcepto && (
                                <div className="flex items-center gap-1 text-red-600 text-xs mt-2">
                                    <AlertCircle className="w-3 h-3" />{errors.idConcepto}
                                </div>
                            )}
                        </div>

                        {/* Matrícula */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
                                <Users className="w-4 h-4 text-purple-600" />
                                Matrícula *
                            </label>
                            <select
                                name="idMatricula"
                                value={formData.idMatricula}
                                onChange={handleChange}
                                className={`w-full px-4 py-2.5 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                                    errors.idMatricula ? 'border-red-400 focus:ring-red-300 bg-red-50' : 'border-gray-200 focus:ring-purple-300 focus:border-purple-500 bg-white'
                                }`}
                            >
                                <option value="0">— Seleccionar matrícula —</option>
                                {matriculas.map(m => (
                                    <option key={m.idMatricula} value={m.idMatricula}>{matriculaLabel(m)}</option>
                                ))}
                            </select>
                            {errors.idMatricula && (
                                <div className="flex items-center gap-1 text-red-600 text-xs mt-2">
                                    <AlertCircle className="w-3 h-3" />{errors.idMatricula}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sección de datos principales */}
                    <div className="space-y-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                        {/* Descripción */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
                                <FileText className="w-4 h-4 text-blue-600" />
                                Descripción de la Cuota *
                            </label>
                            <textarea
                                name="descripcionCuota"
                                value={formData.descripcionCuota}
                                onChange={handleChange}
                                placeholder="Ej: Cuota del mes de marzo..."
                                rows={2}
                                className={`w-full px-4 py-2.5 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                                    errors.descripcionCuota ? 'border-red-400 focus:ring-red-300 bg-red-50' : 'border-gray-200 focus:ring-blue-300 focus:border-blue-500 bg-white hover:border-gray-300'
                                }`}
                            />
                            {errors.descripcionCuota && (
                                <div className="flex items-center gap-1 text-red-600 text-xs mt-2">
                                    <AlertCircle className="w-3 h-3" />{errors.descripcionCuota}
                                </div>
                            )}
                        </div>

                        {/* Monto */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
                                <DollarSign className="w-4 h-4 text-green-600" />
                                Monto Total *
                            </label>
                            <input
                                type="number"
                                name="montoTotal"
                                value={formData.montoTotal}
                                onChange={handleChange}
                                placeholder="0.00"
                                step="0.01"
                                min="0"
                                className={`w-full px-4 py-2.5 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                                    errors.montoTotal ? 'border-red-400 focus:ring-red-300 bg-red-50' : 'border-gray-200 focus:ring-green-300 focus:border-green-500 bg-white hover:border-gray-300'
                                }`}
                            />
                            {errors.montoTotal && (
                                <div className="flex items-center gap-1 text-red-600 text-xs mt-2">
                                    <AlertCircle className="w-3 h-3" />{errors.montoTotal}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Fechas */}
                    <div className="space-y-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                        {/* Fecha Emisión */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-pink-600" />
                                Fecha de Emisión *
                            </label>
                            <input
                                type="date"
                                name="fechaEmision"
                                value={formData.fechaEmision}
                                onChange={handleChange}
                                className={`w-full px-4 py-2.5 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                                    errors.fechaEmision ? 'border-red-400 focus:ring-red-300 bg-red-50' : 'border-gray-200 focus:ring-pink-300 focus:border-pink-500 bg-white hover:border-gray-300'
                                }`}
                            />
                            {errors.fechaEmision && (
                                <div className="flex items-center gap-1 text-red-600 text-xs mt-2">
                                    <AlertCircle className="w-3 h-3" />{errors.fechaEmision}
                                </div>
                            )}
                        </div>

                        {/* Fecha Vencimiento */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-red-600" />
                                Fecha de Vencimiento *
                            </label>
                            <input
                                type="date"
                                name="fechaVencimiento"
                                value={formData.fechaVencimiento}
                                onChange={handleChange}
                                className={`w-full px-4 py-2.5 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                                    errors.fechaVencimiento ? 'border-red-400 focus:ring-red-300 bg-red-50' : 'border-gray-200 focus:ring-red-300 focus:border-red-500 bg-white hover:border-gray-300'
                                }`}
                            />
                            {errors.fechaVencimiento && (
                                <div className="flex items-center gap-1 text-red-600 text-xs mt-2">
                                    <AlertCircle className="w-3 h-3" />{errors.fechaVencimiento}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Estado */}
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <label className="block text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
                            <Check className="w-4 h-4 text-teal-600" />
                            Estado de la Deuda
                        </label>
                        <select
                            name="estadoDeuda"
                            value={formData.estadoDeuda}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-300 focus:border-teal-500 bg-white hover:border-gray-300 transition-all duration-200"
                        >
                            <option value="Pendiente">Pendiente</option>
                            <option value="Parcial">Parcial</option>
                            <option value="Pagado">Pagado</option>
                        </select>
                    </div>

                    {/* Botones */}
                    <div className="flex gap-3 pt-6 border-t-2 border-gray-200">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="flex-1 px-4 py-2.5 text-gray-700 border-2 border-gray-300 rounded-lg hover:bg-gray-100 hover:border-gray-400 transition-all duration-200 font-semibold"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || isLoading}
                            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:shadow-lg active:scale-95 transition-all duration-200 font-semibold flex items-center justify-center gap-2 disabled:bg-purple-400 disabled:cursor-not-allowed shadow-md"
                        >
                            {isSubmitting || isLoading ? (
                                <><div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>Guardando...</>
                            ) : (
                                <><Check className="w-4 h-4" />{deuda ? 'Actualizar' : 'Guardar'}</>
                            )}
                        </button>
                    </div>
                </form>
                )}
            </div>
        </div>
    );
};

export default DeudasAlumnoForm;
