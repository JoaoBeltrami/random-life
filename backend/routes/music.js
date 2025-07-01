const express = require('express');
const axios = require('axios');
const getSpotifyToken = require('./spotifyAuth');

const router = express.Router();

// Artistas pré-definidos por modo
const ARTISTES_DARK = [
  'Deftones', 'Iron Maiden', 'Slipknot', 'System of a Down', 'Rammstein',
  'Linkin Park', 'Black Sabbath', 'Avenged Sevenfold', 'Ghost', 'Tool'
];

const ARTISTES_LIGHT = [
  'Ariana Grande', 'The1975', 'Billie Eilish', 'Miley Cyrus', 'Travis Scott',
  'Post Malone', 'Dua Lipa', 'Taylor Swift', 'Justin Bieber', 'The Weeknd'
];

// Função para embaralhar array
function shuffleArray(array) {
  const a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

router.get('/random', async (req, res) => {
  try {
    const token = await getSpotifyToken();
    if (!token) throw new Error('Token Spotify ausente ou inválido');

    const isDark = req.query.dark === 'true';
    const artistList = isDark ? ARTISTES_DARK : ARTISTES_LIGHT;
    const shuffledArtists = shuffleArray(artistList);

    for (const artistName of shuffledArtists) {
      // Buscar ID do artista
      const searchRes = await axios.get(`https://api.spotify.com/v1/search?q=${encodeURIComponent(artistName)}&type=artist&limit=1`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const artist = searchRes.data?.artists?.items?.[0];
      if (!artist || !artist.id) continue;

      // Buscar top músicas desse artista
      const tracksRes = await axios.get(`https://api.spotify.com/v1/artists/${artist.id}/top-tracks?market=BR`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const tracks = tracksRes.data?.tracks || [];

      const validTracks = tracks.filter(track =>
        track.name &&
        track.album?.images?.length &&
        track.external_urls?.spotify &&
        track.artists?.length
      );

      if (validTracks.length === 0) continue;

      const chosenTrack = shuffleArray(validTracks)[0];
      const musicData = {
        nome: chosenTrack.name,
        artista: chosenTrack.artists.map(a => a.name).join(', '),
        imagem: chosenTrack.album.images[0].url,
        spotifyUrl: chosenTrack.external_urls.spotify,
        album: chosenTrack.album.name,
        previewUrl: chosenTrack.preview_url
      };

      console.log(`Música retornada: ${musicData.nome} - ${musicData.artista}`);
      return res.json(musicData);
    }

    res.status(404).json({ error: 'Nenhuma música encontrada após várias tentativas.' });
  } catch (error) {
    console.error('Erro ao buscar música no Spotify:', error.message);
    res.status(500).json({ error: 'Erro ao buscar música no Spotify' });
  }
});

module.exports = router;
