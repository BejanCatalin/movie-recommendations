export interface Movie {
  id: number;
  title: string;
  year: number;
  genres: string[];
  description: string;
  rating: number;
  imageUrl: string;
  watchProviders?: {
    name: string;
    link: string;
    logoPath: string;
  }[];
}

export interface TMDBMovie {
  id: number;
  title: string;
  release_date: string;
  genre_ids: number[];
  overview: string;
  vote_average: number;
  poster_path: string;
}

export interface TMDBGenre {
  id: number;
  name: string;
}

export interface TMDBWatchProviders {
  results: {
    US?: {
      flatrate?: Array<{
        provider_id: number;
        provider_name: string;
        logo_path: string;
      }>;
      link: string;
    };
  };
}