import { X } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';
import { crearNuevoRol } from '../api/rolesApi';

interface CrearRolModalProps {
    isOpen: boolean;
    onClose: () => void;
    onRolCreado: () => void;
}

const CrearRolModal: React.FC<CrearRolModalProps> = ({ isOpen, onClose, onRolCreado }) => {
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!nombre.trim()) {
            toast.error('El nombre del rol es requerido');
            return;
        }

        setIsLoading(true);
        try {
            await crearNuevoRol({
                nombre: nombre.trim(),
                descripcion: descripcion.trim()
            });
            
            toast.success('Rol creado exitosamente');
            setNombre('');
            setDescripcion('');
            onRolCreado();
            onClose();
        } catch (error: any) {
            const mensaje = error.response?.data?.message || 'Error al crear el rol';
            toast.error(mensaje);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-xl font-bold text-gray-800">Crear Nuevo Rol</h2>
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="p-1 hover:bg-gray-100 rounded disabled:opacity-50"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nombre del rol *
                        </label>
                        <input
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            placeholder="Ej: COORDINADOR, PSICÓLOGO"
                            disabled={isLoading}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary disabled:bg-gray-100"
                            maxLength={100}
                        />
                        <p className="text-xs text-gray-500 mt-1">{nombre.length}/100</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Descripción (opcional)
                        </label>
                        <textarea
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                            placeholder="Describe el propósito de este rol..."
                            disabled={isLoading}
                            rows={3}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary disabled:bg-gray-100 resize-none"
                            maxLength={500}
                        />
                        <p className="text-xs text-gray-500 mt-1">{descripcion.length}/500</p>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
                        <p className="font-medium">💡 Nota:</p>
                        <p>Después de crear el rol, podrás asignar módulos y permisos desde la matriz de roles.</p>
                    </div>
                </form>

                {/* Footer */}
                <div className="flex gap-3 p-6 border-t justify-end">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isLoading}
                        className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading || !nombre.trim()}
                        className="px-6 py-2.5 bg-gradient-to-r from-[#1e3a8a] to-[#1e1b4b] text-white rounded-lg hover:from-[#1e40af] hover:to-[#312e81] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                    >
                        {isLoading ? 'Creando...' : 'Crear Rol'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CrearRolModal;
