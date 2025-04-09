import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  return (
    <div className="flex justify-center items-center gap-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-lg bg-gray-800 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <div className="flex items-center gap-3">
        <span className="text-gray-400">Page</span>
        <select
          value={currentPage}
          onChange={(e) => onPageChange(Number(e.target.value))}
          className="bg-gray-800 text-white rounded-lg px-4 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <option key={page} value={page}>
              {page}
            </option>
          ))}
        </select>
        <span className="text-gray-400">of {totalPages}</span>
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg bg-gray-800 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}