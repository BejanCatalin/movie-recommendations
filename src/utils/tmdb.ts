import { Movie, TMDBMovie, TMDBGenre } from '../types';

const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

export function getImageUrl(path: string): string {
  return `${TMDB_IMAGE_BASE_URL}${path}`;
}

// Convert TMDB movie format to our app's movie format
export function convertTMDBMovie(tmdbMovie: TMDBMovie & { watch_providers?: any }, genres: TMDBGenre[]): Movie {
  const watchProviders = tmdbMovie.watch_providers?.results?.US?.flatrate?.map((provider: any) => ({
    name: provider.provider_name,
    logoPath: getImageUrl(provider.logo_path),
    link: tmdbMovie.watch_providers.results.US.link
  })) || [];

  return {
    id: tmdbMovie.id,
    title: tmdbMovie.title,
    year: new Date(tmdbMovie.release_date).getFullYear(),
    genres: tmdbMovie.genre_ids.map(id => 
      genres.find(g => g.id === id)?.name || 'Unknown'
    ),
    description: tmdbMovie.overview,
    rating: tmdbMovie.vote_average,
    imageUrl: getImageUrl(tmdbMovie.poster_path),
    watchProviders
  };
}