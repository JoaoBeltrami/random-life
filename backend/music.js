const express = require('express');
const axios = require('axios');
const getSpotifyToken = require('./spotifyAuth');

const router = express.Router();

router.get('/random', async (req, res) => {
  try {
    const token = await getSpotifyToken();
    if (!token) throw new Error('Token Spotify ausente ou inválido');

    const maxTentativas = 5;
    let tentativa = 0;

    while (tentativa < maxTentativas) {
      tentativa++;

      const playlistsRes = await axios.get(
        `https://api.spotify.com/v1/search?q=album&type=playlist&limit=10&market=BR`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const playlists = playlistsRes.data?.playlists?.items || [];
      if (playlists.length === 0) {
        console.warn(`Tentativa ${tentativa}: Nenhuma playlist encontrada`);
        continue;
      }

      for (const playlist of shuffleArray(playlists)) {
        if (!playlist?.id) {
          console.warn('Playlist sem ID encontrada, ignorando...');
          continue;
        }

        const tracksRes = await axios.get(
          `https://api.spotify.com/v1/playlists/${playlist.id}/tracks?limit=100&market=BR`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const tracks = tracksRes.data?.items || [];

        const albuns = tracks
          .map(item => item?.track?.album)
          .filter(album => album != null); // remove nulos

        const albunsUnicos = [];
        const nomesVistos = new Set();

        for (const album of albuns) {
          const nome = album?.name || '';
          if (nome && !nomesVistos.has(nome)) {
            nomesVistos.add(nome);
            albunsUnicos.push(album);
          }
        }

        if (albunsUnicos.length > 0) {
          const albumEscolhido =
            albunsUnicos.find(album =>
              album?.name &&
              album?.artists?.length &&
              album?.images?.length &&
              album?.external_urls?.spotify
            ) || albunsUnicos[0];

          const albumData = {
            nome: albumEscolhido?.name || 'Nome não disponível',
            artista: albumEscolhido?.artists?.map(a => a.name).join(', ') || 'Artista não disponível',
            imagem: albumEscolhido?.images?.[0]?.url || '',
            numeroFaixas: albumEscolhido?.total_tracks || 0,
            spotifyUrl: albumEscolhido?.external_urls?.spotify || '',
          };

          console.log(`Álbum retornado: ${albumData.nome} - ${albumData.artista}`);
          return res.json(albumData);
        } else {
          console.warn(`Tentativa ${tentativa}: Nenhum álbum válido na playlist ${playlist.name}`);
        }
      }
    }

    res.status(404).json({ error: 'Nenhum álbum válido encontrado após várias tentativas' });

  } catch (error) {
    console.error('Erro ao buscar álbum no Spotify:', error.message);
    res.status(500).json({ error: 'Erro ao buscar álbum no Spotify' });
  }
});

// Embaralhar array
function shuffleArray(array) {
  const a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

module.exports = router;
