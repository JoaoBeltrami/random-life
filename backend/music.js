const express = require('express');
const axios = require('axios');
const getSpotifyToken = require('./spotifyAuth');

const router = express.Router();

router.get('/random', async (req, res) => {
  try {
    const token = await getSpotifyToken();

    // Buscar lançamentos recentes (você pode trocar esse endpoint futuramente)
    const response = await axios.get('https://api.spotify.com/v1/browse/new-releases?limit=50', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const albums = response.data.albums.items;

    if (!albums || albums.length === 0) {
      return res.status(404).json({ error: 'Nenhum álbum encontrado' });
    }

    const randomAlbum = albums[Math.floor(Math.random() * albums.length)];

    const albumData = {
      nome: randomAlbum.name,
      artista: randomAlbum.artists.map((a) => a.name).join(', '),
      imagem: randomAlbum.images[0]?.url || '',
      ano: new Date(randomAlbum.release_date).getFullYear(),
      genero: "Desconhecido",
      descricao: `Álbum lançado por ${randomAlbum.artists[0].name} em ${randomAlbum.release_date}.`,
      spotifyUrl: randomAlbum.external_urls.spotify,
    };

    res.json(albumData);
  } catch (error) {
    console.error('Erro ao buscar álbum no Spotify:', error.message);
    res.status(500).json({ error: 'Erro ao buscar álbum no Spotify' });
  }
});

module.exports = router;
