import { CreditCard, Settings, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import SearchableSelect from '../../../../components/common/SearchableSelect';
import type { Institucion } from '../../instituciones/types';
import type { CicloFacturacion, EstadoSuscripcion, Plan, Suscripcion, SuscripcionFormData } from '../types';
import DistribucionLimitesModal from './DistribucionLimitesModal';

interface SuscripcionFormProps {
    suscripcionEditar?: Suscripcion | null;
    instituciones: Institucion[];
    planes: Plan[];
    estadosSuscripcion: EstadoSuscripcion[];
    ciclosFacturacion: CicloFacturacion[];
    onSubmit: (data: SuscripcionFormData) => Promise<void>;
    onCancel: () => void;
}

const SuscripcionForm: React.FC<SuscripcionFormProps> = ({ 
    suscripcionEditar, 
    instituciones,
    planes,
    estadosSuscripcion,
    ciclosFacturacion,
    onSubmit, 
    onCancel 
}) => {
    const [formData, setFormData] = useState<SuscripcionFormData>({
        limiteAlumnosContratado: 0,
        limiteSedesContratadas: 1,
        tipoDistribucionLimite: 'EQUITATIVA',
        precioAcordado: 0,
        fechaInicio: '',
        fechaVencimiento: '',
        idInstitucion: 0,
        idPlan: 0,
        idCiclo: 0,
        idEstado: 1 // El estado ahora es AUTOMÁTICO (gestionado por backend según pagos y fechas)
    });

    /* 
     * LÓGICA DE ESTADO AUTOMÁTICO (implementar en backend):
     * - ACTIVA (1): Suscripción recién creada y con pago confirmado
     * - SUSPENDIDA (2): Suscripción creada pero sin pago confirmado aún
     * - VENCIDA (3): Suscripción activa que dejó de pagar después de tiempo
     * - CANCELADA (4): Suscripción cancelada manualmente por el usuario
     * 
     * El estado NO debe ser editable desde el formulario, se actualiza automáticamente
     * según el estado de pagos y las fechas de vencimiento.
     */

    const [planSeleccionado, setPlanSeleccionado] = useState<Plan | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showDistribucionModal, setShowDistribucionModal] = useState(false);
    
    // Helper para determinar si un plan es personalizado
    const esPlanPersonalizado = (plan: Plan | null): boolean => {
        return plan !== null && plan.limiteAlumnos === null && plan.limiteSedes === null;
    };
    
    // Helper para obtener el precio según el ciclo
    const obtenerPrecioPorCiclo = (plan: Plan, idCiclo: number): number => {
        const ciclo = ciclosFacturacion.find(c => c.idCiclo === idCiclo);
        if (!ciclo) return 0;
        
        // Si es mensual (típicamente ciclo con 1 mes de duración)
        if (ciclo.mesesDuracion === 1) {
            return plan.precioMensual || 0;
        }
        // Si es anual (típicamente 12 meses)
        return plan.precioAnual || 0;
    };

    // Helper para obtener el badge del estado
    const getEstadoBadge = (idEstado: number): string => {
        switch(idEstado) {
            case 1: return 'bg-green-100 text-green-800 border border-green-200';
            case 2: return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
            case 3: return 'bg-red-100 text-red-800 border border-red-200';
            case 4: return 'bg-gray-100 text-gray-800 border border-gray-200';
            default: return 'bg-gray-100 text-gray-800 border border-gray-200';
        }
    };

    useEffect(() => {
        if (suscripcionEditar) {
            setFormData({
                limiteAlumnosContratado: suscripcionEditar.limiteAlumnosContratado || 0,
                limiteSedesContratadas: suscripcionEditar.limiteSedesContratadas || 1,
                tipoDistribucionLimite: suscripcionEditar.tipoDistribucionLimite || 'EQUITATIVA',
                precioAcordado: suscripcionEditar.precioAcordado ? parseFloat(suscripcionEditar.precioAcordado.toString()) : 0,
                fechaInicio: suscripcionEditar.fechaInicio || '',
                fechaVencimiento: suscripcionEditar.fechaVencimiento || '',
                idInstitucion: suscripcionEditar.idInstitucion?.idInstitucion || 0,
                idPlan: suscripcionEditar.idPlan?.idPlan || 0,
                idCiclo: suscripcionEditar.idCiclo?.idCiclo || 0,
                idEstado: suscripcionEditar.idEstado?.idEstado || 1
            });
            
            const plan = suscripcionEditar.idPlan ? planes.find(p => p.idPlan === suscripcionEditar.idPlan?.idPlan) : null;
            setPlanSeleccionado(plan || null);
        }
    }, [suscripcionEditar, planes, instituciones]);

    // Mostrar notificación cuando se selecciona un plan personalizado
    useEffect(() => {
        if (planSeleccionado && esPlanPersonalizado(planSeleccionado)) {
            toast.info('Plan Personalizado: Puedes definir límites y precios según el acuerdo con la institución.', {
                duration: 5000,
            });
        }
    }, [planSeleccionado]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        
        // Para campos numéricos
        if (['limiteAlumnosContratado', 'limiteSedesContratadas', 'precioAcordado', 'idInstitucion', 'idPlan', 'idCiclo', 'idEstado'].includes(name)) {
            const numValue = Number(value);
            setFormData(prev => ({ ...prev, [name]: numValue }));
            
            // Si se selecciona un plan, auto-llenar los límites y precio
            if (name === 'idPlan' && numValue > 0) {
                const plan = planes.find(p => p.idPlan === numValue);
                if (plan) {
                    setPlanSeleccionado(plan);
                    
                    // Si es plan personalizado, no pre-llenar nada
                    if (esPlanPersonalizado(plan)) {
                        setFormData(prev => ({
                            ...prev,
                            limiteAlumnosContratado: 0,
                            limiteSedesContratadas: 1,
                            precioAcordado: 0
                        }));
                    } else {
                        // Si no es personalizado, usar valores del plan y precio según ciclo
                        const precio = formData.idCiclo > 0 ? obtenerPrecioPorCiclo(plan, formData.idCiclo) : plan.precioAnual;
                        setFormData(prev => ({
                            ...prev,
                            limiteAlumnosContratado: plan.limiteAlumnos || 0,
                            limiteSedesContratadas: plan.limiteSedes || 1,
                            precioAcordado: precio
                        }));
                    }
                }
            }
            
            // Si se cambia el ciclo de facturación, actualizar el precio
            if (name === 'idCiclo' && numValue > 0 && planSeleccionado && !esPlanPersonalizado(planSeleccionado)) {
                const precio = obtenerPrecioPorCiclo(planSeleccionado, numValue);
                setFormData(prev => ({
                    ...prev,
                    idCiclo: numValue,
                    precioAcordado: precio
                }));
                return; // Ya actualizamos formData
            }
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validaciones
        if (formData.idInstitucion === 0) {
            alert('Debe seleccionar una institución');
            return;
        }
        if (formData.idPlan === 0) {
            alert('Debe seleccionar un plan');
            return;
        }
        if (formData.idCiclo === 0) {
            alert('Debe seleccionar un ciclo de facturación');
            return;
        }

        
        setIsSubmitting(true);
        try {
            await onSubmit(formData);
            onCancel();
        } catch (error) {
            console.error('Error al enviar formulario:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full overflow-hidden flex flex-col">
                {/* Header */}
                <div className="bg-gradient-to-r from-[#1e3a8a] to-[#1e1b4b] p-6 text-white flex justify-between items-center">
                    <h2 className="text-2xl font-bold flex items-center space-x-2">
                        <CreditCard className="w-6 h-6" />
                        <span>{suscripcionEditar ? 'Editar Suscripción' : 'Nueva Suscripción'}</span>
                    </h2>
                    <button
                        onClick={onCancel}
                        className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                        disabled={isSubmitting}
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex flex-col">
                    {/* Form Content */}
                    <div className="p-6 max-h-[500px] overflow-y-auto">
                        <div className="space-y-6">
                                {/* Institución y Plan en la misma fila */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Institución */}
                                    <div>
                                        <SearchableSelect
                                            value={formData.idInstitucion}
                                            onChange={(value) => setFormData(prev => ({ ...prev, idInstitucion: Number(value) }))}
                                            options={instituciones}
                                            getOptionId={(inst) => inst.idInstitucion}
                                            getOptionLabel={(inst) => inst.nombre}
                                            getOptionSubtext={(inst) => inst.codModular}
                                            label="Institución"
                                            placeholder="Buscar por nombre o código modular..."
                                            required
                                            emptyMessage="No se encontraron instituciones"
                                        />
                                    </div>

                                    {/* Plan */}
                                    <div>
                                    <SearchableSelect
                                        value={formData.idPlan}
                                        onChange={(value) => {
                                            const numValue = Number(value);
                                            setFormData(prev => ({ ...prev, idPlan: numValue }));
                                            if (numValue > 0) {
                                                const plan = planes.find(p => p.idPlan === numValue);
                                                if (plan) {
                                                    setPlanSeleccionado(plan);
                                                    
                                                    // Si es plan personalizado, no pre-llenar nada
                                                    if (esPlanPersonalizado(plan)) {
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            idPlan: numValue,
                                                            limiteAlumnosContratado: 0,
                                                            limiteSedesContratadas: 1,
                                                            precioAcordado: 0
                                                        }));
                                                    } else {
                                                        // Si no es personalizado, usar valores del plan
                                                        const precio = formData.idCiclo > 0 ? obtenerPrecioPorCiclo(plan, formData.idCiclo) : plan.precioAnual;
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            idPlan: numValue,
                                                            limiteAlumnosContratado: plan.limiteAlumnos || 0,
                                                            limiteSedesContratadas: plan.limiteSedes || 1,
                                                            precioAcordado: precio
                                                        }));
                                                    }
                                                }
                                            } else {
                                                setPlanSeleccionado(null);
                                            }
                                        }}
                                        options={planes}
                                        getOptionId={(plan) => plan.idPlan}
                                        getOptionLabel={(plan) => plan.nombrePlan}
                                        label="Plan"
                                        placeholder="Buscar plan..."
                                        required
                                        emptyMessage="No se encontraron planes"
                                    />
                                    </div>
                                </div>

                                {/* Estado Actual (Solo lectura en edición) */}
                                {suscripcionEditar && (
                                    <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                                        <label className="block text-xs font-medium text-indigo-700 mb-2">
                                            Estado Actual (Automático)
                                        </label>
                                        <div className="flex items-center gap-3">
                                            <span className={`px-3 py-1.5 rounded-full text-sm font-semibold ${getEstadoBadge(formData.idEstado)}`}>
                                                {estadosSuscripcion.find(e => e.idEstado === formData.idEstado)?.nombre || 'N/A'}
                                            </span>
                                            <span className="text-xs text-indigo-600">
                                                ℹ️ El estado se actualiza automáticamente según pagos y fechas
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* Sección: Fechas y Ciclo */}
                                <div className="border-t border-gray-200 pt-6">
                                    <h3 className="text-sm font-semibold text-indigo-700 mb-4 flex items-center gap-2">
                                        <CreditCard className="w-4 h-4" />
                                        Fechas y Ciclo de Facturación
                                    </h3>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {/* Ciclo de Facturación */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Ciclo de Facturación *
                                            </label>
                                            <select
                                                name="idCiclo"
                                                value={formData.idCiclo}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                            >
                                                <option value={0}>Seleccione ciclo</option>
                                                {ciclosFacturacion.map(ciclo => (
                                                    <option key={ciclo.idCiclo} value={ciclo.idCiclo}>
                                                        {ciclo.nombre}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Fecha de Inicio */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Fecha de Inicio *
                                            </label>
                                            <input
                                                type="date"
                                                name="fechaInicio"
                                                value={formData.fechaInicio}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                            />
                                        </div>

                                        {/* Fecha de Vencimiento */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Fecha de Vencimiento *
                                            </label>
                                            <input
                                                type="date"
                                                name="fechaVencimiento"
                                                value={formData.fechaVencimiento}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Sección: Límites y Precios */}
                                <div className="border-t border-gray-200 pt-6">
                                    <h3 className="text-sm font-semibold text-indigo-700 mb-4 flex items-center gap-2">
                                        <Settings className="w-4 h-4" />
                                        Límites y Precios
                                    </h3>
                                    
                                    {/* Botón de distribución por sede */}
                                    {suscripcionEditar && formData.idInstitucion > 0 && (
                                        <div className="mb-4">
                                            <button
                                                type="button"
                                                onClick={() => setShowDistribucionModal(true)}
                                                className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 border border-blue-300 rounded-lg hover:bg-blue-100 transition-colors text-sm"
                                            >
                                                <Settings className="w-4 h-4" />
                                                <span className="font-medium">Distribución por Sede</span>
                                            </button>
                                        </div>
                                    )}
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {/* Límite de Alumnos */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Límite de Alumnos *
                                        </label>
                                        <input
                                            type="number"
                                            name="limiteAlumnosContratado"
                                            value={formData.limiteAlumnosContratado}
                                            onChange={handleChange}
                                            required
                                            min="0"
                                            disabled={planSeleccionado !== null && !esPlanPersonalizado(planSeleccionado) && planSeleccionado.limiteAlumnos !== null}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                                        />
                                        {planSeleccionado?.limiteAlumnos && (
                                            <p className="text-xs text-gray-500 mt-1">
                                                Plan base: {planSeleccionado.limiteAlumnos}
                                            </p>
                                        )}
                                    </div>

                                    {/* Límite de Sedes */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Límite de Sedes *
                                        </label>
                                        <input
                                            type="number"
                                            name="limiteSedesContratadas"
                                            value={formData.limiteSedesContratadas}
                                            onChange={handleChange}
                                            required
                                            min="1"
                                            disabled={planSeleccionado !== null && !esPlanPersonalizado(planSeleccionado) && planSeleccionado.limiteSedes !== null}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                                        />
                                        {planSeleccionado?.limiteSedes && (
                                            <p className="text-xs text-gray-500 mt-1">
                                                Plan base: {planSeleccionado.limiteSedes}
                                            </p>
                                        )}
                                    </div>

                                    {/* Precio Acordado */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Precio Acordado (S/) *
                                        </label>
                                        <input
                                            type="number"
                                            name="precioAcordado"
                                            value={formData.precioAcordado}
                                            onChange={handleChange}
                                            required
                                            min="0"
                                            step="0.01"
                                            disabled={planSeleccionado !== null && !esPlanPersonalizado(planSeleccionado)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                                        />
                                        {formData.precioAcordado > 0 && formData.idCiclo > 0 && (
                                            <p className="text-xs text-indigo-600 mt-1 font-medium">
                                                {ciclosFacturacion.find(c => c.idCiclo === formData.idCiclo)?.mesesDuracion === 1
                                                    ? '💳 Pago Mensual'
                                                    : '📅 Pago Anual'
                                                }
                                            </p>
                                        )}
                                        {planSeleccionado && !esPlanPersonalizado(planSeleccionado) && (
                                            <p className="text-xs text-gray-500 mt-1">
                                                Precio del plan: S/ {formData.idCiclo > 0 && ciclosFacturacion.find(c => c.idCiclo === formData.idCiclo)?.mesesDuracion === 1
                                                    ? planSeleccionado.precioMensual
                                                    : planSeleccionado.precioAnual
                                                }
                                            </p>
                                        )}
                                    </div>
                                </div>
                                </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                            disabled={isSubmitting}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Guardando...' : (suscripcionEditar ? 'Actualizar Suscripción' : 'Crear Suscripción')}
                        </button>
                    </div>
                </form>
            </div>

            {/* Modal de Distribución de Límites */}
            {showDistribucionModal && suscripcionEditar && (
                <DistribucionLimitesModal
                    idSuscripcion={suscripcionEditar.idSuscripcion}
                    idInstitucion={formData.idInstitucion}
                    limiteTotal={formData.limiteAlumnosContratado}
                    tipoDistribucion={formData.tipoDistribucionLimite as 'EQUITATIVA' | 'PERSONALIZADA'}
                    onClose={() => setShowDistribucionModal(false)}
                    onSuccess={() => {
                        // Actualizar si es necesario
                    }}
                />
            )}
        </div>
    );
};

export default SuscripcionForm;
