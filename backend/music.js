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

      // Busca playlists com a palavra "album"
      const playlistsRes = await axios.get(
        `https://api.spotify.com/v1/search?q=album&type=playlist&limit=10`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const playlists = playlistsRes.data?.playlists?.items || [];
      if (playlists.length === 0) {
        return res.status(404).json({ error: 'Nenhuma playlist encontrada' });
      }

      // Embaralha playlists para variar resultados
      for (const playlist of shuffleArray(playlists)) {
        const tracksRes = await axios.get(
          `https://api.spotify.com/v1/playlists/${playlist.id}/tracks?limit=100`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const tracks = tracksRes.data.items || [];

        // Filtra álbuns válidos: album_type "album", com imagem, nome, artista e url
        const albuns = tracks
          .map(item => item.track?.album)
          .filter(album =>
            album &&
            album.album_type === 'album' &&
            album.name &&
            album.artists?.length &&
            album.images?.length &&
            album.external_urls?.spotify &&
            album.total_tracks
          );

        // Remove duplicados pelo nome do álbum
        const albunsUnicos = [];
        const nomesVistos = new Set();

        for (const album of albuns) {
          if (!nomesVistos.has(album.name)) {
            nomesVistos.add(album.name);
            albunsUnicos.push(album);
          }
        }

        if (albunsUnicos.length > 0) {
          const albumEscolhido = albunsUnicos[Math.floor(Math.random() * albunsUnicos.length)];

          const albumData = {
            nome: albumEscolhido.name,
            artista: albumEscolhido.artists.map(a => a.name).join(', '),
            imagem: albumEscolhido.images[0].url,
            numeroFaixas: albumEscolhido.total_tracks,
            spotifyUrl: albumEscolhido.external_urls.spotify,
          };

          return res.json(albumData);
        }
      }
    }

    res.status(404).json({ error: 'Nenhum álbum válido encontrado após várias tentativas' });

  } catch (error) {
    console.error('Erro ao buscar álbum no Spotify:', error.message);
    res.status(500).json({ error: 'Erro ao buscar álbum no Spotify' });
  }
});

// Função para embaralhar array (Fisher-Yates)
function shuffleArray(array) {
  const a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

module.exports = router;
