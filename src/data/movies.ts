import { Movie } from '../types';

export const movies: Movie[] = [
  {
    id: 1,
    title: "Inception",
    year: 2010,
    genres: ["Action", "Sci-Fi", "Thriller"],
    description: "A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    rating: 8.8,
    imageUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=500"
  },
  {
    id: 2,
    title: "The Matrix",
    year: 1999,
    genres: ["Action", "Sci-Fi"],
    description: "A computer programmer discovers that reality as he knows it is a simulation created by machines, and joins a rebellion to break free.",
    rating: 8.7,
    imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=500"
  },
  {
    id: 3,
    title: "Interstellar",
    year: 2014,
    genres: ["Adventure", "Drama", "Sci-Fi"],
    description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    rating: 8.6,
    imageUrl: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?auto=format&fit=crop&q=80&w=500"
  },
  {
    id: 4,
    title: "The Shawshank Redemption",
    year: 1994,
    genres: ["Drama"],
    description: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
    rating: 9.3,
    imageUrl: "https://images.unsplash.com/photo-1528495612343-9ca9f4a4de28?auto=format&fit=crop&q=80&w=500"
  },
  {
    id: 5,
    title: "Pulp Fiction",
    year: 1994,
    genres: ["Crime", "Drama"],
    description: "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
    rating: 8.9,
    imageUrl: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=500"
  }
];