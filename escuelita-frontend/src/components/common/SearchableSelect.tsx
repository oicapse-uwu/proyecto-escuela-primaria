import { Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface SearchableSelectProps<T> {
    value: number | string;
    onChange: (value: number | string) => void;
    options: T[];
    getOptionId: (option: T) => number | string;
    getOptionLabel: (option: T) => string;
    getOptionSubtext?: (option: T) => string;
    placeholder?: string;
    label?: string;
    required?: boolean;
    disabled?: boolean;
    error?: string;
    className?: string;
    emptyMessage?: string;
}

function SearchableSelect<T>({
    value,
    onChange,
    options,
    getOptionId,
    getOptionLabel,
    getOptionSubtext,
    placeholder = 'Buscar...',
    label,
    required = false,
    disabled = false,
    error,
    className = '',
    emptyMessage = 'No se encontraron resultados'
}: SearchableSelectProps<T>) {
    const [searchTerm, setSearchTerm] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 });
    const inputWrapperRef = useRef<HTMLDivElement>(null);

    // Recalcular posición cada vez que se abre
    useEffect(() => {
        if (showDropdown && inputWrapperRef.current) {
            const rect = inputWrapperRef.current.getBoundingClientRect();
            setDropdownPos({
                top: rect.bottom + window.scrollY + 4,
                left: rect.left + window.scrollX,
                width: rect.width,
            });
        }
    }, [showDropdown]);

    // Cerrar si se hace scroll o resize
    useEffect(() => {
        if (!showDropdown) return;
        const close = () => setShowDropdown(false);
        window.addEventListener('scroll', close, true);
        window.addEventListener('resize', close);
        return () => {
            window.removeEventListener('scroll', close, true);
            window.removeEventListener('resize', close);
        };
    }, [showDropdown]);

    // Encontrar la opción seleccionada
    const selectedOption = options.find(opt => getOptionId(opt) === value);
    const displayValue = selectedOption 
        ? `${getOptionLabel(selectedOption)}${getOptionSubtext ? ` - ${getOptionSubtext(selectedOption)}` : ''}`
        : '';

    // Normalizar texto para búsqueda sin acentos
    const normalizeText = (text: string) => 
        text.toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');

    // Filtrar opciones por término de búsqueda
    const filteredOptions = options.filter(option => {
        const search = normalizeText(searchTerm.trim());
        if (!search) return true;
        
        const optionLabel = normalizeText(getOptionLabel(option));
        const subtext = getOptionSubtext ? normalizeText(getOptionSubtext(option)) : '';
        
        return optionLabel.includes(search) || subtext.includes(search);
    });

    const handleSelect = (option: T) => {
        onChange(getOptionId(option));
        setSearchTerm('');
        setShowDropdown(false);
    };

    const handleFocus = () => {
        setSearchTerm('');
        setShowDropdown(true);
    };

    const dropdownEl = showDropdown ? createPortal(
        <>
            {/* Backdrop invisible para cerrar al hacer click fuera */}
            <div
                className="fixed inset-0"
                style={{ zIndex: 9998 }}
                onClick={() => setShowDropdown(false)}
            />
            {/* Panel del dropdown */}
            <div
                style={{
                    position: 'absolute',
                    top: dropdownPos.top,
                    left: dropdownPos.left,
                    width: dropdownPos.width,
                    zIndex: 9999,
                }}
                className="bg-white border border-gray-300 rounded-lg shadow-xl max-h-96 overflow-hidden"
            >
                {filteredOptions.length === 0 ? (
                    <div className="px-4 py-3 text-sm text-gray-500 text-center">
                        {emptyMessage}
                    </div>
                ) : (
                    <>
                        {/* Header con contador - sticky */}
                        {filteredOptions.length > 5 && (
                            <div className="sticky top-0 bg-blue-50 px-4 py-2 border-b border-blue-100 z-10">
                                <p className="text-xs font-medium text-blue-700">
                                    {filteredOptions.length} {filteredOptions.length === 1 ? 'resultado' : 'resultados'}
                                    {filteredOptions.length !== options.length && ` de ${options.length} total`}
                                </p>
                            </div>
                        )}
                        
                        {/* Lista scrolleable */}
                        <div className="overflow-y-auto max-h-80">
                            {filteredOptions.map(option => {
                                const id = getOptionId(option);
                                const isSelected = id === value;
                                
                                return (
                                    <button
                                        key={String(id)}
                                        type="button"
                                        onMouseDown={(e) => {
                                            // Evitar que el input pierda el foco antes del click
                                            e.preventDefault();
                                            handleSelect(option);
                                        }}
                                        className={`w-full text-left px-4 py-2 hover:bg-blue-50 transition-colors border-b border-gray-50 last:border-0 ${
                                            isSelected ? 'bg-blue-100' : ''
                                        }`}
                                    >
                                        <div className="text-sm font-medium text-gray-900">
                                            {getOptionLabel(option)}
                                        </div>
                                        {getOptionSubtext && (
                                            <div className="text-xs text-gray-500">
                                                {getOptionSubtext(option)}
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>
        </>,
        document.body
    ) : null;

    return (
        <div className={`relative ${className}`}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            
            <div ref={inputWrapperRef} className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none z-10" />
                <input
                    type="text"
                    value={showDropdown ? searchTerm : displayValue}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setShowDropdown(true);
                    }}
                    onFocus={handleFocus}
                    onBlur={() => {
                        // Delay para permitir click en opciones
                        setTimeout(() => setShowDropdown(false), 150);
                    }}
                    placeholder={placeholder}
                    disabled={disabled}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                        error ? 'border-red-500' : 'border-gray-300'
                    } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    required={required && !value}
                />
            </div>

            {/* Dropdown renderizado en document.body via portal */}
            {dropdownEl}

            {/* Mensajes de error */}
            {error && (
                <p className="text-xs text-red-500 mt-1">{error}</p>
            )}
        </div>
    );
}

export default SearchableSelect;
