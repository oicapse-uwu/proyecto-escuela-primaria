import { Baby, Calendar, Camera, FileText, FileType, Home, IdCard, Phone, Stethoscope, User } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { subirFotoAvatar } from '../../../../services/uploadService';
import type { Alumno, AlumnoFormData, TipoDocumento } from '../types';

interface AlumnoFormProps {
    alumno?: Alumno | null;
    tiposDocumento: TipoDocumento[];
    onSubmit: (data: AlumnoFormData) => Promise<void>;
    onCancel: () => void;
    isLoading?: boolean;
}

const AlumnoForm: React.FC<AlumnoFormProps> = ({ 
    alumno, 
    tiposDocumento,
    onSubmit, 
    onCancel, 
    isLoading = false 
}) => {
    const [documentoError, setDocumentoError] = useState<string>('');
    const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
    const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://primaria.spring.informaticapp.com:4040';
    const [formData, setFormData] = useState<AlumnoFormData>({
        idSede: 0,
        idTipoDoc: 0,
        numeroDocumento: '',
        nombres: '',
        apellidos: '',
        fechaNacimiento: '',
        genero: 'M',
        direccion: '',
        telefonoContacto: '',
        fotoUrl: '',
        observacionesSalud: '',
        tipoIngreso: '',
        estadoAlumno: 'ACTIVO'
    });

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
        if (alumno) {
            setFormData({
                idAlumno: alumno.idAlumno,
                idSede: alumno.idSede.idSede,
                idTipoDoc: alumno.idTipoDoc.idDocumento,
                numeroDocumento: alumno.numeroDocumento,
                nombres: alumno.nombres,
                apellidos: alumno.apellidos,
                fechaNacimiento: alumno.fechaNacimiento,
                genero: alumno.genero,
                direccion: alumno.direccion || '',
                telefonoContacto: alumno.telefonoContacto || '',
                fotoUrl: alumno.fotoUrl || '',
                observacionesSalud: alumno.observacionesSalud || '',
                tipoIngreso: alumno.tipoIngreso || '',
                estadoAlumno: alumno.estadoAlumno || 'ACTIVO'
            });
        }
    }, [alumno]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name === 'idTipoDoc') {
            const num = Number(value);
            setFormData(prev => ({ ...prev, idTipoDoc: num, numeroDocumento: '' }));
            setDocumentoError('');
            return;
        }
        const valorProcesado =
            (name === 'numeroDocumento' && requiereSoloNumeros) || name === 'telefonoContacto'
                ? value.replace(/\D/g, '')
                : value;
        setFormData(prev => ({ ...prev, [name]: valorProcesado }));
        if (name === 'numeroDocumento') {
            setDocumentoError(validarDocumento(valorProcesado, formData.idTipoDoc));
        }
    };

    const handleFotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            setIsUploadingPhoto(true);
            const url = await subirFotoAvatar(file);
            setFormData(prev => ({ ...prev, fotoUrl: url }));
            toast.success('Foto actualizada');
        } catch {
            toast.error('Error al subir la foto');
        } finally {
            setIsUploadingPhoto(false);
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
        if (!formData.fechaNacimiento) {
            toast.error('La fecha de nacimiento es obligatoria');
            return;
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
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            {/* Foto de Perfil */}
            <div className="flex flex-col items-center gap-2 pb-3 border-b">
                <div
                    className="relative group cursor-pointer"
                    onClick={() => document.getElementById('alumno-foto-input')?.click()}
                >
                    <div className="w-20 h-20 rounded-full border-2 border-gray-200 overflow-hidden bg-gray-100 flex items-center justify-center">
                        {formData.fotoUrl ? (
                            <img
                                src={`${BASE_URL}${formData.fotoUrl}`}
                                alt="Foto alumno"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <User className="w-10 h-10 text-gray-400" />
                        )}
                    </div>
                    {isUploadingPhoto ? (
                        <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center">
                            <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                        </div>
                    ) : (
                        <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/30 flex items-center justify-center transition-all">
                            <Camera className="w-5 h-5 text-white opacity-0 group-hover:opacity-100" />
                        </div>
                    )}
                    <input
                        id="alumno-foto-input"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFotoChange}
                    />
                </div>
                <p className="text-xs text-gray-500">Foto de perfil (opcional)</p>
            </div>

            {/* Información Básica */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                {/* Tipo de Documento */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        <FileType className="inline w-4 h-4 mr-1" />
                        Tipo de Documento <span className="text-red-500">*</span>
                    </label>
                    <select
                        name="idTipoDoc"
                        value={formData.idTipoDoc}
                        onChange={handleChange}
                        className="w-full px-3 py-2.5 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                    >
                        <option value={0}>Seleccione tipo</option>
                        {tiposDocumento.map(tipo => (
                            <option key={tipo.idDocumento} value={tipo.idDocumento}>
                                {tipo.descripcion}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Número de Documento */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        <IdCard className="inline w-4 h-4 mr-1" />
                        Número de Documento <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="numeroDocumento"
                        value={formData.numeroDocumento}
                        onChange={handleChange}
                        inputMode={requiereSoloNumeros ? 'numeric' : 'text'}
                        maxLength={tipoDocumentoSeleccionado?.longitudMaxima ?? 20}
                        disabled={!formData.idTipoDoc}
                        className={`w-full px-3 py-2.5 text-base border rounded-lg focus:ring-2 transition-colors ${
                            documentoError
                                ? 'border-red-500 focus:ring-red-500 bg-red-50'
                                : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                        } ${!formData.idTipoDoc ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                        placeholder={tipoDocumentoSeleccionado ? `Ej: ${'0'.repeat(tipoDocumentoSeleccionado.longitudMaxima ?? 8)}` : 'Seleccione tipo primero'}
                        required
                    />
                    {tipoDocumentoSeleccionado?.longitudMaxima && (
                        <p className={`mt-1 text-xs ${documentoError ? 'text-red-600' : 'text-gray-500'}`}>
                            {tipoDocumentoSeleccionado.eslongitudExacta === 1
                                ? `Exactamente ${tipoDocumentoSeleccionado.longitudMaxima} caracteres`
                                : `Máximo ${tipoDocumentoSeleccionado.longitudMaxima} caracteres`}
                            {requiereSoloNumeros ? ' · Solo números' : ''}
                        </p>
                    )}
                    {documentoError && <p className="mt-1 text-xs text-red-600">{documentoError}</p>}
                </div>

                {/* Nombres */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        <User className="inline w-4 h-4 mr-1" />
                        Nombres <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="nombres"
                        value={formData.nombres}
                        onChange={handleChange}
                        className="w-full px-3 py-2.5 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Ej: Juan Carlos"
                        maxLength={100}
                        required
                    />
                </div>

                {/* Apellidos */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        <User className="inline w-4 h-4 mr-1" />
                        Apellidos <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="apellidos"
                        value={formData.apellidos}
                        onChange={handleChange}
                        className="w-full px-3 py-2.5 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Ej: García López"
                        maxLength={100}
                        required
                    />
                </div>

                {/* Fecha de Nacimiento */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        <Calendar className="inline w-4 h-4 mr-1" />
                        Fecha de Nacimiento <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="date"
                        name="fechaNacimiento"
                        value={formData.fechaNacimiento}
                        onChange={handleChange}
                        className="w-full px-3 py-2.5 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>

                {/* Género */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        <Baby className="inline w-4 h-4 mr-1" />
                        Género <span className="text-red-500">*</span>
                    </label>
                    <select
                        name="genero"
                        value={formData.genero}
                        onChange={handleChange}
                        className="w-full px-3 py-2.5 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                    >
                        <option value="M">Masculino</option>
                        <option value="F">Femenino</option>
                    </select>
                </div>

                {/* Dirección */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        <Home className="inline w-4 h-4 mr-1" />
                        Dirección
                    </label>
                    <input
                        type="text"
                        name="direccion"
                        value={formData.direccion}
                        onChange={handleChange}
                        className="w-full px-3 py-2.5 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Ej: Av. Principal 123"
                        maxLength={255}
                    />
                </div>

                {/* Teléfono de Contacto */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        <Phone className="inline w-4 h-4 mr-1" />
                        Teléfono de Contacto
                    </label>
                    <input
                        type="tel"
                        name="telefonoContacto"
                        value={formData.telefonoContacto}
                        onChange={handleChange}
                        className="w-full px-3 py-2.5 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Ej: 987654321"
                        inputMode="numeric"
                        maxLength={9}
                    />
                </div>

                {/* Tipo de Ingreso */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        <FileText className="inline w-4 h-4 mr-1" />
                        Tipo de Ingreso
                    </label>
                    <select
                        name="tipoIngreso"
                        value={formData.tipoIngreso}
                        onChange={handleChange}
                        className="w-full px-3 py-2.5 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">Seleccione...</option>
                        <option value="Nuevo">Nuevo</option>
                        <option value="Traslado">Traslado</option>
                        <option value="Reinicio">Reinicio</option>
                    </select>
                </div>

                {/* Estado del Alumno */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        <FileText className="inline w-4 h-4 mr-1" />
                        Estado
                    </label>
                    <select
                        name="estadoAlumno"
                        value={formData.estadoAlumno}
                        onChange={handleChange}
                        className="w-full px-3 py-2.5 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="Activo">Activo</option>
                        <option value="Inactivo">Inactivo</option>
                        <option value="Retirado">Retirado</option>
                        <option value="Trasladado">Trasladado</option>
                    </select>
                </div>
            </div>

            {/* Observaciones de Salud */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Stethoscope className="inline w-4 h-4 mr-1" />
                    Observaciones de Salud
                </label>
                <textarea
                    name="observacionesSalud"
                    value={formData.observacionesSalud}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2.5 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Alergias, condiciones médicas, medicación, etc."
                />
            </div>

            {/* Botones de Acción */}
            <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-4 border-t">
                <button
                    type="button"
                    onClick={onCancel}
                    className="w-full sm:w-auto px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 
                             transition-colors duration-200 font-medium order-2 sm:order-1"
                    disabled={isLoading}
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                             transition-colors duration-200 font-medium disabled:opacity-50 
                             disabled:cursor-not-allowed order-1 sm:order-2"
                    disabled={isLoading}
                >
                    {isLoading ? 'Guardando...' : alumno ? 'Actualizar' : 'Crear'}
                </button>
            </div>
        </form>
    );
};

export default AlumnoForm;

