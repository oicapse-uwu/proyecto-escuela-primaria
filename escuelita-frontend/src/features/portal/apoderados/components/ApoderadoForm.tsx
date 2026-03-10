import { Briefcase, ChevronDown, Search } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { useReniec } from '../../../../hooks/useReniec';
import type { Apoderado, ApoderadoFormData, TipoDocumento } from '../types';

interface ApoderadoFormProps {
    apoderado?: Apoderado | null;
    tiposDocumento: TipoDocumento[];
    onSubmit: (data: ApoderadoFormData) => Promise<void>;
    onCancel: () => void;
    isLoading?: boolean;
}

const ApoderadoForm: React.FC<ApoderadoFormProps> = ({ 
    apoderado, 
    tiposDocumento,
    onSubmit, 
    onCancel, 
    isLoading = false 
}) => {
    const [documentoError, setDocumentoError] = useState<string>('');
    const [formData, setFormData] = useState<ApoderadoFormData>({
        idSede: 0,
        idTipoDoc: 0,
        numeroDocumento: '',
        nombres: '',
        apellidos: '',
        telefonoPrincipal: '',
        correo: '',
        lugarTrabajo: ''
    });
    const { data: dataReniec, loading: loadingReniec, error: errorReniec, consultarDni } = useReniec();

    const tipoDocumentoSeleccionado = useMemo(
        () => tiposDocumento.find(t => t.idDocumento === formData.idTipoDoc),
        [tiposDocumento, formData.idTipoDoc]
    );

    const requiereSoloNumeros = useMemo(() => {
        const abrev = (tipoDocumentoSeleccionado?.abreviatura || '').toUpperCase();
        return abrev === 'DNI' || abrev === 'RUC';
    }, [tipoDocumentoSeleccionado]);

    const validarDocumento = (numero: string, idTipo: number): string => {
        if (!idTipo || !numero) return '';
        const tipo = tiposDocumento.find(t => t.idDocumento === idTipo);
        if (!tipo || !tipo.longitudMaxima) return '';
        const abrev = (tipo.abreviatura || '').toUpperCase();
        if (tipo.eslongitudExacta === 1 && numero.length !== tipo.longitudMaxima)
            return `Debe tener exactamente ${tipo.longitudMaxima} caracteres.`;
        if (tipo.eslongitudExacta !== 1 && numero.length > tipo.longitudMaxima)
            return `No debe superar ${tipo.longitudMaxima} caracteres.`;
        if (abrev === 'DNI' && !/^\d{8}$/.test(numero))
            return 'El DNI debe contener exactamente 8 dígitos numéricos.';
        if (abrev === 'RUC' && !/^\d{11}$/.test(numero))
            return 'El RUC debe contener exactamente 11 dígitos numéricos.';
        return '';
    };

    useEffect(() => {
        if (apoderado) {
            setFormData({
                idApoderado: apoderado.idApoderado,
                idSede: apoderado.idSede.idSede,
                idTipoDoc: apoderado.idTipoDoc.idDocumento,
                numeroDocumento: apoderado.numeroDocumento,
                nombres: apoderado.nombres,
                apellidos: apoderado.apellidos,
                telefonoPrincipal: apoderado.telefonoPrincipal,
                correo: apoderado.correo || '',
                lugarTrabajo: apoderado.lugarTrabajo || ''
            });
        }
    }, [apoderado]);

    // Auto-llenar datos desde RENIEC
    useEffect(() => {
        if (dataReniec) {
            setFormData(prev => ({
                ...prev,
                nombres: dataReniec.first_name,
                apellidos: `${dataReniec.first_last_name} ${dataReniec.second_last_name}`
            }));
            toast.success('Datos obtenidos de RENIEC');
        }
    }, [dataReniec]);

    // Mostrar error de RENIEC
    useEffect(() => {
        if (errorReniec) {
            toast.error(errorReniec);
        }
    }, [errorReniec]);

    const handleConsultarReniec = async () => {
        if (!formData.numeroDocumento || formData.numeroDocumento.length !== 8) {
            toast.error('Ingrese un DNI válido de 8 dígitos');
            return;
        }
        await consultarDni(formData.numeroDocumento);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === 'idTipoDoc') {
            const num = Number(value);
            setFormData(prev => ({ ...prev, idTipoDoc: num, numeroDocumento: '' }));
            setDocumentoError('');
            return;
        }
        const valorProcesado =
            (name === 'numeroDocumento' && requiereSoloNumeros) || name === 'telefonoPrincipal'
                ? value.replace(/\D/g, '')
                : value;
        setFormData(prev => ({ ...prev, [name]: valorProcesado }));
        if (name === 'numeroDocumento') {
            setDocumentoError(validarDocumento(valorProcesado, formData.idTipoDoc));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validaciones
        if (!formData.idTipoDoc || formData.idTipoDoc === 0) {
            toast.error('Debe seleccionar un tipo de documento');
            return;
        }
        if (!formData.numeroDocumento.trim()) {
            toast.error('El número de documento es obligatorio');
            return;
        }
        const errDoc = validarDocumento(formData.numeroDocumento, formData.idTipoDoc);
        if (errDoc) {
            setDocumentoError(errDoc);
            toast.error(errDoc);
            return;
        }
        if (!formData.nombres.trim()) {
            toast.error('El nombre es obligatorio');
            return;
        }
        if (!formData.apellidos.trim()) {
            toast.error('Los apellidos son obligatorios');
            return;
        }
        if (!formData.telefonoPrincipal.trim()) {
            toast.error('El teléfono principal es obligatorio');
            return;
        }
        
        // Validar formato de correo si se proporciona
        if (formData.correo && formData.correo.trim() !== '') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.correo)) {
                toast.error('El formato del correo electrónico no es válido');
                return;
            }
        }
        
        try {
            await onSubmit({
                ...formData,
                idSede: Number(formData.idSede),
                idTipoDoc: Number(formData.idTipoDoc)
            });
        } catch (error) {
            console.error('Error en handleSubmit:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col">
            <div className="space-y-6">
                <div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tipo de Documento <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <select
                                    name="idTipoDoc"
                                    value={formData.idTipoDoc}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2.5 pr-9 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent truncate appearance-none bg-white cursor-pointer"
                                    required
                                >
                                    <option value={0}>Seleccione tipo</option>
                                    {tiposDocumento.map(tipo => (
                                        <option key={tipo.idDocumento} value={tipo.idDocumento}>
                                            {tipo.abreviatura} - {tipo.descripcion}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Número de Documento <span className="text-red-500">*</span>
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    name="numeroDocumento"
                                    value={formData.numeroDocumento}
                                    onChange={handleChange}
                                    inputMode={requiereSoloNumeros ? 'numeric' : 'text'}
                                    maxLength={tipoDocumentoSeleccionado?.longitudMaxima ?? 20}
                                    disabled={!formData.idTipoDoc}
                                    className={`flex-1 px-3 py-2.5 text-base border rounded-lg focus:ring-2 transition-colors ${
                                        documentoError
                                            ? 'border-red-500 focus:ring-red-500 bg-red-50'
                                            : 'border-gray-300 focus:ring-emerald-500 focus:border-transparent'
                                    } ${!formData.idTipoDoc ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                                    placeholder={tipoDocumentoSeleccionado ? `Ej: ${'0'.repeat(tipoDocumentoSeleccionado.longitudMaxima ?? 8)}` : 'Seleccione tipo primero'}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={handleConsultarReniec}
                                    disabled={tipoDocumentoSeleccionado?.abreviatura?.toUpperCase() !== 'DNI' || !formData.numeroDocumento || formData.numeroDocumento.length !== 8 || loadingReniec}
                                    className={`px-3 py-2.5 rounded-lg transition-colors flex items-center justify-center whitespace-nowrap ${
                                        tipoDocumentoSeleccionado?.abreviatura?.toUpperCase() === 'DNI'
                                            ? 'bg-emerald-600 text-white hover:bg-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed'
                                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    }`}
                                    title="Consultar en RENIEC"
                                >
                                    <Search className={`${loadingReniec ? 'w-5 h-5 animate-spin' : 'w-5 h-5'}`} />
                                </button>
                            </div>
                            <div className="mt-1 min-h-[20px]">
                                {documentoError ? (
                                    <p className="text-xs text-red-600">{documentoError}</p>
                                ) : tipoDocumentoSeleccionado?.longitudMaxima ? (
                                    <p className="text-xs text-gray-500">
                                        {tipoDocumentoSeleccionado.eslongitudExacta === 1
                                            ? `Exactamente ${tipoDocumentoSeleccionado.longitudMaxima} caracteres`
                                            : `Máximo ${tipoDocumentoSeleccionado.longitudMaxima} caracteres`}
                                        {requiereSoloNumeros ? ' · Solo números' : ''}
                                    </p>
                                ) : (
                                    <p className="text-xs text-transparent">Espacio reservado</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-200 pt-6">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Nombres <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="nombres"
                                value={formData.nombres}
                                onChange={handleChange}
                                className="w-full px-3 py-2.5 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                placeholder="Ej: Juan Carlos"
                                maxLength={100}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Apellidos <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="apellidos"
                                value={formData.apellidos}
                                onChange={handleChange}
                                className="w-full px-3 py-2.5 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                placeholder="Ej: García López"
                                maxLength={100}
                                required
                            />
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-200 pt-6">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Teléfono Principal <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="tel"
                                name="telefonoPrincipal"
                                value={formData.telefonoPrincipal}
                                onChange={handleChange}
                                className="w-full px-3 py-2.5 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                placeholder="Ej: 987654321"
                                inputMode="numeric"
                                maxLength={9}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Correo Electrónico
                            </label>
                            <input
                                type="email"
                                name="correo"
                                value={formData.correo}
                                onChange={handleChange}
                                className="w-full px-3 py-2.5 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                placeholder="ejemplo@correo.com"
                                maxLength={100}
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Lugar de Trabajo
                            </label>
                            <div className="relative">
                                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                <input
                                    type="text"
                                    name="lugarTrabajo"
                                    value={formData.lugarTrabajo}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-3 py-2.5 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                    placeholder="Ej: Empresa ABC"
                                    maxLength={100}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-5 mt-6 bg-gray-50 border-t border-gray-200 -mx-6 -mb-6 px-6 pb-4 rounded-b-xl">
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
                    className="w-full sm:w-auto px-4 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-lg hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed order-1 sm:order-2 shadow-md hover:shadow-lg"
                    disabled={isLoading}
                >
                    {isLoading ? 'Guardando...' : apoderado ? 'Actualizar Apoderado' : 'Crear Apoderado'}
                </button>
            </div>
        </form>
    );
};

export default ApoderadoForm;
