import React from 'react';

interface FilterOption {
  id: string;
  label: string;
}

interface QuickFiltersProps {
  filters: FilterOption[];
  activeFilter: string;
  onFilterChange: (filterId: string) => void;
}

export const QuickFilters: React.FC<QuickFiltersProps> = ({ 
  filters, 
  activeFilter, 
  onFilterChange 
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="inline-flex rounded-md shadow-sm" role="group">
        {filters.map((filter) => (
          <button
            key={filter.id}
            type="button"
            className={`px-4 py-2 text-sm font-medium ${
              activeFilter === filter.id
                ? 'text-white bg-primary-600 hover:bg-primary-700'
                : 'text-gray-700 bg-white hover:bg-gray-50 border border-gray-300'
            } ${
              filters.indexOf(filter) === 0 
                ? 'rounded-l-md' 
                : ''
            } ${
              filters.indexOf(filter) === filters.length - 1 
                ? 'rounded-r-md' 
                : ''
            } ${
              filters.indexOf(filter) !== 0 && filters.indexOf(filter) !== filters.length - 1
                ? '-ml-px'
                : ''
            }`}
            onClick={() => onFilterChange(filter.id)}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  );
}; 