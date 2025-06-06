// movies.js
require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');

const router = express.Router();

router.get('/random', async (req, res) => {
  try {
    const apiKey = process.env.TMDB_API_KEY;

    // 1. Buscar lista de filmes populares
    const popularUrl = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=pt-BR&page=1`;
    const popularResponse = await fetch(popularUrl);
    if (!popularResponse.ok) {
      return res.status(popularResponse.status).json({ error: 'Erro ao consultar lista de filmes' });
    }
    const popularData = await popularResponse.json();
    const movies = popularData.results || [];

    if (movies.length === 0) {
      return res.status(404).json({ error: 'Nenhum filme encontrado' });
    }

    // 2. Aplicar os mesmos filtros do front-end
    const filtered = movies.filter((movie) =>
      movie.vote_average >= 6.5 &&
      movie.poster_path &&
      movie.title?.trim() &&
      movie.overview?.trim()
    );

    if (filtered.length === 0) {
      return res.status(404).json({ error: 'Nenhum filme passou nos filtros' });
    }

    // 3. Escolher um filme aleatório dos filtrados
    const randomMovie = filtered[Math.floor(Math.random() * filtered.length)];

    // 4. Buscar detalhes completos
    const detailsUrl = `https://api.themoviedb.org/3/movie/${randomMovie.id}?api_key=${apiKey}&language=pt-BR`;
    const detailsResponse = await fetch(detailsUrl);
    if (!detailsResponse.ok) {
      return res.status(detailsResponse.status).json({ error: 'Erro ao buscar detalhes do filme' });
    }

    const movieDetails = await detailsResponse.json();
    res.json(movieDetails);
  } catch (error) {
    console.error('Erro no backend ao buscar filme:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;
