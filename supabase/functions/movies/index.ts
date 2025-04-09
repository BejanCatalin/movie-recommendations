import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const TMDB_API_KEY = Deno.env.get('TMDB_API_KEY');
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const endpoint = url.pathname.split('/').pop();
    const page = Number(url.searchParams.get('page')) || 1;

    let data;
    
    switch (endpoint) {
      case 'popular': {
        const response = await fetch(
          `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=${page}`,
          {
            headers: {
              'Accept': 'application/json'
            }
          }
        );

        if (!response.ok) {
          throw new Error(`TMDB API error: ${response.status}`);
        }

        const tmdbData = await response.json();

        // Fetch watch providers for each movie
        const moviesWithProviders = await Promise.all(
          tmdbData.results.map(async (movie: any) => {
            const providersResponse = await fetch(
              `${TMDB_BASE_URL}/movie/${movie.id}/watch/providers?api_key=${TMDB_API_KEY}`
            );
            
            if (providersResponse.ok) {
              const providers = await providersResponse.json();
              movie.watch_providers = providers;
            }
            
            return movie;
          })
        );
        
        // Return the actual page data but limit total pages to 5
        data = {
          page: tmdbData.page,
          results: moviesWithProviders,
          total_pages: Math.min(tmdbData.total_pages, 5),
          total_results: tmdbData.total_results
        };
        break;
      }
      case 'genres': {
        const response = await fetch(
          `${TMDB_BASE_URL}/genre/movie/list?api_key=${TMDB_API_KEY}&language=en-US`
        );
        if (!response.ok) {
          throw new Error(`TMDB API error: ${response.status}`);
        }
        data = await response.json();
        break;
      }
      default:
        throw new Error('Invalid endpoint');
    }

    return new Response(
      JSON.stringify(data),
      { 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        } 
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      }
    );
  }
});