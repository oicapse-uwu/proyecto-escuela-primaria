import { Building2, MapPin, Phone, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { obtenerTodasInstituciones } from '../../instituciones/api/institucionesApi';
import type { Institucion } from '../../instituciones/types';
import type { Sede, SedeFormData } from '../types';

interface SedeFormProps {
    sede?: Sede | null;
    onSubmit: (data: SedeFormData) => Promise<void>;
    onCancel: () => void;
    isLoading?: boolean;
    idInstitucionFijo?: number; // ID de institución fijo (oculta el selector)
}

const SedeForm: React.FC<SedeFormProps> = ({ 
    sede, 
    onSubmit, 
    onCancel, 
    isLoading = false,
    idInstitucionFijo
}) => {
    const [formData, setFormData] = useState<SedeFormData>({
        nombreSede: '',
        codigoEstablecimiento: '0000',
        esSedePrincipal: false,
        direccion: '',
        distrito: '',
        provincia: '',
        departamento: '',
        ugel: '',
        telefono: '',
        correoInstitucional: '',
        idInstitucion: 0
    });

    const [instituciones, setInstituciones] = useState<Institucion[]>([]);
    const [loadingInstituciones, setLoadingInstituciones] = useState(false);

    // Cargar instituciones al montar el componente (solo si no hay institución fija)
    useEffect(() => {
        if (idInstitucionFijo) {
            // Si hay institución fija, establecerla en el formulario
            setFormData(prev => ({ ...prev, idInstitucion: idInstitucionFijo }));
            return;
        }

        const cargarInstituciones = async () => {
            setLoadingInstituciones(true);
            try {
                const data = await obtenerTodasInstituciones();
                setInstituciones(data);
            } catch (error) {
                toast.error('Error al cargar instituciones');
                console.error(error);
            } finally {
                setLoadingInstituciones(false);
            }
        };
        
        cargarInstituciones();
    }, [idInstitucionFijo]);

    useEffect(() => {
        if (sede) {
            setFormData({
                nombreSede: sede.nombreSede,
                codigoEstablecimiento: sede.codigoEstablecimiento || '0000',
                esSedePrincipal: sede.esSedePrincipal || false,
                direccion: sede.direccion,
                distrito: sede.distrito,
                provincia: sede.provincia,
                departamento: sede.departamento,
                ugel: sede.ugel,
                telefono: sede.telefono,
                correoInstitucional: sede.correoInstitucional,
                idInstitucion: sede.idInstitucion.idInstitucion
            });
        } else if (idInstitucionFijo) {
            // Si no hay sede pero sí institución fija, establecerla
            setFormData(prev => ({ ...prev, idInstitucion: idInstitucionFijo }));
        }
    }, [sede, idInstitucionFijo]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (formData.idInstitucion === 0) {
            toast.error('Por favor seleccione una institución');
            return;
        }
        
        try {
            await onSubmit(formData);
        } catch (error) {
            console.error('Error en handleSubmit:', error);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-primary to-primary-light p-6 text-white flex justify-between items-center">
                    <h2 className="text-2xl font-bold flex items-center space-x-2">
                        <Building2 className="w-6 h-6" />
                        <span>{sede ? 'Editar Sede' : 'Nueva Sede'}</span>
                    </h2>
                    <button
                        onClick={onCancel}
                        className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                        disabled={isLoading}
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Información Básica */}
                        <div className="md:col-span-2">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                                <Building2 className="w-5 h-5 text-primary" />
                                <span>Información Básica</span>
                            </h3>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Institución *
                            </label>
                            {idInstitucionFijo ? (
                                <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700">
                                    {instituciones.find(i => i.idInstitucion === idInstitucionFijo)?.nombre || 'Institución seleccionada'}
                                </div>
                            ) : (
                                <>
                                    <select
                                        name="idInstitucion"
                                        value={formData.idInstitucion}
                                        onChange={handleChange}
                                        required
                                        disabled={loadingInstituciones || !!sede}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
                                    >
                                        <option value={0}>Seleccione una institución</option>
                                        {instituciones.map(inst => (
                                            <option key={inst.idInstitucion} value={inst.idInstitucion}>
                                                {inst.nombre}
                                            </option>
                                        ))}
                                    </select>
                                    {sede && (
                                        <p className="text-xs text-gray-500 mt-1">
                                            No se puede cambiar la institución de una sede existente
                                        </p>
                                    )}
                                </>
                            )}
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Nombre de la Sede *
                            </label>
                            <input
                                type="text"
                                name="nombreSede"
                                value={formData.nombreSede}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="Ej: Sede Principal, Anexo Lima Norte, etc."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Código de Establecimiento (SUNAT) *
                            </label>
                            <input
                                type="text"
                                name="codigoEstablecimiento"
                                value={formData.codigoEstablecimiento}
                                onChange={handleChange}
                                required
                                maxLength={4}
                                pattern="[0-9]{4}"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="0000"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                0000 = Sede Principal, 0001+ = Anexos
                            </p>
                        </div>

                        <div className="flex items-center">
                            <label className="flex items-center space-x-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="esSedePrincipal"
                                    checked={formData.esSedePrincipal}
                                    onChange={handleChange}
                                    className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary"
                                />
                                <span className="text-sm font-medium text-gray-700">
                                    ¿Es la sede principal?
                                </span>
                            </label>
                        </div>

                        {/* Ubicación */}
                        <div className="md:col-span-2">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 mt-4 flex items-center space-x-2">
                                <MapPin className="w-5 h-5 text-primary" />
                                <span>Ubicación</span>
                            </h3>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Dirección *
                            </label>
                            <input
                                type="text"
                                name="direccion"
                                value={formData.direccion}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="Ej: Av. Los Héroes 123"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Distrito *
                            </label>
                            <input
                                type="text"
                                name="distrito"
                                value={formData.distrito}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="Ej: San Martín de Porres"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Provincia *
                            </label>
                            <input
                                type="text"
                                name="provincia"
                                value={formData.provincia}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="Ej: Lima"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Departamento *
                            </label>
                            <input
                                type="text"
                                name="departamento"
                                value={formData.departamento}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="Ej: Lima"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                UGEL *
                            </label>
                            <input
                                type="text"
                                name="ugel"
                                value={formData.ugel}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="Ej: UGEL 02"
                            />
                        </div>

                        {/* Contacto */}
                        <div className="md:col-span-2">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 mt-4 flex items-center space-x-2">
                                <Phone className="w-5 h-5 text-primary" />
                                <span>Información de Contacto</span>
                            </h3>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Teléfono *
                            </label>
                            <input
                                type="tel"
                                name="telefono"
                                value={formData.telefono}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="Ej: 01 234 5678"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Correo Institucional *
                            </label>
                            <input
                                type="email"
                                name="correoInstitucional"
                                value={formData.correoInstitucional}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="Ej: sede@institucion.edu.pe"
                            />
                        </div>
                    </div>

                    {/* Botones de acción */}
                    <div className="flex justify-end space-x-4 mt-8 pt-6 border-t">
                        <button
                            type="button"
                            onClick={onCancel}
                            disabled={isLoading}
                            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center space-x-2"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    <span>Guardando...</span>
                                </>
                            ) : (
                                <span>{sede ? 'Actualizar Sede' : 'Crear Sede'}</span>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SedeForm;
