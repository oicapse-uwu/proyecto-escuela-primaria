import { ChevronDown, Search, User, Users, X } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { useReniec } from '../../../../hooks/useReniec';
import type { AdministradorFormData, Rol, Sede, TipoDocumento, UsuarioSistema } from '../types';

interface AdministradorFormProps {
    administrador?: UsuarioSistema | null;
    roles: Rol[];
    sedes: Sede[];
    tiposDocumento: TipoDocumento[];
    onSubmit: (data: AdministradorFormData) => Promise<void>;
    onCancel: () => void;
    isLoading?: boolean;
}

const AdministradorForm: React.FC<AdministradorFormProps> = ({
    administrador,
    roles,
    sedes,
    tiposDocumento,
    onSubmit,
    onCancel,
    isLoading = false
}) => {
    const [formData, setFormData] = useState<AdministradorFormData>({
        numeroDocumento: '',
        apellidos: '',
        nombres: '',
        correo: '',
        usuario: '',
        contrasena: '',
        fotoPerfil: '',
        idSede: 0,
        idRol: 0,
        idTipoDoc: 0
    });
    const [documentoError, setDocumentoError] = useState<string>('');
    const { data: dataReniec, loading: loadingReniec, error: errorReniec, consultarDni } = useReniec();

    const tipoDocumentoSeleccionado = useMemo(
        () => tiposDocumento.find(item => item.idDocumento === formData.idTipoDoc),
        [tiposDocumento, formData.idTipoDoc]
    );

    const requiereSoloNumeros = useMemo(() => {
        const abreviatura = (tipoDocumentoSeleccionado?.abreviatura || '').toUpperCase();
        return abreviatura === 'DNI' || abreviatura === 'RUC';
    }, [tipoDocumentoSeleccionado]);

    const validarDocumento = (numeroDocumento: string, idTipoDoc: number): string => {
        if (!idTipoDoc || !numeroDocumento) {
            return '';
        }

        const tipoDoc = tiposDocumento.find(item => item.idDocumento === idTipoDoc);
        if (!tipoDoc || !tipoDoc.longitudMaxima) {
            return '';
        }

        const abreviatura = (tipoDoc.abreviatura || '').toUpperCase();

        const longitudMaxima = tipoDoc.longitudMaxima;
        const esLongitudExacta = tipoDoc.esLongitudExacta === 1;

        if (esLongitudExacta && numeroDocumento.length !== longitudMaxima) {
            return `Debe tener exactamente ${longitudMaxima} caracteres.`;
        }

        if (!esLongitudExacta && numeroDocumento.length > longitudMaxima) {
            return `No debe superar ${longitudMaxima} caracteres.`;
        }

        if (abreviatura === 'DNI' && !/^\d{8}$/.test(numeroDocumento)) {
            return 'El DNI debe contener exactamente 8 dígitos numéricos.';
        }

        if (abreviatura === 'RUC' && !/^\d{11}$/.test(numeroDocumento)) {
            return 'El RUC debe contener exactamente 11 dígitos numéricos.';
        }

        return '';
    };

    useEffect(() => {
        if (administrador) {
            setFormData({
                numeroDocumento: administrador.numeroDocumento || '',
                apellidos: administrador.apellidos || '',
                nombres: administrador.nombres || '',
                correo: administrador.correo || '',
                usuario: administrador.usuario || '',
                contrasena: '',
                fotoPerfil: administrador.fotoPerfil || '',
                idSede: administrador.idSede?.idSede || 0,
                idRol: administrador.idRol?.idRol || 0,
                idTipoDoc: administrador.idTipoDoc?.idDocumento || 0
            });
        }
    }, [administrador]);

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
        if (name === 'idSede' || name === 'idRol' || name === 'idTipoDoc') {
            const numericValue = Number(value);
            setFormData(prev => ({ ...prev, [name]: numericValue }));
            if (name === 'idTipoDoc') {
                setDocumentoError(validarDocumento(formData.numeroDocumento, numericValue));
            }
            return;
        }

        const valorProcesado =
            name === 'numeroDocumento' && requiereSoloNumeros
                ? value.replace(/\D/g, '')
                : value;

        setFormData(prev => ({ ...prev, [name]: valorProcesado }));
        if (name === 'numeroDocumento') {
            setDocumentoError(validarDocumento(valorProcesado, formData.idTipoDoc));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const errorDocumento = validarDocumento(formData.numeroDocumento, formData.idTipoDoc);
        setDocumentoError(errorDocumento);
        if (errorDocumento) {
            return;
        }
        await onSubmit(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
                <div className="bg-gradient-to-r from-[#1e3a8a] to-[#1e1b4b] p-6 text-white flex justify-between items-center">
                    <h2 className="text-2xl font-bold flex items-center space-x-2">
                        <Users className="w-6 h-6" />
                        <span>{administrador ? 'Editar Administrador' : 'Nuevo Administrador'}</span>
                    </h2>
                    <button
                        onClick={onCancel}
                        className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                        disabled={isLoading}
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[calc(90vh-140px)]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Documento *</label>
                            <div className="relative">
                                <select
                                    name="idTipoDoc"
                                    value={formData.idTipoDoc}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent truncate appearance-none bg-white cursor-pointer"
                                >
                                    <option value={0}>Seleccione...</option>
                                    {tiposDocumento.map(item => (
                                        <option key={item.idDocumento} value={item.idDocumento}>
                                            {item.abreviatura} - {item.descripcion}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                            </div>
                            <div className="mt-1 h-4">
                                {/* Espacio reservado para mensajes */}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Número de Documento *</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    name="numeroDocumento"
                                    value={formData.numeroDocumento}
                                    onChange={handleChange}
                                    required
                                    inputMode={requiereSoloNumeros ? 'numeric' : 'text'}
                                    maxLength={tipoDocumentoSeleccionado?.longitudMaxima}
                                    className={`flex-1 px-4 py-2 border rounded-lg focus:ring-2 transition-colors ${
                                        documentoError
                                            ? 'border-red-500 focus:ring-red-500 focus:border-red-500 bg-red-50'
                                            : 'border-gray-300 focus:ring-primary focus:border-transparent'
                                    }`}
                                    placeholder="Ej: 12345678"
                                />
                                <button
                                    type="button"
                                    onClick={handleConsultarReniec}
                                    disabled={tipoDocumentoSeleccionado?.abreviatura?.toUpperCase() !== 'DNI' || !formData.numeroDocumento || formData.numeroDocumento.length !== 8 || loadingReniec}
                                    className={`px-3 py-2 rounded-lg transition-colors flex items-center justify-center whitespace-nowrap ${
                                        tipoDocumentoSeleccionado?.abreviatura?.toUpperCase() === 'DNI'
                                            ? 'bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed'
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
                                        {tipoDocumentoSeleccionado.esLongitudExacta === 1
                                            ? `Requiere exactamente ${tipoDocumentoSeleccionado.longitudMaxima} caracteres.`
                                            : `Máximo ${tipoDocumentoSeleccionado.longitudMaxima} caracteres.`}
                                        {requiereSoloNumeros ? ' · Solo números.' : ''}
                                    </p>
                                ) : (
                                    <p className="text-xs text-transparent">Espacio reservado</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Nombres *</label>
                            <input
                                type="text"
                                name="nombres"
                                value={formData.nombres}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="Ej: Juan"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Apellidos *</label>
                            <input
                                type="text"
                                name="apellidos"
                                value={formData.apellidos}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="Ej: Pérez"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Correo *</label>
                            <input
                                type="email"
                                name="correo"
                                value={formData.correo}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="admin@correo.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Usuario *</label>
                            <input
                                type="text"
                                name="usuario"
                                value={formData.usuario}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="usuario_admin"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Contraseña {administrador ? '(opcional)' : '*'}
                            </label>
                            <input
                                type="password"
                                name="contrasena"
                                value={formData.contrasena}
                                onChange={handleChange}
                                required={!administrador}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="••••••••"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Rol *</label>
                            <select
                                name="idRol"
                                value={formData.idRol}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            >
                                <option value={0}>Seleccione...</option>
                                {roles.map(item => (
                                    <option key={item.idRol} value={item.idRol}>{item.nombre}</option>
                                ))}
                            </select>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Sede *</label>
                            <select
                                name="idSede"
                                value={formData.idSede}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            >
                                <option value={0}>Seleccione...</option>
                                {sedes.map(item => (
                                    <option key={item.idSede} value={item.idSede}>
                                        {item.nombreSede} - {item.idInstitucion?.nombre || 'Sin institución'}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Foto Perfil (URL)</label>
                            <input
                                type="text"
                                name="fotoPerfil"
                                value={formData.fotoPerfil || ''}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="https://..."
                            />
                        </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start space-x-2">
                        <User className="w-4 h-4 text-blue-600 mt-0.5" />
                        <p className="text-sm text-blue-700">
                            Si editas y dejas la contraseña vacía, se mantiene la contraseña actual.
                        </p>
                    </div>

                    <div className="flex justify-end space-x-3 pt-2">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            disabled={isLoading}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Guardando...' : administrador ? 'Actualizar' : 'Crear'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdministradorForm;
