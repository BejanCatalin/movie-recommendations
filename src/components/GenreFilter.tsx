import React from 'react';
import { Filter } from 'lucide-react';

interface GenreFilterProps {
  genres: string[];
  selectedGenre: string | null;
  onGenreSelect: (genre: string | null) => void;
}

export function GenreFilter({ genres, selectedGenre, onGenreSelect }: GenreFilterProps) {
  return (
    <div className="flex items-center gap-3">
      <Filter className="w-5 h-5 text-gray-400" />
      <select
        value={selectedGenre || ''}
        onChange={(e) => onGenreSelect(e.target.value || null)}
        className="bg-gray-800 text-white rounded-lg px-4 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">All Genres</option>
        {genres.map(genre => (
          <option key={genre} value={genre}>
            {genre}
          </option>
        ))}
      </select>
    </div>
  );
}