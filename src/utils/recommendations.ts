import stringSimilarity from 'string-similarity';
import { Movie } from '../types';

export function findSimilarMovies(movie: Movie, allMovies: Movie[], count: number = 5): Movie[] {
  const otherMovies = allMovies.filter(m => m.id !== movie.id);
  
  return otherMovies
    .map(otherMovie => {
      const genreSimilarity = calculateGenreSimilarity(movie.genres, otherMovie.genres);
      const descriptionSimilarity = stringSimilarity.compareTwoStrings(
        movie.description.toLowerCase(),
        otherMovie.description.toLowerCase()
      );
      
      // Weight the similarities (70% genres, 30% description)
      const totalSimilarity = (genreSimilarity * 0.7) + (descriptionSimilarity * 0.3);
      
      return {
        movie: otherMovie,
        similarity: totalSimilarity
      };
    })
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, count)
    .map(result => result.movie);
}

function calculateGenreSimilarity(genres1: string[], genres2: string[]): number {
  const intersection = genres1.filter(genre => genres2.includes(genre));
  const union = Array.from(new Set([...genres1, ...genres2]));
  return intersection.length / union.length;
}