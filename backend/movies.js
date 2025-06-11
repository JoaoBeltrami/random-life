require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');

const router = express.Router();

router.get('/random', async (req, res) => {
  try {
    const apiKey = process.env.TMDB_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Chave da API TMDb não configurada' });
    }

    const movieSources = [
      { name: 'discover', url: 'https://api.themoviedb.org/3/discover/movie', weight: 0.8 },
      { name: 'popular', url: 'https://api.themoviedb.org/3/movie/popular', weight: 0.1 },
      { name: 'top_rated', url: 'https://api.themoviedb.org/3/movie/top_rated', weight: 0.1 }
    ];

    const chooseSource = () => {
      const rand = Math.random();
      let acc = 0;
      for (const source of movieSources) {
        acc += source.weight;
        if (rand < acc) return source;
      }
      return movieSources[0]; // fallback para discover
    };

    const selected = chooseSource();
    const totalPages = selected.name === 'discover' ? 500 : 10;
    const randomPage = Math.floor(Math.random() * totalPages) + 1;

    const fetchUrl = `${selected.url}?api_key=${apiKey}&language=pt-BR&page=${randomPage}&sort_by=popularity.desc&include_adult=false`;
    const response = await fetch(fetchUrl);
    if (!response.ok) {
      return res.status(response.status).json({ error: 'Erro ao buscar filmes da TMDb' });
    }

    const data = await response.json();
    const validMovies = data.results.filter(movie =>
      movie.vote_average >= 6.0 &&
      movie.poster_path &&
      movie.title?.trim() &&
      movie.overview?.trim().length > 30
    );

    if (validMovies.length === 0) {
      return res.status(404).json({ error: 'Nenhum filme relevante encontrado' });
    }

    const randomMovie = validMovies[Math.floor(Math.random() * validMovies.length)];
    const detailsUrl = `https://api.themoviedb.org/3/movie/${randomMovie.id}?api_key=${apiKey}&language=pt-BR`;
    const detailsResponse = await fetch(detailsUrl);
    if (!detailsResponse.ok) {
      return res.status(detailsResponse.status).json({ error: 'Erro ao buscar detalhes do filme' });
    }

    const movieDetails = await detailsResponse.json();

    if (!movieDetails.runtime || movieDetails.runtime < 60 || !movieDetails.overview || movieDetails.overview.length < 30) {
      return res.status(404).json({ error: 'Filme descartado por falta de informações suficientes' });
    }

    res.json(movieDetails);

  } catch (error) {
    console.error('Erro no backend ao buscar filme:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;
