import { CalendarRange, X } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import type { AnioEscolar, Periodo, PeriodoDTO } from '../types';

interface PeriodoFormProps {
    periodo?: Periodo | null;
    onSubmit: (data: PeriodoDTO) => Promise<void>;
    onCancel: () => void;
    isLoading?: boolean;
    aniosEscolares: AnioEscolar[];
    periodosExistentes: Periodo[];
}

const PeriodoForm: React.FC<PeriodoFormProps> = ({ 
    periodo, 
    onSubmit, 
    onCancel, 
    isLoading = false,
    aniosEscolares,
    periodosExistentes
}) => {
    const [formData, setFormData] = useState<PeriodoDTO>({
        nombrePeriodo: '',
        fechaInicio: '',
        fechaFin: '',
        idAnio: aniosEscolares.length > 0 ? aniosEscolares[0].idAnioEscolar : 0
    });
    const [errorValidacion, setErrorValidacion] = useState<string>('');
    const [tipoPeriodo, setTipoPeriodo] = useState<'BIMESTRE' | 'TRIMESTRE'>('BIMESTRE');

    // Contar períodos existentes para el año seleccionado
    const periodosDelAnio = useMemo(() => {
        if (!formData.idAnio) return 0;
        return periodosExistentes.filter(p => {
            const anioId = typeof p.idAnio === 'object' ? p.idAnio.idAnioEscolar : p.idAnio;
            // Si estamos editando, no contar el periodo actual
            if (periodo && p.idPeriodo === periodo.idPeriodo) return false;
            return anioId === formData.idAnio;
        }).length;
    }, [periodosExistentes, formData.idAnio, periodo]);

    // Obtener límite según el tipo de periodo seleccionado
    const limiteMaximo = useMemo(() => {
        return tipoPeriodo === 'TRIMESTRE' ? 3 : 4;
    }, [tipoPeriodo]);

    // Validar si se puede agregar más períodos
    const puedeAgregarPeriodo = useMemo(() => {
        if (periodo) return true; // Si está editando, siempre puede
        return periodosDelAnio < limiteMaximo;
    }, [periodo, periodosDelAnio, limiteMaximo]);

    // Obtener períodos del mismo año (excluyendo el actual si es edición)
    const periodosDelMismoAnio = useMemo(() => {
        if (!formData.idAnio) return [];
        return periodosExistentes.filter(p => {
            const anioId = typeof p.idAnio === 'object' ? p.idAnio.idAnioEscolar : p.idAnio;
            if (periodo && p.idPeriodo === periodo.idPeriodo) return false;
            return anioId === formData.idAnio;
        });
    }, [periodosExistentes, formData.idAnio, periodo]);

    // Validar solapamiento de fechas
    const validarFechas = (fechaInicio: string, fechaFin: string): string => {
        if (!fechaInicio || !fechaFin) return '';

        const inicio = new Date(fechaInicio);
        const fin = new Date(fechaFin);

        if (fin <= inicio) {
            return 'La fecha de fin debe ser posterior a la fecha de inicio.';
        }

        // Validar duración según tipo de período
        const diffMs = fin.getTime() - inicio.getTime();
        const diffDias = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

        if (tipoPeriodo === 'BIMESTRE') {
            if (diffDias > 75) {
                return `Un bimestre no puede durar más de ~2 meses (75 días). Duración actual: ${diffDias} días.`;
            }
            if (diffDias < 30) {
                return `Un bimestre debe durar al menos 1 mes (30 días). Duración actual: ${diffDias} días.`;
            }
        } else {
            if (diffDias > 105) {
                return `Un trimestre no puede durar más de ~3 meses (105 días). Duración actual: ${diffDias} días.`;
            }
            if (diffDias < 45) {
                return `Un trimestre debe durar al menos 1.5 meses (45 días). Duración actual: ${diffDias} días.`;
            }
        }

        // Validar solapamiento con otros períodos del mismo año
        for (const p of periodosDelMismoAnio) {
            if (!p.fechaInicio || !p.fechaFin) continue;
            const pInicio = new Date(p.fechaInicio);
            const pFin = new Date(p.fechaFin);

            // Hay solapamiento si: inicio < finExistente AND fin > inicioExistente
            if (inicio < pFin && fin > pInicio) {
                return `Las fechas se cruzan con el periodo "${p.nombrePeriodo}" (${p.fechaInicio} - ${p.fechaFin}). Elija fechas que no se sobrepongan.`;
            }
        }

        return '';
    };

    useEffect(() => {
        if (periodo) {
            setFormData({
                idPeriodo: periodo.idPeriodo,
                nombrePeriodo: periodo.nombrePeriodo,
                fechaInicio: periodo.fechaInicio || '',
                fechaFin: periodo.fechaFin || '',
                idAnio: typeof periodo.idAnio === 'object' 
                    ? periodo.idAnio.idAnioEscolar 
                    : periodo.idAnio
            });
        }
    }, [periodo]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        
        if (name === 'tipoPeriodo') {
            setTipoPeriodo(value as 'BIMESTRE' | 'TRIMESTRE');
            // Validar inmediatamente con el nuevo tipo
            const limite = value === 'TRIMESTRE' ? 3 : 4;
            const tipoPeriodoNombre = value === 'TRIMESTRE' ? 'trimestres' : 'bimestres';
            
            if (!periodo && periodosDelAnio >= limite) {
                const msg = `Este año escolar ya tiene ${periodosDelAnio} períodos registrados. El límite para ${tipoPeriodoNombre} es ${limite}.`;
                setErrorValidacion(msg);
                toast.error(msg, { id: 'periodo-validation' });
            } else {
                setErrorValidacion('');
            }
            return;
        }

        const newValue = name === 'idAnio' ? Number(value) : value;
        
        setFormData(prev => {
            const updated = { ...prev, [name]: newValue };
            // Validar fechas cuando cambian
            if (name === 'fechaInicio' || name === 'fechaFin') {
                const fi = name === 'fechaInicio' ? value : prev.fechaInicio;
                const ff = name === 'fechaFin' ? value : prev.fechaFin;
                if (fi && ff) {
                    const errorFechas = validarFechas(fi as string, ff as string);
                    if (errorFechas) {
                        setErrorValidacion(errorFechas);
                        toast.error(errorFechas, { id: 'periodo-validation' });
                    } else {
                        setErrorValidacion('');
                    }
                }
            }
            return updated;
        });

        // Validar límite cuando cambia el año escolar
        if (name === 'idAnio' && !periodo) {
            const periodoCount = periodosExistentes.filter(p => {
                const anioId = typeof p.idAnio === 'object' ? p.idAnio.idAnioEscolar : p.idAnio;
                return anioId === Number(value);
            }).length;
            
            const limite = tipoPeriodo === 'TRIMESTRE' ? 3 : 4;
            const tipoPeriodoNombre = tipoPeriodo === 'TRIMESTRE' ? 'trimestres' : 'bimestres';
            
            if (periodoCount >= limite) {
                const msg = `Este año escolar ya tiene ${limite} ${tipoPeriodoNombre} registrados. No puede agregar más.`;
                setErrorValidacion(msg);
                toast.error(msg, { id: 'periodo-validation' });
            } else {
                setErrorValidacion('');
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validación final antes de enviar
        if (!periodo && !puedeAgregarPeriodo) {
            const tipoPeriodoNombre = tipoPeriodo === 'TRIMESTRE' ? 'trimestres' : 'bimestres';
            const msg = `No puede agregar más ${tipoPeriodoNombre}. Ya alcanzó el límite de ${limiteMaximo} para este año escolar.`;
            setErrorValidacion(msg);
            toast.error(msg, { id: 'periodo-validation' });
            return;
        }

        // Validar nombre duplicado en el mismo año
        const nombreNormalizado = formData.nombrePeriodo.trim().toLowerCase();
        const nombreDuplicado = periodosDelMismoAnio.some(
            p => p.nombrePeriodo.trim().toLowerCase() === nombreNormalizado
        );
        if (nombreDuplicado) {
            toast.error(`Ya existe un periodo con el nombre "${formData.nombrePeriodo.trim()}" en este año escolar.`, { id: 'periodo-validation' });
            return;
        }

        // Validar fechas si ambas están presentes
        if (formData.fechaInicio && formData.fechaFin) {
            const errorFechas = validarFechas(formData.fechaInicio, formData.fechaFin);
            if (errorFechas) {
                setErrorValidacion(errorFechas);
                toast.error(errorFechas, { id: 'periodo-validation' });
                return;
            }
        }

        await onSubmit(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="bg-gradient-to-r from-escuela-light to-escuela-dark p-6 text-white flex justify-between items-center flex-shrink-0">
                    <h2 className="text-xl font-bold flex items-center gap-3">
                        <span className="w-1 h-6 bg-white/70 rounded-full flex-shrink-0"></span>
                        <CalendarRange className="w-6 h-6" />
                        <span>{periodo ? 'Editar Periodo' : 'Nuevo Periodo'}</span>
                    </h2>
                    <button
                        onClick={onCancel}
                        className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                        disabled={isLoading}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
                    {/* Fila 1: Tipo de División + Año Escolar */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tipo de División <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="tipoPeriodo"
                                value={tipoPeriodo}
                                onChange={handleChange}
                                required
                                disabled={!!periodo}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-escuela focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                            >
                                <option value="BIMESTRE">Bimestres (máx. 4 períodos)</option>
                                <option value="TRIMESTRE">Trimestres (máx. 3 períodos)</option>
                            </select>
                            {!periodo && (
                                <p className="mt-1 text-xs text-gray-500">
                                    Seleccione cómo dividirá el año escolar
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Año Escolar <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="idAnio"
                                value={formData.idAnio}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-escuela focus:border-transparent"
                            >
                                {aniosEscolares.map(anio => (
                                    <option key={anio.idAnioEscolar} value={anio.idAnioEscolar}>
                                        {anio.nombreAnio}
                                    </option>
                                ))}
                            </select>
                            {!periodo && (
                                <p className="mt-1 text-xs text-gray-600">
                                    {tipoPeriodo === 'TRIMESTRE' ? 'Trimestres' : 'Bimestres'}: 
                                    {' '}{periodosDelAnio}/{limiteMaximo} registrados
                                    {puedeAgregarPeriodo && ` - Puede agregar ${limiteMaximo - periodosDelAnio} más`}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Fila 2: Nombre del Periodo */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nombre del Periodo <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="nombrePeriodo"
                            value={formData.nombrePeriodo}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-escuela focus:border-transparent"
                            placeholder="Ej: Primer Bimestre, I Trimestre..."
                        />
                    </div>

                    {/* Fila 3: Fechas */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Fecha de Inicio <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                name="fechaInicio"
                                value={formData.fechaInicio}
                                onChange={handleChange}
                                required
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-escuela focus:border-transparent ${errorValidacion ? 'border-red-400' : 'border-gray-300'}`}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Fecha de Fin <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                name="fechaFin"
                                value={formData.fechaFin}
                                onChange={handleChange}
                                required
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-escuela focus:border-transparent ${errorValidacion ? 'border-red-400' : 'border-gray-300'}`}
                            />
                        </div>
                    </div>
                    <p className="-mt-2 text-xs text-gray-500">
                        {tipoPeriodo === 'BIMESTRE' 
                            ? 'Un bimestre dura aprox. 2 meses (30-75 días)' 
                            : 'Un trimestre dura aprox. 3 meses (45-105 días)'}
                    </p>

                    {/* Botones */}
                    <div className="flex justify-end space-x-3 pt-2">
                        <button
                            type="button"
                            onClick={onCancel}
                            disabled={isLoading}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading || (!periodo && !puedeAgregarPeriodo) || !!errorValidacion}
                            className="px-6 py-2 bg-escuela text-white rounded-lg hover:bg-escuela-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title={!puedeAgregarPeriodo && !periodo ? 'Límite de períodos alcanzado' : errorValidacion || ''}
                        >
                            {isLoading ? 'Guardando...' : (periodo ? 'Actualizar' : 'Crear')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PeriodoForm;
