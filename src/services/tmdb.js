const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export async function fetchRandomMovies() {
  const randomYear = Math.floor(Math.random() * (2022 - 1970 + 1)) + 1970;

  const response = await fetch(
    `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=pt-BR&sort_by=popularity.desc&include_adult=false&vote_count.gte=500&with_original_language=en&year=${randomYear}`
  );

  const data = await response.json();
  return data.results;
}

export async function fetchMovieDetails(id) {
  const response = await fetch(
    `${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=pt-BR&append_to_response=credits`
  );
  return await response.json();
}
