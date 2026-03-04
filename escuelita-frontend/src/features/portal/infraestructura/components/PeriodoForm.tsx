import { AlertCircle, CalendarRange, X } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
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
            const idAnio = typeof p.idAnio === 'object' ? p.idAnio.idAnioEscolar : p.idAnio;
            // Si estamos editando, no contar el periodo actual
            if (periodo && p.idPeriodo === periodo.idPeriodo) return false;
            return idAnio === formData.idAnio;
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
                setErrorValidacion(`Este año escolar ya tiene ${periodosDelAnio} períodos registrados. El límite para ${tipoPeriodoNombre} es ${limite}.`);
            } else {
                setErrorValidacion('');
            }
            return;
        }

        const newValue = name === 'idAnio' ? Number(value) : value;
        
        setFormData(prev => ({ 
            ...prev, 
            [name]: newValue
        }));

        // Validar límite cuando cambia el año escolar
        if (name === 'idAnio' && !periodo) {
            const periodoCount = periodosExistentes.filter(p => {
                const idAnio = typeof p.idAnio === 'object' ? p.idAnio.idAnioEscolar : p.idAnio;
                return idAnio === Number(value);
            }).length;
            
            const limite = tipoPeriodo === 'TRIMESTRE' ? 3 : 4;
            const tipoPeriodoNombre = tipoPeriodo === 'TRIMESTRE' ? 'trimestres' : 'bimestres';
            
            if (periodoCount >= limite) {
                setErrorValidacion(`Este año escolar ya tiene ${limite} ${tipoPeriodoNombre} registrados. No puede agregar más.`);
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
            setErrorValidacion(`No puede agregar más ${tipoPeriodoNombre}. Ya alcanzó el límite de ${limiteMaximo} para este año escolar.`);
            return;
        }

        await onSubmit(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                {/* Header */}
                <div className="bg-white border-b px-6 py-4 flex justify-between items-center rounded-t-lg">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center space-x-2">
                        <CalendarRange className="w-5 h-5 text-primary" />
                        <span>{periodo ? 'Editar Periodo' : 'Nuevo Periodo'}</span>
                    </h2>
                    <button
                        onClick={onCancel}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        disabled={isLoading}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Mensaje de error de validación */}
                    {errorValidacion && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start space-x-2">
                            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-red-800">{errorValidacion}</p>
                        </div>
                    )}

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
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="Ej: Primer Bimestre, I Trimestre..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Fecha de Inicio
                        </label>
                        <input
                            type="date"
                            name="fechaInicio"
                            value={formData.fechaInicio}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Fecha de Fin
                        </label>
                        <input
                            type="date"
                            name="fechaFin"
                            value={formData.fechaFin}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                    </div>

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
                            disabled={isLoading || (!periodo && !puedeAgregarPeriodo)}
                            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title={!puedeAgregarPeriodo && !periodo ? 'Límite de períodos alcanzado' : ''}
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
