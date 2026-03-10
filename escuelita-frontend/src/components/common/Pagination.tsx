import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import React from 'react';

interface PaginationProps {
    currentPage: number;
    totalPages?: number;
    onPageChange: (page: number) => void;
    itemsPerPage?: number;
    onItemsPerPageChange?: (items: number) => void;
    totalItems?: number;
}

/**
 * Componente de paginación simple
 * 
 * @example
 * const [currentPage, setCurrentPage] = useState(1);
 * const totalPages = Math.ceil(items.length / itemsPerPage);
 * 
 * <Pagination
 *   currentPage={currentPage}
 *   totalPages={totalPages}
 *   onPageChange={setCurrentPage}
 * />
 */
const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages: totalPagesProp,
    onPageChange,
    itemsPerPage = 10,
    onItemsPerPageChange,
    totalItems
}) => {
    // Calcular totalPages si se proporciona totalItems
    const totalPages = totalItems !== undefined 
        ? Math.ceil(totalItems / itemsPerPage) 
        : (totalPagesProp || 0);

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

    // Resetear a página 1 si cambia itemsPerPage y currentPage está fuera de rango
    React.useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            onPageChange(1);
        }
    }, [itemsPerPage, currentPage, totalPages, onPageChange]);

    if (totalPages === 0) return null;

    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems || 0);

    return (
        <div className="bg-white px-4 py-3 sm:px-6 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Info de páginas y selector de items */}
                <div className="flex items-center gap-4">
                    {totalItems !== undefined && (
                        <p className="text-sm text-gray-700">
                            Mostrando <span className="font-medium">{startItem}</span> a{' '}
                            <span className="font-medium">{endItem}</span> de{' '}
                            <span className="font-medium">{totalItems}</span> resultados
                        </p>
                    )}
                    {!totalItems && (
                        <p className="text-sm text-gray-700">
                            Página <span className="font-medium">{currentPage}</span> de{' '}
                            <span className="font-medium">{totalPages}</span>
                        </p>
                    )}
                    
                    {onItemsPerPageChange && (
                        <div className="flex items-center gap-2">
                            <label htmlFor="items-per-page" className="text-sm text-gray-700">
                                Mostrar:
                            </label>
                            <div className="relative">
                                <select
                                    id="items-per-page"
                                    value={itemsPerPage}
                                    onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
                                    className="appearance-none border border-gray-300 rounded-lg pl-3 pr-10 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                                >
                                    <option value={10}>10</option>
                                    <option value={50}>50</option>
                                    <option value={100}>100</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none" />
                            </div>
                        </div>
                    )}
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
                            {currentPage} / {totalPages}
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
