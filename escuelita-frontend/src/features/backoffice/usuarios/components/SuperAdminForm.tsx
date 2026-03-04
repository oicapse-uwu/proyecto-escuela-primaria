import { Camera, Shield, User, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { subirFotoAvatar } from '../../../../services/uploadService';
import type { SuperAdmin, SuperAdminFormData } from '../types';

interface SuperAdminFormProps {
    superAdmin?: SuperAdmin | null;
    onSubmit: (data: SuperAdminFormData) => Promise<void>;
    onCancel: () => void;
    isLoading?: boolean;
}

const SuperAdminForm: React.FC<SuperAdminFormProps> = ({
    superAdmin,
    onSubmit,
    onCancel,
    isLoading = false
}) => {
    const [formData, setFormData] = useState<SuperAdminFormData>({
        nombres: '',
        apellidos: '',
        correo: '',
        usuario: '',
        password: '',
        rolPlataforma: 'SUPER_ADMIN',
        fotoUrl: ''
    });
    const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
    const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://primaria.spring.informaticapp.com:4040';

    useEffect(() => {
        if (superAdmin) {
            setFormData({
                nombres: superAdmin.nombres,
                apellidos: superAdmin.apellidos,
                correo: superAdmin.correo,
                usuario: superAdmin.usuario,
                password: superAdmin.password || '',
                rolPlataforma: superAdmin.rolPlataforma || 'SUPER_ADMIN',
                fotoUrl: superAdmin.fotoUrl || ''
            });
        }
    }, [superAdmin]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            setIsUploadingPhoto(true);
            const url = await subirFotoAvatar(file);
            setFormData(prev => ({ ...prev, fotoUrl: url }));
        } catch {
            toast.error('Error al subir la foto');
        } finally {
            setIsUploadingPhoto(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSubmit(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
                <div className="bg-gradient-to-r from-primary to-primary-light p-6 text-white flex justify-between items-center">
                    <h2 className="text-2xl font-bold flex items-center space-x-2">
                        <Shield className="w-6 h-6" />
                        <span>{superAdmin ? 'Editar Super Admin' : 'Nuevo Super Admin'}</span>
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
                    {/* Foto de Perfil */}
                    <div className="flex flex-col items-center gap-2 pb-4 border-b">
                        <div
                            className="relative group cursor-pointer"
                            onClick={() => document.getElementById('superadmin-foto-input')?.click()}
                        >
                            <div className="w-24 h-24 rounded-full border-2 border-gray-200 overflow-hidden bg-gray-100 flex items-center justify-center">
                                {formData.fotoUrl ? (
                                    <img
                                        src={`${BASE_URL}${formData.fotoUrl}`}
                                        alt="Foto perfil"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <User className="w-12 h-12 text-gray-400" />
                                )}
                            </div>
                            {isUploadingPhoto ? (
                                <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center">
                                    <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                                </div>
                            ) : (
                                <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/30 flex items-center justify-center transition-all">
                                    <Camera className="w-6 h-6 text-white opacity-0 group-hover:opacity-100" />
                                </div>
                            )}
                            <input
                                id="superadmin-foto-input"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFotoChange}
                            />
                        </div>
                        <p className="text-xs text-gray-500">Foto de perfil (opcional)</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Nombres *</label>
                            <input
                                type="text"
                                name="nombres"
                                value={formData.nombres}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="Ej: Mariana"
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
                                placeholder="Ej: Contreras"
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
                                placeholder="admin@escuelita.com"
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
                                placeholder="superadmin"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Contraseña {superAdmin ? '(opcional)' : '*'}
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required={!superAdmin}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="••••••••"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Rol Plataforma *</label>
                            <select
                                name="rolPlataforma"
                                value={formData.rolPlataforma}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            >
                                <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                                <option value="ADMIN">ADMIN</option>
                            </select>
                        </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start space-x-2">
                        <User className="w-4 h-4 text-blue-600 mt-0.5" />
                        <p className="text-sm text-blue-700">
                            Si estás editando y dejas la contraseña vacía, se conservará la contraseña actual.
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
                            {isLoading ? 'Guardando...' : superAdmin ? 'Actualizar' : 'Crear'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SuperAdminForm;
