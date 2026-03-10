import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
    loading?: boolean;
    icon?: React.ReactNode;
    iconPosition?: 'left' | 'right';
}

export const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    loading = false,
    icon,
    iconPosition = 'left',
    className = '',
    children,
    disabled,
    ...props
}) => {
    // Variantes de estilo
    const variants = {
        primary: 'bg-gradient-to-r from-[#1e3a8a] to-[#1e1b4b] text-white hover:from-[#1e40af] hover:to-[#312e81] shadow-md hover:shadow-lg',
        secondary: 'bg-gray-200 text-gray-700 hover:bg-gray-300',
        danger: 'bg-red-600 text-white hover:bg-red-700',
        success: 'bg-emerald-600 text-white hover:bg-emerald-700',
        outline: 'border-2 border-gray-300 text-gray-700 hover:bg-gray-50'
    };

    // Tamaños - Todos consistentes con el mismo padding y altura
    const sizes = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-2.5',
        lg: 'px-8 py-3.5 text-lg'
    };

    // Clases base - Agregamos font-semibold para que TODOS sean negrita
    const baseClasses = 'rounded-lg font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap';

    // Combinar clases
    const buttonClasses = `
        ${baseClasses}
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
    `.trim().replace(/\s+/g, ' ');

    return (
        <button
            className={buttonClasses}
            disabled={disabled || loading}
            {...props}
        >
            {loading && (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
            )}
            {!loading && icon && iconPosition === 'left' && (
                <span className="flex-shrink-0">{icon}</span>
            )}
            {children && <span>{children}</span>}
            {!loading && icon && iconPosition === 'right' && (
                <span className="flex-shrink-0">{icon}</span>
            )}
        </button>
    );
};

export default Button;
