import { X } from 'lucide-react';
import React from 'react';

interface ModalUsuarioProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

const ModalUsuario: React.FC<ModalUsuarioProps> = ({ 
    isOpen, 
    onClose, 
    title, 
    children
}) => {
    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-lg shadow-xl w-[780px] h-[450px] overflow-hidden flex flex-col flex-shrink-0"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-escuela-light to-escuela-dark p-6 text-white flex justify-between items-center flex-shrink-0">
                    <h2 className="text-xl font-bold flex items-center gap-3">
                        <span className="w-1 h-6 bg-white/70 rounded-full flex-shrink-0"></span>
                        {title}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                        aria-label="Cerrar"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-hidden flex flex-col">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default ModalUsuario;
