import { Building, Mail, MapPin, Phone, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import type { Sede, SedeDTO } from '../types';

interface SedeFormProps {
    sede?: Sede | null;
    onSubmit: (data: SedeDTO) => Promise<void>;
    onCancel: () => void;
    isLoading?: boolean;
    idInstitucion: number;
}

const SedeForm: React.FC<SedeFormProps> = ({ 
    sede, 
    onSubmit, 
    onCancel, 
    isLoading = false,
    idInstitucion 
}) => {
    const [formData, setFormData] = useState<SedeDTO>({
        nombreSede: '',
        direccion: '',
        distrito: '',
        provincia: '',
        departamento: '',
        ugel: '',
        telefono: '',
        correoInstitucional: '',
        idInstitucion: idInstitucion
    });

    useEffect(() => {
        if (sede) {
            setFormData({
                idSede: sede.idSede,
                nombreSede: sede.nombreSede,
                direccion: sede.direccion || '',
                distrito: sede.distrito || '',
                provincia: sede.provincia || '',
                departamento: sede.departamento || '',
                ugel: sede.ugel || '',
                telefono: sede.telefono || '',
                correoInstitucional: sede.correoInstitucional || '',
                idInstitucion: typeof sede.idInstitucion === 'object' ? sede.idInstitucion.idInstitucion : sede.idInstitucion
            });
        }
    }, [sede]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSubmit(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-[#1e3a8a] to-[#1e1b4b] px-6 py-4 text-white flex justify-between items-center rounded-t-lg z-10">
                    <h2 className="text-2xl font-bold flex items-center space-x-2">
                        <Building className="w-6 h-6" />
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
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Nombre Sede */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nombre de la Sede <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="nombreSede"
                            value={formData.nombreSede}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="Ej: Sede Central, Sede Norte..."
                        />
                    </div>

                    {/* Dirección */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span>Dirección</span>
                        </label>
                        <input
                            type="text"
                            name="direccion"
                            value={formData.direccion}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="Av. Los Estudiantes 123"
                        />
                    </div>

                    {/* Ubicación */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Distrito
                            </label>
                            <input
                                type="text"
                                name="distrito"
                                value={formData.distrito}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Provincia
                            </label>
                            <input
                                type="text"
                                name="provincia"
                                value={formData.provincia}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Departamento
                            </label>
                            <input
                                type="text"
                                name="departamento"
                                value={formData.departamento}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* UGEL */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            UGEL
                        </label>
                        <input
                            type="text"
                            name="ugel"
                            value={formData.ugel}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="Ej: UGEL 01"
                        />
                    </div>

                    {/* Contacto */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center space-x-1">
                                <Phone className="w-4 h-4" />
                                <span>Teléfono</span>
                            </label>
                            <input
                                type="tel"
                                name="telefono"
                                value={formData.telefono}
                                onChange={handleChange}
                                maxLength={9}
                                pattern="[0-9]{9}"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="Ej: 987654321"
                            />
                            <p className="text-xs text-gray-500 mt-1">Solo 9 dígitos numéricos</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center space-x-1">
                                <Mail className="w-4 h-4" />
                                <span>Correo Institucional</span>
                            </label>
                            <input
                                type="email"
                                name="correoInstitucional"
                                value={formData.correoInstitucional}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="sede@institucion.edu.pe"
                            />
                        </div>
                    </div>

                    {/* Botones */}
                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onCancel}
                            disabled={isLoading}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
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
