import React from 'react';
import type { Rol, Sede, TipoDocumento, UsuarioPortal, UsuarioPortalDTO } from '../types';

interface UsuarioFormProps {
    sedes: Sede[];
    roles: Rol[];
    tiposDocumento: TipoDocumento[];
    initialData?: UsuarioPortal | null;
    submitLabel?: string;
    lockSede?: boolean;
    onSubmit: (payload: UsuarioPortalDTO) => Promise<void>;
    onCancel: () => void;
    loading?: boolean;
}

const initialState: UsuarioPortalDTO = {
    numeroDocumento: '',
    apellidos: '',
    nombres: '',
    correo: '',
    usuario: '',
    contrasena: '',
    idSede: 0,
    idRol: 0,
    idTipoDoc: 0
};

const UsuarioForm: React.FC<UsuarioFormProps> = ({
    sedes,
    roles,
    tiposDocumento,
    initialData = null,
    submitLabel = 'Guardar',
    lockSede = false,
    onSubmit,
    onCancel,
    loading = false
}) => {
    const [formData, setFormData] = React.useState<UsuarioPortalDTO>(initialState);
    const [numeroDocumentoTouched, setNumeroDocumentoTouched] = React.useState(false);
    const [correoTouched, setCorreoTouched] = React.useState(false);
    const isEdit = Boolean(initialData?.idUsuario);
    const sedeSeleccionada = React.useMemo(
        () => sedes.find((sede) => sede.idSede === formData.idSede),
        [sedes, formData.idSede]
    );
    const institucionNombre = sedeSeleccionada?.idInstitucion?.nombre || 'No disponible';
    const tipoDocumentoSeleccionado = React.useMemo(
        () => tiposDocumento.find((tipo) => tipo.idTipoDoc === formData.idTipoDoc),
        [tiposDocumento, formData.idTipoDoc]
    );

    const numeroDocumentoError = React.useMemo(() => {
        const valor = formData.numeroDocumento?.trim() || '';
        if (!valor) {
            return 'El número de documento es obligatorio.';
        }

        const longitudMaxima = tipoDocumentoSeleccionado?.longitudMaxima;
        const esExacta = tipoDocumentoSeleccionado?.esLongitudExacta === 1;

        if (!longitudMaxima || Number.isNaN(longitudMaxima)) {
            return null;
        }

        if (esExacta && valor.length !== longitudMaxima) {
            return `Debe tener exactamente ${longitudMaxima} caracteres.`;
        }

        if (!esExacta && valor.length > longitudMaxima) {
            return `No debe superar ${longitudMaxima} caracteres.`;
        }

        return null;
    }, [formData.numeroDocumento, tipoDocumentoSeleccionado]);

    const correoError = React.useMemo(() => {
        const valor = formData.correo?.trim() || '';
        if (!valor) {
            return 'El correo es obligatorio.';
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(valor)) {
            return 'Ingresa un correo válido. Ejemplo: usuario@dominio.com';
        }

        return null;
    }, [formData.correo]);

    React.useEffect(() => {
        if (!initialData) {
            setFormData(initialState);
            return;
        }

        setFormData({
            idUsuario: initialData.idUsuario,
            numeroDocumento: initialData.numeroDocumento || '',
            apellidos: initialData.apellidos || '',
            nombres: initialData.nombres || '',
            correo: initialData.correo || '',
            usuario: initialData.usuario || '',
            contrasena: '',
            fotoPerfil: initialData.fotoPerfil,
            idSede: initialData.idSede?.idSede || 0,
            idRol: initialData.idRol?.idRol || 0,
            idTipoDoc: initialData.idTipoDoc?.idTipoDoc || 0
        });
    }, [initialData]);

    React.useEffect(() => {
        if (!isEdit) {
            return;
        }

        if (formData.idTipoDoc !== 0) {
            return;
        }

        if (!tiposDocumento.length) {
            return;
        }

        setFormData((prev) => ({
            ...prev,
            idTipoDoc: tiposDocumento[0].idTipoDoc
        }));
    }, [isEdit, formData.idTipoDoc, tiposDocumento]);

    React.useEffect(() => {
        if (isEdit || !lockSede) {
            return;
        }

        if (formData.idSede !== 0 || sedes.length === 0) {
            return;
        }

        setFormData((prev) => ({
            ...prev,
            idSede: sedes[0].idSede
        }));
    }, [formData.idSede, isEdit, lockSede, sedes]);

    const handleChange = (field: keyof UsuarioPortalDTO, value: string | number) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleNumeroDocumentoChange = (value: string) => {
        setNumeroDocumentoTouched(true);

        const longitudMaxima = tipoDocumentoSeleccionado?.longitudMaxima;
        const nextValue = longitudMaxima && value.length > longitudMaxima
            ? value.slice(0, longitudMaxima)
            : value;

        handleChange('numeroDocumento', nextValue);
    };

    const handleCorreoChange = (value: string) => {
        setCorreoTouched(true);
        handleChange('correo', value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setNumeroDocumentoTouched(true);
        setCorreoTouched(true);

        if (numeroDocumentoError || correoError) {
            return;
        }

        const payload: UsuarioPortalDTO = { ...formData };

        if (isEdit && payload.idSede === 0) {
            payload.idSede = initialData?.idSede?.idSede || 0;
        }

        if (isEdit && payload.idRol === 0) {
            payload.idRol = initialData?.idRol?.idRol || 0;
        }

        if (isEdit && payload.idTipoDoc === 0) {
            payload.idTipoDoc = initialData?.idTipoDoc?.idTipoDoc || 0;
        }

        if (isEdit && payload.idTipoDoc === 0 && tiposDocumento.length > 0) {
            payload.idTipoDoc = tiposDocumento[0].idTipoDoc;
        }

        if (isEdit && payload.idTipoDoc === 0) {
            payload.idTipoDoc = 1;
        }

        if (isEdit && (!payload.contrasena || !payload.contrasena.trim())) {
            payload.contrasena = initialData?.contrasena || '';
        }

        await onSubmit(payload);
        setFormData(initialState);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 px-5 pt-4 pb-8">
            <p className="text-xs text-gray-500"><span className="text-red-500 font-semibold">*</span> Campos obligatorios</p>

            <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-700 border-b border-gray-200 pb-2">Datos personales</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nombres <span className="text-red-500">*</span></label>
                        <input className="border rounded-lg px-3 py-2 w-full" value={formData.nombres} onChange={(e) => handleChange('nombres', e.target.value)} required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Apellidos <span className="text-red-500">*</span></label>
                        <input className="border rounded-lg px-3 py-2 w-full" value={formData.apellidos} onChange={(e) => handleChange('apellidos', e.target.value)} required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tipo documento {!isEdit && <span className="text-red-500">*</span>}</label>
                        <select className="border rounded-lg px-3 py-2 w-full" value={formData.idTipoDoc || ''} onChange={(e) => handleChange('idTipoDoc', Number(e.target.value) || 0)} required={!isEdit}>
                            <option value="" disabled hidden>Seleccionar tipo documento</option>
                            {tiposDocumento.map((tipo) => (
                                <option key={tipo.idTipoDoc} value={tipo.idTipoDoc}>{tipo.nombreDocumento}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">N° Documento <span className="text-red-500">*</span></label>
                        <input
                            className={`rounded-lg px-3 py-2 w-full border ${numeroDocumentoTouched && numeroDocumentoError ? 'border-red-400 bg-red-50/30' : 'border-gray-300'}`}
                            value={formData.numeroDocumento}
                            onChange={(e) => handleNumeroDocumentoChange(e.target.value)}
                            required
                        />
                        {numeroDocumentoTouched && numeroDocumentoError ? (
                            <p className="text-xs text-red-600 mt-1">{numeroDocumentoError}</p>
                        ) : (
                            tipoDocumentoSeleccionado?.longitudMaxima ? (
                                <p className="text-xs text-gray-500 mt-1">
                                    {tipoDocumentoSeleccionado.esLongitudExacta === 1
                                        ? `Longitud requerida: ${tipoDocumentoSeleccionado.longitudMaxima} caracteres.`
                                        : `Longitud máxima: ${tipoDocumentoSeleccionado.longitudMaxima} caracteres.`}
                                </p>
                            ) : null
                        )}
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Correo</label>
                        <input
                            className={`rounded-lg px-3 py-2 w-full border ${correoTouched && correoError ? 'border-red-400 bg-red-50/30' : 'border-gray-300'}`}
                            type="email"
                            value={formData.correo}
                            onChange={(e) => handleCorreoChange(e.target.value)}
                            required
                        />
                        {correoTouched && correoError && (
                            <p className="text-xs text-red-600 mt-1">{correoError}</p>
                        )}
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-700 border-b border-gray-200 pb-2">Acceso y pertenencia</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Rol <span className="text-red-500">*</span></label>
                        <select className="border rounded-lg px-3 py-2 w-full" value={formData.idRol || ''} onChange={(e) => handleChange('idRol', Number(e.target.value) || 0)} required>
                            <option value="" disabled hidden>Seleccionar rol</option>
                            {roles.map((rol) => (
                                <option key={rol.idRol} value={rol.idRol}>{rol.nombre}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Sede <span className="text-red-500">*</span></label>
                        <select className="border rounded-lg px-3 py-2 w-full" value={formData.idSede || ''} onChange={(e) => handleChange('idSede', Number(e.target.value) || 0)} required disabled={lockSede}>
                            <option value="" disabled hidden>Seleccionar sede</option>
                            {sedes.map((sede) => (
                                <option key={sede.idSede} value={sede.idSede}>{sede.nombreSede}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Usuario <span className="text-red-500">*</span></label>
                        <input className="border rounded-lg px-3 py-2 w-full" value={formData.usuario} onChange={(e) => handleChange('usuario', e.target.value)} required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña {!isEdit && <span className="text-red-500">*</span>} {isEdit ? '(opcional al editar)' : ''}</label>
                        <input
                            className="border rounded-lg px-3 py-2 w-full"
                            type="password"
                            value={formData.contrasena || ''}
                            onChange={(e) => handleChange('contrasena', e.target.value)}
                            required={!isEdit}
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Institución (según sede)</label>
                        <input
                            className="border rounded-lg px-3 py-2 w-full bg-gray-50 text-gray-700"
                            value={institucionNombre}
                            readOnly
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 mt-2 border-t border-gray-200">
                <button type="button" onClick={onCancel} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors" disabled={loading}>Cancelar</button>
                <button type="submit" className="px-5 py-2 rounded-lg bg-primary text-white hover:bg-primary-dark transition-colors" disabled={loading}>{loading ? 'Guardando...' : submitLabel}</button>
            </div>
        </form>
    );
};

export default UsuarioForm;
