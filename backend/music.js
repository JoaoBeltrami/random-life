const express = require('express');
const axios = require('axios');
const getSpotifyToken = require('./spotifyAuth');

const router = express.Router();

const generosAceitos = [
  'metal', 'rock', 'hard-rock', 'punk', 'grunge',
  'pop', 'rap', 'trap', 'hip-hop', 'r&b', 'reggaeton'
];

router.get('/random', async (req, res) => {
  try {
    const token = await getSpotifyToken();

    // Escolher um gênero aceito aleatório
    const genero = generosAceitos[Math.floor(Math.random() * generosAceitos.length)];

    // Buscar playlists populares do gênero
    const playlistsRes = await axios.get(
      `https://api.spotify.com/v1/search?q=${genero}&type=playlist&limit=10`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const playlists = playlistsRes.data.playlists.items;

    if (!playlists || playlists.length === 0) {
      return res.status(404).json({ error: 'Nenhuma playlist encontrada' });
    }

    // Seleciona uma playlist aleatória
    const playlist = playlists[Math.floor(Math.random() * playlists.length)];

    // Pega as faixas da playlist
    const tracksRes = await axios.get(
      `https://api.spotify.com/v1/playlists/${playlist.id}/tracks?limit=100`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const tracks = tracksRes.data.items
      .map(item => item.track && item.track.album)
      .filter(album => album && album.album_type === 'album' && album.release_date && album.artists && album.images.length > 0);

    const albunsUnicos = [];
    const nomesVistos = new Set();

    for (const album of tracks) {
      if (!nomesVistos.has(album.name)) {
        nomesVistos.add(album.name);
        albunsUnicos.push(album);
      }
    }

    if (albunsUnicos.length === 0) {
      return res.status(404).json({ error: 'Nenhum álbum válido encontrado' });
    }

    const albumEscolhido = albunsUnicos[Math.floor(Math.random() * albunsUnicos.length)];

    const albumData = {
      nome: albumEscolhido.name,
      artista: albumEscolhido.artists.map((a) => a.name).join(', '),
      imagem: albumEscolhido.images[0]?.url || '',
      ano: new Date(albumEscolhido.release_date).getFullYear(),
      genero: genero,
      descricao: `Álbum de ${genero}, lançado por ${albumEscolhido.artists[0].name}.`,
      spotifyUrl: albumEscolhido.external_urls.spotify,
    };

    res.json(albumData);
  } catch (error) {
    console.error('Erro ao buscar álbum no Spotify:', error.message);
    res.status(500).json({ error: 'Erro ao buscar álbum no Spotify' });
  }
});

module.exports = router;
