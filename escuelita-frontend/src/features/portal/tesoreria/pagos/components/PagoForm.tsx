import { AlertCircle, Check, CheckCircle, CreditCard, DollarSign, FileText, Loader2, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import Button from '../../../../../components/ui/Button';
import { api, API_ENDPOINTS } from '../../../../../config/api.config';
import type { PagoFormData } from '../types';

interface MetodoPago { idMetodo: number; nombreMetodo: string; }
interface DeudaAlumno {
    idDeuda: number;
    descripcionCuota: string;
    montoTotal: number;
    estadoDeuda: string;
    idMatricula?: { idMatricula: number; codigoMatricula?: string; idAlumno?: { nombres: string; apellidos: string } } | null;
}
interface MatriculaOpt {
    idMatricula: number;
    codigoMatricula: string;
    estadoMatricula: string;
    idAlumno?: { nombres: string; apellidos: string } | null;
}

interface PagoFormProps {
    onSubmit: (data: PagoFormData) => Promise<void>;
    onCancel: () => void;
    isLoading?: boolean;
}

const PagoForm: React.FC<PagoFormProps> = ({ onSubmit, onCancel, isLoading = false }) => {
    const [metodosPago, setMetodosPago] = useState<MetodoPago[]>([]);
    const [matriculas, setMatriculas] = useState<MatriculaOpt[]>([]);
    const [deudas, setDeudas] = useState<DeudaAlumno[]>([]);
    const [loadingDeudas, setLoadingDeudas] = useState(false);
    const [selectedMatricula, setSelectedMatricula] = useState<number>(0);
    const [selectedDeudas, setSelectedDeudas] = useState<Set<number>>(new Set());

    const [formData, setFormData] = useState<PagoFormData>({
        montoTotalPagado: 0,
        comprobanteNumero: '',
        observacionPago: '',
        idMetodo: 0,
        detalles: []
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Cargar métodos de pago y matrículas al montar
    useEffect(() => {
        Promise.all([
            api.get<MetodoPago[]>(API_ENDPOINTS.METODOS_PAGO),
            api.get<MatriculaOpt[]>(API_ENDPOINTS.MATRICULAS),
        ]).then(([metRes, matRes]) => {
            setMetodosPago(metRes.data || []);
            // Solo mostrar matrículas pendientes de pago
            const pendientes = (matRes.data || []).filter(m => m.estadoMatricula === 'Pendiente_Pago');
            setMatriculas(pendientes);
        }).catch(() => toast.error('Error al cargar datos del formulario'));
    }, []);

    // Cargar deudas cuando cambia la matrícula seleccionada
    useEffect(() => {
        if (!selectedMatricula) { setDeudas([]); setSelectedDeudas(new Set()); return; }
        setLoadingDeudas(true);
        api.get<DeudaAlumno[]>(`${API_ENDPOINTS.DEUDAS_ALUMNO}/matricula/${selectedMatricula}`)
            .then(res => {
                const pendientes = (res.data || []).filter(d => d.estadoDeuda === 'Pendiente');
                setDeudas(pendientes);
                // Auto-seleccionar todas las deudas pendientes
                const ids = new Set(pendientes.map(d => d.idDeuda));
                setSelectedDeudas(ids);
                const total = pendientes.reduce((s, d) => s + Number(d.montoTotal), 0);
                setFormData(prev => ({
                    ...prev,
                    montoTotalPagado: total,
                    detalles: pendientes.map(d => ({ idDeuda: d.idDeuda, montoAplicado: Number(d.montoTotal) }))
                }));
            })
            .catch(() => toast.error('Error al cargar deudas de la matrícula'))
            .finally(() => setLoadingDeudas(false));
    }, [selectedMatricula]);

    const handleToggleDeuda = (deuda: DeudaAlumno) => {
        setSelectedDeudas(prev => {
            const next = new Set(prev);
            if (next.has(deuda.idDeuda)) {
                next.delete(deuda.idDeuda);
            } else {
                next.add(deuda.idDeuda);
            }
            const nuevosDetalles = deudas
                .filter(d => next.has(d.idDeuda))
                .map(d => ({ idDeuda: d.idDeuda, montoAplicado: Number(d.montoTotal) }));
            const nuevoTotal = nuevosDetalles.reduce((s, d) => s + d.montoAplicado, 0);
            setFormData(fp => ({ ...fp, detalles: nuevosDetalles, montoTotalPagado: nuevoTotal }));
            return next;
        });
    };

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};
        if (!selectedMatricula) newErrors.matricula = 'Debe seleccionar una matrícula';
        if (formData.idMetodo === 0) newErrors.idMetodo = 'Debe seleccionar un método de pago';
        if (formData.detalles.length === 0) newErrors.detalles = 'Debe seleccionar al menos una deuda';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const parsedValue = name === 'idMetodo' ? parseInt(value) : value;
        setFormData(prev => ({ ...prev, [name]: parsedValue }));
        if (errors[name]) setErrors(prev => { const n = { ...prev }; delete n[name]; return n; });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;
        setIsSubmitting(true);
        try {
            await onSubmit(formData);
        } catch (error) {
            console.error('Error al guardar:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const alumnoLabel = (m: MatriculaOpt) => {
        const nombre = m.idAlumno ? `${m.idAlumno.nombres} ${m.idAlumno.apellidos}` : '';
        return `${m.codigoMatricula}${nombre ? ' - ' + nombre : ''}`;
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-6 border-b-2 border-orange-200 sticky top-0">
                    <div className="flex justify-between items-start">
                        <div className="flex items-start gap-3">
                            <div className="bg-orange-600 rounded-lg p-2.5"><FileText className="w-5 h-5 text-white" /></div>
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">Registrar Pago</h2>
                                <p className="text-xs text-gray-600 mt-1">Selecciona la matrícula y las deudas a cancelar</p>
                            </div>
                        </div>
                        <button onClick={onCancel} className="p-2 hover:bg-orange-200 rounded-lg transition-all">
                            <X className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Selección de matrícula */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-2">Matrícula (Pendiente de Pago) *</label>
                        <select
                            value={selectedMatricula}
                            onChange={e => setSelectedMatricula(Number(e.target.value))}
                            className={`w-full px-4 py-2.5 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all ${errors.matricula ? 'border-red-400 focus:ring-red-300' : 'border-gray-200 focus:ring-orange-300 focus:border-orange-500'}`}
                        >
                            <option value={0}>— Seleccionar matrícula —</option>
                            {matriculas.map(m => (
                                <option key={m.idMatricula} value={m.idMatricula}>{alumnoLabel(m)}</option>
                            ))}
                        </select>
                        {errors.matricula && <p className="text-red-600 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.matricula}</p>}
                    </div>

                    {/* Deudas pendientes */}
                    {selectedMatricula > 0 && (
                        <div className="border-2 border-orange-100 rounded-lg p-4 bg-orange-50">
                            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-orange-600" />
                                Deudas Pendientes
                            </h3>
                            {loadingDeudas ? (
                                <div className="flex items-center gap-2 text-gray-500 py-4 justify-center">
                                    <Loader2 className="w-4 h-4 animate-spin" /> Cargando deudas...
                                </div>
                            ) : deudas.length === 0 ? (
                                <p className="text-gray-500 text-sm text-center py-4">No hay deudas pendientes para esta matrícula</p>
                            ) : (
                                <div className="space-y-2">
                                    {deudas.map(d => (
                                        <label key={d.idDeuda} className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${selectedDeudas.has(d.idDeuda) ? 'border-orange-400 bg-white' : 'border-gray-200 bg-gray-50'}`}>
                                            <input
                                                type="checkbox"
                                                checked={selectedDeudas.has(d.idDeuda)}
                                                onChange={() => handleToggleDeuda(d)}
                                                className="w-4 h-4 accent-orange-600"
                                            />
                                            <div className="flex-1">
                                                <p className="text-sm font-semibold text-gray-800">{d.descripcionCuota}</p>
                                            </div>
                                            <span className="text-sm font-bold text-orange-700">S/. {Number(d.montoTotal).toFixed(2)}</span>
                                        </label>
                                    ))}
                                </div>
                            )}
                            {errors.detalles && <p className="text-red-600 text-xs mt-2 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.detalles}</p>}
                        </div>
                    )}

                    {/* Método de pago + comprobante */}
                    <div className="space-y-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <div>
                            <label className="block text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
                                <CreditCard className="w-4 h-4 text-purple-600" />
                                Método de Pago *
                            </label>
                            <select
                                name="idMetodo"
                                value={formData.idMetodo}
                                onChange={handleChange}
                                className={`w-full px-4 py-2.5 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all ${errors.idMetodo ? 'border-red-400 focus:ring-red-300' : 'border-gray-200 focus:ring-purple-300 focus:border-purple-500'}`}
                            >
                                <option value={0}>— Seleccionar método —</option>
                                {metodosPago.map(m => (
                                    <option key={m.idMetodo} value={m.idMetodo}>{m.nombreMetodo}</option>
                                ))}
                            </select>
                            {errors.idMetodo && <p className="text-red-600 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.idMetodo}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
                                <DollarSign className="w-4 h-4 text-green-600" />
                                Monto Total (S/.)
                            </label>
                            <input
                                type="number"
                                name="montoTotalPagado"
                                value={formData.montoTotalPagado}
                                onChange={handleChange}
                                step="0.01" min="0"
                                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-500 bg-white font-bold text-green-700"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
                                <FileText className="w-4 h-4 text-blue-600" />
                                Número de Comprobante
                            </label>
                            <input
                                type="text"
                                name="comprobanteNumero"
                                value={formData.comprobanteNumero}
                                onChange={handleChange}
                                placeholder="Ej: REC-001-2026"
                                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500 bg-white"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-800 mb-2">Observación</label>
                            <textarea
                                name="observacionPago"
                                value={formData.observacionPago}
                                onChange={handleChange}
                                placeholder="Notas sobre el pago..."
                                rows={2}
                                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 bg-white"
                            />
                        </div>
                    </div>

                    {/* Botones */}
                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onCancel} className="flex-1 px-4 py-2.5 text-gray-700 border-2 border-gray-300 rounded-lg hover:bg-gray-100 font-semibold transition-all">
                            Cancelar
                        </button>
                        <Button
                            type="submit"
                            variant="primary"
                            disabled={isSubmitting || isLoading}
                            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg hover:shadow-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {isSubmitting || isLoading ? (
                                <><Loader2 className="w-4 h-4 animate-spin" /> Guardando...</>
                            ) : (
                                <><Check className="w-4 h-4" /> Registrar Pago</>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PagoForm;
