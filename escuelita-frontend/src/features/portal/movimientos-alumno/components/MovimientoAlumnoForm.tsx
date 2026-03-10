import { ArrowRightLeft, Building2, FileText, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { obtenerTodasSecciones } from '../../matriculas/api/matriculasApi';
import type { Seccion } from '../../matriculas/types';
import type { MovimientoAlumno, MovimientoAlumnoFormData, TipoMovimiento } from '../types';

interface MovimientoAlumnoFormProps {
    movimiento?: MovimientoAlumno | null;
    idMatricula: number;
    nombreAlumno: string;
    onSubmit: (data: MovimientoAlumnoFormData) => Promise<void>;
    onCancel: () => void;
    isLoading?: boolean;
}

const MovimientoAlumnoForm: React.FC<MovimientoAlumnoFormProps> = ({ 
    movimiento, 
    idMatricula,
    nombreAlumno,
    onSubmit, 
    onCancel, 
    isLoading = false 
}) => {
    const [formData, setFormData] = useState<MovimientoAlumnoFormData>({
        idMatricula: idMatricula,
        tipoMovimiento: 'Retiro',
        fechaMovimiento: new Date().toISOString().split('T')[0],
        motivo: '',
        colegioDestino: '',
        idNuevaSeccion: undefined,
        observaciones: ''
    });

    const [secciones, setSecciones] = useState<Seccion[]>([]);

    useEffect(() => {
        const cargarSecciones = async () => {
            try {
                const data = await obtenerTodasSecciones();
                setSecciones(data);
            } catch (error) {
                console.error('Error al cargar secciones:', error);
            }
        };
        cargarSecciones();
    }, []);

    useEffect(() => {
        if (movimiento) {
            setFormData({
                idMatricula: movimiento.idMatricula.idMatricula,
                tipoMovimiento: movimiento.tipoMovimiento,
                fechaMovimiento: movimiento.fechaMovimiento.split('T')[0],
                motivo: movimiento.motivo,
                colegioDestino: movimiento.colegioDestino || '',
                idNuevaSeccion: movimiento.idNuevaSeccion,
                observaciones: movimiento.observaciones || ''
            });
        }
    }, [movimiento]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ 
            ...prev, 
            [name]: name === 'idNuevaSeccion' ? (value ? parseInt(value) : undefined) : value 
        }));
    };

    const handleTipoMovimientoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const tipo = e.target.value as TipoMovimiento;
        setFormData(prev => ({ 
            ...prev, 
            tipoMovimiento: tipo,
            colegioDestino: tipo !== 'Traslado_Saliente' ? '' : prev.colegioDestino,
            idNuevaSeccion: tipo !== 'Cambio_Seccion' ? undefined : prev.idNuevaSeccion
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.motivo.trim()) {
            toast.error('El motivo es requerido');
            return;
        }

        if (formData.tipoMovimiento === 'Traslado_Saliente' && !formData.colegioDestino?.trim()) {
            toast.error('El colegio de destino es requerido para traslados');
            return;
        }

        if (formData.tipoMovimiento === 'Cambio_Seccion' && !formData.idNuevaSeccion) {
            toast.error('La nueva sección es requerida para cambios de sección');
            return;
        }

        try {
            await onSubmit(formData);
        } catch (error) {
            console.error('Error al guardar:', error);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
            <div className="relative bg-white rounded-lg shadow-2xl w-full max-w-2xl my-8">
                {/* Header con gradiente VERDE */}
                <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 p-6 text-white flex justify-between items-center rounded-t-lg">
                    <div>
                        <div className="flex items-center gap-3">
                            <ArrowRightLeft className="w-7 h-7" />
                            <h2 className="text-2xl font-bold">
                                {movimiento ? 'Editar Movimiento' : 'Nuevo Movimiento de Alumno'}
                            </h2>
                        </div>
                        <p className="text-emerald-100 mt-1 text-sm">
                            Alumno: {nombreAlumno}
                        </p>
                    </div>
                    <button
                        onClick={onCancel}
                        className="hover:bg-emerald-700/50 rounded-full p-2 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Tipo de Movimiento */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                            <ArrowRightLeft className="w-4 h-4 text-emerald-600" />
                            Tipo de Movimiento *
                        </label>
                        <select
                            name="tipoMovimiento"
                            value={formData.tipoMovimiento}
                            onChange={handleTipoMovimientoChange}
                            required
                            disabled={!!movimiento}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:bg-gray-100"
                        >
                            <option value="Retiro">Retiro</option>
                            <option value="Traslado_Saliente">Traslado Saliente</option>
                            <option value="Cambio_Seccion">Cambio de Sección</option>
                        </select>
                    </div>

                    {/* Fecha del Movimiento */}
                    <div>
                        <label className="text-sm font-semibold text-gray-700 mb-2 block">
                            Fecha del Movimiento *
                        </label>
                        <input
                            type="date"
                            name="fechaMovimiento"
                            value={formData.fechaMovimiento}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        />
                    </div>

                    {/* Mostrar campo de Colegio Destino solo para Traslados */}
                    {formData.tipoMovimiento === 'Traslado_Saliente' && (
                        <div>
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                <Building2 className="w-4 h-4 text-emerald-600" />
                                Colegio de Destino *
                            </label>
                            <input
                                type="text"
                                name="colegioDestino"
                                value={formData.colegioDestino}
                                onChange={handleChange}
                                placeholder="Nombre del colegio de destino"
                                required={formData.tipoMovimiento === 'Traslado_Saliente'}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            />
                        </div>
                    )}

                    {/* Mostrar campo de Nueva Sección solo para Cambios de Sección */}
                    {formData.tipoMovimiento === 'Cambio_Seccion' && (
                        <div>
                            <label className="text-sm font-semibold text-gray-700 mb-2 block">
                                Nueva Sección *
                            </label>
                            <select
                                name="idNuevaSeccion"
                                value={formData.idNuevaSeccion || ''}
                                onChange={handleChange}
                                required={formData.tipoMovimiento === 'Cambio_Seccion'}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            >
                                <option value="">Seleccione una sección</option>
                                {secciones.map((sec) => (
                                    <option key={sec.idSeccion} value={sec.idSeccion}>
                                        {sec.idGrado?.nombreGrado} - {sec.nombreSeccion}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Motivo */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                            <FileText className="w-4 h-4 text-emerald-600" />
                            Motivo del Movimiento *
                        </label>
                        <textarea
                            name="motivo"
                            value={formData.motivo}
                            onChange={handleChange}
                            required
                            rows={3}
                            placeholder="Describa el motivo del movimiento..."
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                        />
                    </div>

                    {/* Observaciones */}
                    <div>
                        <label className="text-sm font-semibold text-gray-700 mb-2 block">
                            Observaciones Adicionales
                        </label>
                        <textarea
                            name="observaciones"
                            value={formData.observaciones}
                            onChange={handleChange}
                            rows={2}
                            placeholder="Observaciones adicionales (opcional)..."
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                        />
                    </div>

                    {/* Botones */}
                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-lg hover:from-emerald-700 hover:to-emerald-800 transition-colors disabled:opacity-50 flex items-center gap-2 font-semibold"
                        >
                            {isLoading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                    Guardando...
                                </>
                            ) : (
                                'Guardar Movimiento'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MovimientoAlumnoForm;
