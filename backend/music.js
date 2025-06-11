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
    if (!token) throw new Error('Token Spotify ausente ou inválido');

    const genero = generosAceitos[Math.floor(Math.random() * generosAceitos.length)];
    console.log("🎧 Gênero sorteado:", genero);

    // Busca playlists relacionadas ao gênero
    const playlistsRes = await axios.get(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(genero)}&type=playlist&limit=10`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const playlists = playlistsRes.data?.playlists?.items || [];
    if (playlists.length === 0) {
      console.warn('⚠️ Nenhuma playlist encontrada para o gênero:', genero);
      return res.status(404).json({ error: 'Nenhuma playlist encontrada' });
    }

    // Embaralha playlists para varrer várias possibilidades
    for (const playlist of shuffleArray(playlists)) {
      const tracksRes = await axios.get(
        `https://api.spotify.com/v1/playlists/${playlist.id}/tracks?limit=100`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const tracks = tracksRes.data.items || [];

      // Filtra os álbuns únicos das tracks válidas
      const albuns = tracks
        .map(item => item.track?.album)
        .filter(album =>
          album &&
          album.album_type === 'album' &&
          album.release_date &&
          album.artists?.length &&
          album.images?.length &&
          album.external_urls?.spotify
        );

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

        // Garante ano numérico
        const ano = parseInt(albumEscolhido.release_date.slice(0,4), 10) || 'Desconhecido';

        const albumData = {
          nome: albumEscolhido.name,
          artista: albumEscolhido.artists.map(a => a.name).join(', '),
          imagem: albumEscolhido.images[0]?.url || '',
          ano: ano,
          genero: genero,
          duracao: albumEscolhido.total_tracks || 'Desconhecido', // número de faixas
          descricao: `Álbum de ${genero}, lançado por ${albumEscolhido.artists[0].name}.`,
          spotifyUrl: albumEscolhido.external_urls.spotify,
        };

        return res.json(albumData);
      }
    }

    console.warn('⚠️ Nenhum álbum válido encontrado em nenhuma playlist');
    res.status(404).json({ error: 'Nenhum álbum válido encontrado' });

  } catch (error) {
    console.error('❌ Erro ao buscar álbum no Spotify:', error.message);
    if (error.response?.data) {
      console.error('Detalhe:', error.response.data);
    }
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
