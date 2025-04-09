import React, { useState } from 'react';
import { Star, X, Heart, ExternalLink } from 'lucide-react';
import { Movie } from '../types';

interface MovieCardProps {
  movie: Movie;
  onClick?: () => void;
  selected?: boolean;
  isFavorite?: boolean;
  onFavoriteToggle?: () => void;
}

export function MovieCard({ movie, onClick, selected, isFavorite, onFavoriteToggle }: MovieCardProps) {
  const [showDescription, setShowDescription] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowDescription(true);
    onClick?.();
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFavoriteToggle?.();
  };

  return (
    <>
      <div 
        className={`relative overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer
          ${selected ? 'ring-4 ring-blue-500' : ''}`}
        onClick={handleClick}
      >
        <img 
          src={movie.imageUrl} 
          alt={movie.title} 
          className="w-full h-48 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        <button
          onClick={handleFavoriteClick}
          className={`absolute top-2 right-2 p-2 rounded-full transition-colors ${
            isFavorite 
              ? 'bg-pink-600 text-white' 
              : 'bg-black/50 text-white hover:bg-pink-600'
          }`}
        >
          <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
        </button>
        <div className="absolute bottom-0 p-4 text-white">
          <h3 className="text-xl font-bold mb-1">{movie.title}</h3>
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-4 h-4 fill-yellow-400 stroke-yellow-400" />
            <span>{movie.rating.toFixed(1)}</span>
            <span className="text-sm">({movie.year})</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {movie.genres.map(genre => (
              <span 
                key={genre} 
                className="px-2 py-1 text-xs bg-white/20 rounded-full"
              >
                {genre}
              </span>
            ))}
          </div>
        </div>
      </div>

      {showDescription && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-lg max-w-lg w-full p-6 relative">
            <button
              onClick={() => setShowDescription(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="flex gap-4">
              <img 
                src={movie.imageUrl} 
                alt={movie.title} 
                className="w-32 h-48 object-cover rounded-lg"
              />
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">{movie.title}</h2>
                <div className="flex items-center gap-2 mb-4">
                  <Star className="w-5 h-5 fill-yellow-400 stroke-yellow-400" />
                  <span className="text-white">{movie.rating.toFixed(1)}</span>
                  <span className="text-gray-400">({movie.year})</span>
                  <button
                    onClick={handleFavoriteClick}
                    className={`ml-2 p-2 rounded-full transition-colors ${
                      isFavorite 
                        ? 'bg-pink-600 text-white' 
                        : 'bg-gray-800 text-white hover:bg-pink-600'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {movie.genres.map(genre => (
                    <span 
                      key={genre} 
                      className="px-2 py-1 text-sm bg-white/10 rounded-full text-white"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            <p className="text-gray-300 mt-4 leading-relaxed">
              {movie.description}
            </p>

            {movie.watchProviders && movie.watchProviders.length > 0 ? (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-white mb-3">Watch Now</h3>
                <div className="flex flex-wrap gap-3">
                  {movie.watchProviders.map((provider, index) => (
                    <a
                      key={index}
                      href={provider.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      <img
                        src={provider.logoPath}
                        alt={provider.name}
                        className="w-6 h-6 rounded"
                      />
                      <span className="text-white">{provider.name}</span>
                      <ExternalLink className="w-4 h-4 text-gray-400" />
                    </a>
                  ))}
                </div>
              </div>
            ) : (
              <p className="mt-6 text-gray-400">
                No streaming providers available at this time.
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}