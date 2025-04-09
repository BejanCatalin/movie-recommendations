import React from 'react';
import { ArrowUpDown } from 'lucide-react';

type SortField = 'rating' | 'year';
type SortOrder = 'asc' | 'desc';

interface SortControlsProps {
  onSort: (field: SortField, order: SortOrder) => void;
  currentField: SortField;
  currentOrder: SortOrder;
}

export function SortControls({ onSort, currentField, currentOrder }: SortControlsProps) {
  return (
    <div className="flex items-center gap-4">
      <button
        onClick={() => onSort('rating', currentField === 'rating' && currentOrder === 'desc' ? 'asc' : 'desc')}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
          ${currentField === 'rating' 
            ? 'bg-blue-500 text-white' 
            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
      >
        <ArrowUpDown className={`w-4 h-4 ${currentField === 'rating' && currentOrder === 'asc' ? 'rotate-180' : ''}`} />
        Rating
      </button>
      
      <button
        onClick={() => onSort('year', currentField === 'year' && currentOrder === 'desc' ? 'asc' : 'desc')}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
          ${currentField === 'year' 
            ? 'bg-blue-500 text-white' 
            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
      >
        <ArrowUpDown className={`w-4 h-4 ${currentField === 'year' && currentOrder === 'asc' ? 'rotate-180' : ''}`} />
        Year
      </button>
    </div>
  );
}