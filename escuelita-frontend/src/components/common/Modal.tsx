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
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        '2xl': 'max-w-2xl',
        '4xl': 'max-w-4xl'
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className={`bg-white rounded-lg shadow-xl ${sizeClasses[size]} w-full max-h-[90vh] overflow-hidden`}>
                {/* Header */}
                <div className="bg-gradient-to-r from-primary to-primary-light p-6 text-white flex justify-between items-center">
                    <h2 className="text-2xl font-bold">
                        {title}
                    </h2>
                    {showCloseButton && (
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    )}
                </div>

                {/* Content */}
                <div className="overflow-y-auto max-h-[calc(90vh-88px)]">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
