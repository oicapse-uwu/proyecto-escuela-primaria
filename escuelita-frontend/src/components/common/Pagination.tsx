import { ChevronLeft, ChevronRight } from 'lucide-react';
import React from 'react';

interface PaginationProps {
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
    onItemsPerPageChange: (itemsPerPage: number) => void;
    itemsPerPageOptions?: number[];
}

/**
 * Componente de paginación reutilizable
 * 
 * @example
 * const [currentPage, setCurrentPage] = useState(1);
 * const [itemsPerPage, setItemsPerPage] = useState(10);
 * 
 * <Pagination
 *   currentPage={currentPage}
 *   totalItems={items.length}
 *   itemsPerPage={itemsPerPage}
 *   onPageChange={setCurrentPage}
 *   onItemsPerPageChange={setItemsPerPage}
 * />
 */
const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalItems,
    itemsPerPage,
    onPageChange,
    onItemsPerPageChange,
    itemsPerPageOptions = [10, 50, 100]
}) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    const handlePrevious = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    const handleItemsPerPageChange = (newItemsPerPage: number) => {
        // Ajustar la página actual si es necesario después de cambiar el tamaño
        const newTotalPages = Math.ceil(totalItems / newItemsPerPage);
        if (currentPage > newTotalPages) {
            onPageChange(newTotalPages || 1);
        }
        onItemsPerPageChange(newItemsPerPage);
    };

    if (totalItems === 0) return null;

    return (
        <div className="bg-white px-4 py-3 sm:px-6 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Info de registros */}
                <div className="flex items-center gap-4">
                    <p className="text-sm text-gray-700">
                        Mostrando <span className="font-medium">{startItem}</span> a{' '}
                        <span className="font-medium">{endItem}</span> de{' '}
                        <span className="font-medium">{totalItems}</span> registros
                    </p>
                    
                    {/* Selector de items por página */}
                    <div className="flex items-center gap-2">
                        <label htmlFor="items-per-page" className="text-sm text-gray-700 whitespace-nowrap">
                            Por página:
                        </label>
                        <select
                            id="items-per-page"
                            value={itemsPerPage}
                            onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                            {itemsPerPageOptions.map(option => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Botones de navegación */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={handlePrevious}
                        disabled={currentPage === 1}
                        className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        <span className="hidden sm:inline">Anterior</span>
                    </button>
                    
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-700">
                            Página <span className="font-medium">{currentPage}</span> de{' '}
                            <span className="font-medium">{totalPages}</span>
                        </span>
                    </div>
                    
                    <button
                        onClick={handleNext}
                        disabled={currentPage === totalPages}
                        className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <span className="hidden sm:inline">Siguiente</span>
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Pagination;
