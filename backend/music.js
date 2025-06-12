const express = require('express');
const axios = require('axios');
const getSpotifyToken = require('./spotifyAuth');

const router = express.Router();

const MAX_ATTEMPTS = 5;

const GENEROS_DARK = ['metal', 'rock', 'punk', 'hard'];
const GENEROS_LIGHT = ['pop', 'rap', 'hip hop'];
const GENEROS_INDESEJADOS = ['sertanejo', 'pagode'];

const artistGenresCache = new Map();

function shuffleArray(array) {
  const a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

async function getArtistGenres(artistId, token) {
  if (artistGenresCache.has(artistId)) {
    return artistGenresCache.get(artistId);
  }
  try {
    const res = await axios.get(`https://api.spotify.com/v1/artists/${artistId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const genres = res.data?.genres || [];
    artistGenresCache.set(artistId, genres);
    return genres;
  } catch (error) {
    console.warn(`Falha ao obter gêneros do artista ${artistId}: ${error.message}`);
    artistGenresCache.set(artistId, []);
    return [];
  }
}

function hasAllowedGenre(genres, allowed) {
  return genres.some(g => allowed.some(a => g.includes(a)));
}

function hasDisallowedGenre(genres) {
  return genres.some(g => GENEROS_INDESEJADOS.some(b => g.includes(b)));
}

router.get('/random', async (req, res) => {
  try {
    const token = await getSpotifyToken();
    if (!token) throw new Error('Token Spotify ausente ou inválido');

    const isDark = req.query.dark === 'true';
    const allowedGenres = isDark ? GENEROS_DARK : GENEROS_LIGHT;

    let attempt = 0;

    while (attempt < MAX_ATTEMPTS) {
      attempt++;

      const playlistsRes = await axios.get(
        `https://api.spotify.com/v1/search?q=genre&type=playlist&limit=10&market=BR`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const playlists = playlistsRes.data?.playlists?.items || [];
      if (!playlists.length) continue;

      for (const playlist of shuffleArray(playlists)) {
        const tracksRes = await axios.get(
          `https://api.spotify.com/v1/playlists/${playlist.id}/tracks?limit=100&market=BR`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const tracks = tracksRes.data?.items || [];
        artistGenresCache.clear();

        for (const item of shuffleArray(tracks)) {
          const track = item?.track;
          if (!track || !track.artists?.length) continue;

          let allGenres = [];
          for (const artist of track.artists) {
            const genres = await getArtistGenres(artist.id, token);
            allGenres = allGenres.concat(genres);
          }

          allGenres = [...new Set(allGenres.map(g => g.toLowerCase()))];

          if (hasDisallowedGenre(allGenres)) continue;
          if (!hasAllowedGenre(allGenres, allowedGenres)) continue;

          const trackData = {
            nome: track.name,
            artista: track.artists.map(a => a.name).join(', '),
            imagem: track.album.images[0]?.url || '',
            spotifyUrl: track.external_urls.spotify || '',
            previewUrl: track.preview_url || null
          };

          console.log(`Música retornada: ${trackData.nome} - ${trackData.artista}`);
          return res.json(trackData);
        }
      }
    }

    res.status(404).json({ error: 'Nenhuma música válida encontrada após várias tentativas' });
  } catch (error) {
    console.error('Erro ao buscar música no Spotify:', error.message);
    res.status(500).json({ error: 'Erro ao buscar música no Spotify' });
  }
});

module.exports = router;
