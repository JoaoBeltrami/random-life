require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const router = express.Router();

let accessToken = null;
let tokenExpiresAt = 0;

// Função para autenticar com o Spotify e obter token
async function getSpotifyToken() {
  const now = Date.now();
  if (accessToken && now < tokenExpiresAt) {
    return accessToken; // Token ainda válido
  }

  const authOptions = {
    method: 'POST',
    headers: {
      Authorization:
        'Basic ' +
        Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
    }),
  };

  const response = await fetch('https://accounts.spotify.com/api/token', authOptions);
  const data = await response.json();
  accessToken = data.access_token;
  tokenExpiresAt = now + data.expires_in * 1000;

  return accessToken;
}

// Buscar álbuns aleatórios com base em busca genérica
router.get('/random', async (req, res) => {
  try {
    const token = await getSpotifyToken();

    // Lista de termos genéricos para busca (evita repetição e aumenta variedade)
    const searchTerms = ['rock', 'pop', 'jazz', 'love', 'dance', 'chill', 'beats', 'soundtrack'];
    const randomTerm = searchTerms[Math.floor(Math.random() * searchTerms.length)];
    const offset = Math.floor(Math.random() * 50);

    const searchUrl = `https://api.spotify.com/v1/search?q=${encodeURIComponent(
      randomTerm
    )}&type=album&market=BR&limit=1&offset=${offset}`;

    const response = await fetch(searchUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      console.error('Erro ao buscar álbuns do Spotify:', response.statusText);
      return res.status(500).json({ error: 'Erro ao buscar álbuns do Spotify' });
    }

    const data = await response.json();
    const album = data.albums?.items?.[0];

    if (!album) {
      return res.status(404).json({ error: 'Nenhum álbum encontrado' });
    }

    const result = {
      name: album.name,
      artist: album.artists.map((a) => a.name).join(', '),
      image: album.images?.[0]?.url,
      spotifyUrl: album.external_urls?.spotify,
      releaseDate: album.release_date,
      totalTracks: album.total_tracks,
    };

    res.json(result);
  } catch (err) {
    console.error('Erro interno:', err);
    res.status(500).json({ error: 'Erro interno ao buscar álbum' });
  }
});

module.exports = router;
