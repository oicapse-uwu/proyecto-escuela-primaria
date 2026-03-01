import { Building2, Calendar, CreditCard, Search, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import type { Institucion } from '../../instituciones/types';
import type { CicloFacturacion, EstadoSuscripcion, MetodoPago, Plan, Suscripcion, SuscripcionFormData } from '../types';

interface SuscripcionFormProps {
    suscripcionEditar?: Suscripcion | null;
    instituciones: Institucion[];
    planes: Plan[];
    estadosSuscripcion: EstadoSuscripcion[];
    ciclosFacturacion: CicloFacturacion[];
    metodosPago: MetodoPago[];
    onSubmit: (data: SuscripcionFormData) => Promise<void>;
    onCancel: () => void;
}

const SuscripcionForm: React.FC<SuscripcionFormProps> = ({ 
    suscripcionEditar, 
    instituciones,
    planes,
    estadosSuscripcion,
    ciclosFacturacion,
    metodosPago,
    onSubmit, 
    onCancel 
}) => {
    const [formData, setFormData] = useState<SuscripcionFormData>({
        limiteAlumnosContratado: 0,
        limiteSedesContratadas: 1,
        precioAcordado: 0,
        fechaInicio: '',
        fechaVencimiento: '',
        idInstitucion: 0,
        idPlan: 0,
        idCiclo: 0,
        idEstado: 1,
        idMetodoPago: 0
    });

    const [planSeleccionado, setPlanSeleccionado] = useState<Plan | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchInstitucion, setSearchInstitucion] = useState('');
    const [showInstitucionDropdown, setShowInstitucionDropdown] = useState(false);

    // Normalizar texto para búsqueda
    const normalizeText = (value?: string | number | null) =>
        String(value ?? '')
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');

    // Filtrar instituciones por búsqueda
    const institucionesFiltradas = instituciones.filter(inst => {
        const search = normalizeText(searchInstitucion.trim());
        if (!search) return true;
        
        return (
            normalizeText(inst.nombre).includes(search) ||
            normalizeText(inst.codModular).includes(search)
        );
    });

    useEffect(() => {
        if (suscripcionEditar) {
            setFormData({
                limiteAlumnosContratado: suscripcionEditar.limiteAlumnosContratado || 0,
                limiteSedesContratadas: suscripcionEditar.limiteSedesContratadas || 1,
                precioAcordado: suscripcionEditar.precioAcordado ? parseFloat(suscripcionEditar.precioAcordado.toString()) : 0,
                fechaInicio: suscripcionEditar.fechaInicio || '',
                fechaVencimiento: suscripcionEditar.fechaVencimiento || '',
                idInstitucion: suscripcionEditar.idInstitucion?.idInstitucion || 0,
                idPlan: suscripcionEditar.idPlan?.idPlan || 0,
                idCiclo: suscripcionEditar.idCiclo?.idCiclo || 0,
                idEstado: suscripcionEditar.idEstado?.idEstado || 1,
                idMetodoPago: 0
            });
            
            const plan = suscripcionEditar.idPlan ? planes.find(p => p.idPlan === suscripcionEditar.idPlan?.idPlan) : null;
            setPlanSeleccionado(plan || null);
            
            // Restaurar nombre de institución
            if (suscripcionEditar.idInstitucion) {
                const inst = instituciones.find(i => i.idInstitucion === suscripcionEditar.idInstitucion?.idInstitucion);
                if (inst) {
                    setSearchInstitucion(`${inst.nombre} - ${inst.codModular}`);
                }
            }
        }
    }, [suscripcionEditar, planes, instituciones]);

    const handleSelectInstitucion = (inst: Institucion) => {
        setFormData(prev => ({ ...prev, idInstitucion: inst.idInstitucion }));
        setSearchInstitucion(`${inst.nombre} - ${inst.codModular}`);
        setShowInstitucionDropdown(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        
        // Para campos numéricos
        if (['limiteAlumnosContratado', 'limiteSedesContratadas', 'precioAcordado', 'idInstitucion', 'idPlan', 'idCiclo', 'idEstado', 'idMetodoPago'].includes(name)) {
            const numValue = Number(value);
            setFormData(prev => ({ ...prev, [name]: numValue }));
            
            // Si se selecciona un plan, auto-llenar los límites y precio
            if (name === 'idPlan' && numValue > 0) {
                const plan = planes.find(p => p.idPlan === numValue);
                if (plan) {
                    setPlanSeleccionado(plan);
                    setFormData(prev => ({
                        ...prev,
                        limiteAlumnosContratado: plan.limiteAlumnos || 0,
                        limiteSedesContratadas: plan.limiteSedes || 1,
                        precioAcordado: plan.precioAnual || 0
                    }));
                }
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
        if (formData.idMetodoPago === 0) {
            alert('Debe seleccionar un método de pago');
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
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="bg-primary text-white px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <CreditCard className="w-6 h-6" />
                        <h2 className="text-xl font-bold">
                            {suscripcionEditar ? 'Editar Suscripción' : 'Nueva Suscripción'}
                        </h2>
                    </div>
                    <button
                        onClick={onCancel}
                        className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form Content */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
                    <div className="space-y-6">
                        {/* Sección: Información Básica */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                                <Building2 className="w-5 h-5" />
                                <span>Información Básica</span>
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Institución con búsqueda */}
                                <div className="md:col-span-2 relative">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Institución *
                                    </label>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none z-10" />
                                        <input
                                            type="text"
                                            value={searchInstitucion}
                                            onChange={(e) => {
                                                setSearchInstitucion(e.target.value);
                                                setShowInstitucionDropdown(true);
                                            }}
                                            onFocus={() => setShowInstitucionDropdown(true)}
                                            placeholder="Buscar por nombre o código modular..."
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                            required={formData.idInstitucion === 0}
                                        />
                                    </div>
                                    
                                    {/* Dropdown de instituciones */}
                                    {showInstitucionDropdown && (
                                        <>
                                            <div 
                                                className="fixed inset-0 z-10" 
                                                onClick={() => setShowInstitucionDropdown(false)}
                                            />
                                            <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                                {institucionesFiltradas.length === 0 ? (
                                                    <div className="px-4 py-3 text-sm text-gray-500 text-center">
                                                        No se encontraron instituciones
                                                    </div>
                                                ) : (
                                                    institucionesFiltradas.map(inst => (
                                                        <button
                                                            key={inst.idInstitucion}
                                                            type="button"
                                                            onClick={() => handleSelectInstitucion(inst)}
                                                            className={`w-full text-left px-4 py-2 hover:bg-primary/10 transition-colors ${
                                                                formData.idInstitucion === inst.idInstitucion ? 'bg-primary/20' : ''
                                                            }`}
                                                        >
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {inst.nombre}
                                                            </div>
                                                            <div className="text-xs text-gray-500">
                                                                {inst.codModular}
                                                            </div>
                                                        </button>
                                                    ))
                                                )}
                                            </div>
                                        </>
                                    )}
                                    
                                    {formData.idInstitucion === 0 && searchInstitucion && (
                                        <p className="text-xs text-red-500 mt-1">
                                            Seleccione una institución de la lista
                                        </p>
                                    )}
                                </div>

                                {/* Plan */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Plan *
                                    </label>
                                    <select
                                        name="idPlan"
                                        value={formData.idPlan}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                    >
                                        <option value={0}>Seleccione un plan</option>
                                        {planes.map(plan => (
                                            <option key={plan.idPlan} value={plan.idPlan}>
                                                {plan.nombrePlan}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Estado */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Estado *
                                    </label>
                                    <select
                                        name="idEstado"
                                        value={formData.idEstado}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                    >
                                        {estadosSuscripcion.map(estado => (
                                            <option key={estado.idEstado} value={estado.idEstado}>
                                                {estado.nombre}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Método de Pago *
                                    </label>
                                    <select
                                        name="idMetodoPago"
                                        value={formData.idMetodoPago}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                    >
                                        <option value={0}>Seleccione método de pago</option>
                                        {metodosPago.map(metodo => (
                                            <option key={metodo.idMetodo} value={metodo.idMetodo}>
                                                {metodo.nombreMetodo}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Sección: Límites y Precios */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Límites y Precios</h3>
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
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
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
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
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
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                    />
                                    {planSeleccionado && (
                                        <p className="text-xs text-gray-500 mt-1">
                                            Precio anual: S/ {planSeleccionado.precioAnual}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Sección: Fechas y Ciclo */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                                <Calendar className="w-5 h-5" />
                                <span>Fechas y Ciclo</span>
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
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
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
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
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
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Nota informativa */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
                            <p><strong>Nota:</strong> Los límites y precios pueden personalizarse según el acuerdo con la institución.</p>
                        </div>
                    </div>
                </form>

                {/* Footer Buttons */}
                <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t border-gray-200">
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
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? 'Guardando...' : (suscripcionEditar ? 'Actualizar Suscripción' : 'Crear Suscripción')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SuscripcionForm;
