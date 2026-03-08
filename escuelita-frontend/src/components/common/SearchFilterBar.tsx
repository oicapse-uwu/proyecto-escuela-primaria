import { Search } from 'lucide-react';

interface FilterOption {
    value: string;
    label: string;
}

interface SearchFilterBarProps {
    searchValue: string;
    onSearchChange: (value: string) => void;
    searchPlaceholder?: string;
    filterValue?: string;
    onFilterChange?: (value: string) => void;
    filterOptions?: FilterOption[];
}

export const SearchFilterBar = ({
    searchValue,
    onSearchChange,
    searchPlaceholder = "Buscar...",
    filterValue,
    onFilterChange,
    filterOptions
}: SearchFilterBarProps) => {
    const hasFilter = filterValue !== undefined && onFilterChange !== undefined && filterOptions !== undefined;

    return (
        <div className="mb-3 lg:mb-4 bg-white rounded-lg shadow p-3">
            {hasFilter ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                    {/* Búsqueda */}
                    <div className="relative lg:col-span-2">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder={searchPlaceholder}
                            value={searchValue}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                    </div>

                    {/* Filtro */}
                    <div>
                        <select
                            value={filterValue}
                            onChange={(e) => onFilterChange(e.target.value)}
                            className="w-full pl-3 pr-12 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                            {filterOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            ) : (
                /* Solo búsqueda */
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder={searchPlaceholder}
                        value={searchValue}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                </div>
            )}
        </div>
    );
};
