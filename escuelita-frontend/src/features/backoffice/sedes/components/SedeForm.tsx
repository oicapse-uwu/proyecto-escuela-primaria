import { Building2, MapPin, X } from 'lucide-react';
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
    const [activeTab, setActiveTab] = useState<'basica' | 'ubicacion'>('basica');
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
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full overflow-hidden flex flex-col">
                {/* Header */}
                <div className="bg-gradient-to-r from-[#1e3a8a] to-[#1e1b4b] p-6 text-white flex justify-between items-center">
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
                <form onSubmit={handleSubmit} className="flex flex-col">
                    {/* Tabs */}
                    <div className="bg-gray-50 border-b border-gray-200 px-6">
                        <div className="flex space-x-1">
                            <button
                                type="button"
                                onClick={() => setActiveTab('basica')}
                                className={`px-6 py-3 font-medium text-sm transition-all ${
                                    activeTab === 'basica'
                                        ? 'border-b-2 border-primary text-primary bg-white'
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                }`}
                            >
                                <Building2 className="inline w-4 h-4 mr-2" />
                                Información Básica
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('ubicacion')}
                                className={`px-6 py-3 font-medium text-sm transition-all ${
                                    activeTab === 'ubicacion'
                                        ? 'border-b-2 border-primary text-primary bg-white'
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                }`}
                            >
                                <MapPin className="inline w-4 h-4 mr-2" />
                                Ubicación
                            </button>
                        </div>
                    </div>

                    {/* Tab Content */}
                    <div className="p-6 h-[350px] overflow-y-auto">
                        {/* Tab 1: Información Básica */}
                        {activeTab === 'basica' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                                <div>
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
                                    <div className="flex items-center justify-between mt-2">
                                        <p className="text-xs text-gray-500">
                                            0000 = Sede Principal, 0001+ = Anexos
                                        </p>
                                        <label className="flex items-center space-x-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                name="esSedePrincipal"
                                                checked={formData.esSedePrincipal}
                                                onChange={handleChange}
                                                className="w-5 h-5 accent-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                style={{ accentColor: '#2563eb' }}
                                            />
                                            <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                                                ¿Sede principal?
                                            </span>
                                        </label>
                                    </div>
                                </div>

                                <div className="mt-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Teléfono *
                                    </label>
                                    <input
                                        type="tel"
                                        name="telefono"
                                        value={formData.telefono}
                                        onChange={handleChange}
                                        required
                                        maxLength={9}
                                        pattern="[0-9]{9}"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                        placeholder="Ej: 987654321"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Solo 9 dígitos numéricos</p>
                                </div>

                                <div className="mt-2">
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
                        )}

                        {/* Tab 2: Ubicación */}
                        {activeTab === 'ubicacion' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                            </div>
                        )}
                    </div>

                    {/* Buttons - Fixed at bottom */}
                    <div className="flex justify-end space-x-4 px-6 py-4 border-t border-gray-200 bg-gray-50">
                        <button
                            type="button"
                            onClick={onCancel}
                            disabled={isLoading}
                            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
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
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                    <span>Guardando...</span>
                                </>
                            ) : (
                                <span>{sede ? 'Actualizar' : 'Crear'} Sede</span>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SedeForm;
