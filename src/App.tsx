import React, { useState, useEffect } from 'react';
import { Film, Loader2 } from 'lucide-react';
import { findSimilarMovies } from './utils/recommendations';
import { MovieCard } from './components/MovieCard';
import { SortControls } from './components/SortControls';
import { GenreFilter } from './components/GenreFilter';
import { Pagination } from './components/Pagination';
import { Movie, TMDBMovie, TMDBGenre } from './types';
import { convertTMDBMovie } from './utils/tmdb';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const MOVIES_PER_PAGE = 20;
const MAX_PAGES = 5;

type SortField = 'rating' | 'year';
type SortOrder = 'asc' | 'desc';

function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField>('rating');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [genres, setGenres] = useState<TMDBGenre[]>([]);
  const [favorites, setFavorites] = useState<Set<number>>(
    () => new Set(JSON.parse(localStorage.getItem('favorites') || '[]'))
  );
  const [showingFavorites, setShowingFavorites] = useState(false);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(Array.from(favorites)));
  }, [favorites]);

  useEffect(() => {
    async function fetchGenres() {
      try {
        const response = await fetch(`${SUPABASE_URL}/functions/v1/movies/genres`, {
          headers: { Authorization: `Bearer ${SUPABASE_ANON_KEY}` }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch genres');
        }

        const { genres } = await response.json();
        setGenres(genres);
      } catch (err) {
        console.error('Error fetching genres:', err);
        setError('Failed to fetch genres');
      }
    }

    fetchGenres();
  }, []);

  useEffect(() => {
    async function fetchMovies() {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(
          `${SUPABASE_URL}/functions/v1/movies/popular?page=${currentPage}`,
          { headers: { Authorization: `Bearer ${SUPABASE_ANON_KEY}` } }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch movies');
        }

        const data = await response.json();
        const convertedMovies = data.results.map((movie: TMDBMovie) => 
          convertTMDBMovie(movie, genres)
        );

        setMovies(convertedMovies);
        setTotalPages(Math.min(data.total_pages, MAX_PAGES));
      } catch (err) {
        setError('Failed to fetch movies. Please try again later.');
        console.error('Error fetching movies:', err);
      } finally {
        setLoading(false);
      }
    }

    if (genres.length > 0) {
      fetchMovies();
    }
  }, [currentPage, genres]);

  const handleMovieSelect = (movie: Movie) => {
    setSelectedMovie(movie);
    const similarMovies = findSimilarMovies(movie, movies);
    setRecommendations(similarMovies);
  };

  const handleSort = (field: SortField, order: SortOrder) => {
    setSortField(field);
    setSortOrder(order);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const toggleFavorite = (movieId: number) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(movieId)) {
        newFavorites.delete(movieId);
      } else {
        newFavorites.add(movieId);
      }
      return newFavorites;
    });
  };

  const allGenres = Array.from(
    new Set(movies.flatMap(movie => movie.genres))
  ).sort();

  const filteredAndSortedMovies = [...movies]
    .filter(movie => !selectedGenre || movie.genres.includes(selectedGenre))
    .filter(movie => !showingFavorites || favorites.has(movie.id))
    .sort((a, b) => {
      const multiplier = sortOrder === 'asc' ? 1 : -1;
      return (a[sortField] - b[sortField]) * multiplier;
    });

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-400 mb-4">Error</h1>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Film className="w-8 h-8" />
          <h1 className="text-3xl font-bold">Movie Recommendations</h1>
        </div>

        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : (
          <>
            <div className="mb-12">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-6">
                  <h2 className="text-xl font-semibold">
                    {showingFavorites ? 'Favorite Movies' : 'Popular Movies'}
                  </h2>
                  <button
                    onClick={() => {
                      setShowingFavorites(!showingFavorites);
                      setCurrentPage(1);
                    }}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      showingFavorites
                        ? 'bg-pink-600 text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    {showingFavorites ? 'Show All Movies' : 'Show Favorites'}
                  </button>
                  <GenreFilter
                    genres={allGenres}
                    selectedGenre={selectedGenre}
                    onGenreSelect={(genre) => {
                      setSelectedGenre(genre);
                      setCurrentPage(1);
                    }}
                  />
                </div>
                <SortControls
                  onSort={handleSort}
                  currentField={sortField}
                  currentOrder={sortOrder}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                {filteredAndSortedMovies.map(movie => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    onClick={() => handleMovieSelect(movie)}
                    selected={selectedMovie?.id === movie.id}
                    isFavorite={favorites.has(movie.id)}
                    onFavoriteToggle={() => toggleFavorite(movie.id)}
                  />
                ))}
              </div>

              {filteredAndSortedMovies.length === 0 ? (
                <div className="text-center text-gray-400 py-12">
                  {showingFavorites ? 'No favorite movies yet.' : 'No movies found for the selected genre.'}
                </div>
              ) : (
                <div className="mt-8">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </div>

            {selectedMovie && recommendations.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">
                  Because you like {selectedMovie.title}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                  {recommendations.map(movie => (
                    <MovieCard
                      key={movie.id}
                      movie={movie}
                      onClick={() => handleMovieSelect(movie)}
                      selected={selectedMovie?.id === movie.id}
                      isFavorite={favorites.has(movie.id)}
                      onFavoriteToggle={() => toggleFavorite(movie.id)}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;