require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');

const router = express.Router();

router.get('/random', async (req, res) => {
    try {
        const apiKey = process.env.TMDB_API_KEY;
        console.log("API KEY carregada:", apiKey);

        if (!apiKey) {
            return res.status(500).json({ error: 'Chave da API TMDb não configurada' });
        }

        const allMovies = [];
        const numberOfPagesToFetch = 2; // Fetch a few pages from each category

        // Array of relevant TMDb endpoints to fetch from
        const movieEndpoints = [
            { url: 'https://api.themoviedb.org/3/movie/popular', weight: 0.4 }, // Increased weight for popular
            { url: 'https://api.themoviedb.org/3/movie/top_rated', weight: 0.3 },
            { url: 'https://api.themoviedb.org/3/movie/now_playing', weight: 0.2 },
            { url: 'https://api.themoviedb.org/3/movie/upcoming', weight: 0.1 }
        ];

        for (const endpoint of movieEndpoints) {
            for (let page = 1; page <= numberOfPagesToFetch; page++) {
                const fetchUrl = `${endpoint.url}?api_key=${apiKey}&language=pt-BR&page=${page}`;
                const response = await fetch(fetchUrl);
                if (response.ok) {
                    const data = await response.json();
                    if (data.results) {
                        allMovies.push(...data.results);
                    }
                } else {
                    console.error(`Erro ao buscar filmes de ${endpoint.url} (página ${page}):`, response.status, response.statusText);
                    // Optionally handle errors more gracefully, e.g., skip this endpoint/page
                }
            }
        }

        if (allMovies.length === 0) {
            return res.status(404).json({ error: 'Nenhum filme encontrado de diversas fontes' });
        }

        // Apply filters for relevance
        const filteredMovies = allMovies.filter(movie =>
            movie.vote_average >= 6.0 && // Slightly lower the threshold for more variety
            movie.poster_path &&
            movie.title?.trim() &&
            movie.overview?.trim()
        );

        if (filteredMovies.length === 0) {
            return res.status(404).json({ error: 'Nenhum filme passou nos filtros de relevância' });
        }

        // Choose a random movie from the filtered list
        const randomIndex = Math.floor(Math.random() * filteredMovies.length);
        const randomMovie = filteredMovies[randomIndex];

        // Fetch complete details for the random movie
        const detailsUrl = `https://api.themoviedb.org/3/movie/${randomMovie.id}?api_key=${apiKey}&language=pt-BR`;
        const detailsResponse = await fetch(detailsUrl);
        if (!detailsResponse.ok) {
            console.error('Erro ao buscar detalhes do filme:', detailsResponse.status, detailsResponse.statusText);
            return res.status(detailsResponse.status).json({ error: 'Erro ao buscar detalhes do filme' });
        }

        const movieDetails = await detailsResponse.json();
        res.json(movieDetails);

    } catch (error) {
        console.error('Erro no backend ao buscar filme aleatório e relevante:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

module.exports = router;