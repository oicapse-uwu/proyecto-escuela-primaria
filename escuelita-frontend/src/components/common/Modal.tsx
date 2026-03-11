import { X } from 'lucide-react';
import React from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl';
    showCloseButton?: boolean;
}

/**
 * Modal reutilizable para todo el backoffice
 * Uso:
 * <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Mi Modal">
 *   <p>Contenido del modal</p>
 * </Modal>
 */
const Modal: React.FC<ModalProps> = ({ 
    isOpen, 
    onClose, 
    title, 
    children,
    size = 'lg',
    showCloseButton = true
}) => {
    if (!isOpen) return null;

    const sizeClasses = {
        sm: 'max-w-[calc(100%-1rem)] sm:max-w-sm',
        md: 'max-w-[calc(100%-1rem)] sm:max-w-md',
        lg: 'max-w-[calc(100%-1rem)] sm:max-w-lg',
        xl: 'max-w-[calc(100%-1rem)] sm:max-w-xl',
        '2xl': 'max-w-[calc(100%-1rem)] sm:max-w-2xl',
        '4xl': 'max-w-[calc(100%-1rem)] sm:max-w-4xl'
    };

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4"
            onClick={onClose}
        >
            <div 
                className={`bg-white rounded-lg shadow-xl ${sizeClasses[size]} w-full max-h-[90vh] overflow-hidden flex flex-col`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-escuela-light to-escuela-dark p-6 text-white flex justify-between items-center flex-shrink-0">
                    <h2 className="text-lg sm:text-xl font-bold flex items-center gap-3">
                        <span className="w-1 h-6 bg-white/70 rounded-full flex-shrink-0"></span>
                        {title}
                    </h2>
                    {showCloseButton && (
                        <button
                            onClick={onClose}
                            className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                            aria-label="Cerrar"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>

                {/* Content */}
                <div className="overflow-y-auto flex-1 p-4 sm:p-6">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
