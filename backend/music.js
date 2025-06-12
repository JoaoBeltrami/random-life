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

        // Pegar álbuns únicos
        const albunsUnicos = [];
        const nomesVistos = new Set();

        // Cache para gêneros dos artistas
        const artistGenresCache = new Map();

        // Função para buscar gêneros do artista
        async function getArtistGenres(artistId) {
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
          } catch {
            return [];
          }
        }

        const albunsComGeneros = [];

        for (const item of tracks) {
          const album = item?.track?.album;
          if (!album) continue;
          const nome = album.name || '';
          if (nomesVistos.has(nome)) continue;

          // Buscar gêneros dos artistas do álbum
          let generosDoAlbum = [];
          for (const artist of album.artists || []) {
            const generos = await getArtistGenres(artist.id);
            generosDoAlbum = generosDoAlbum.concat(generos);
          }
          generosDoAlbum = [...new Set(generosDoAlbum.map(g => g.toLowerCase()))];

          // Excluir gêneros indesejados: sertanejo e pagode
          if (generosDoAlbum.some(g => g.includes('sertanejo') || g.includes('pagode'))) continue;

          nomesVistos.add(nome);
          albunsComGeneros.push({ album, generos: generosDoAlbum });
        }

        if (albunsComGeneros.length === 0) continue;

        // Filtrar para ~95% internacionais (exclui gêneros com "brazil" ou "brasil")
        const internacionais = albunsComGeneros.filter(({ generos }) =>
          !generos.some(g => g.includes('brazil') || g.includes('brasil'))
        );

        const candidatos = internacionais.length >= albunsComGeneros.length * 0.95
          ? internacionais
          : albunsComGeneros;

        // Ponderar gêneros favoritos: metal, rock, pop
        const favorecidos = ['metal', 'rock', 'pop'];
        const ponderado = [];

        for (const { album, generos } of candidatos) {
          const eFavorito = favorecidos.some(fav => generos.some(g => g.includes(fav)));
          if (eFavorito) {
            ponderado.push(album, album, album, album); // mais peso
          } else {
            ponderado.push(album);
          }
        }

        // Escolher um álbum válido aleatório
        const albumEscolhido = shuffleArray(ponderado).find(album =>
          album?.name &&
          album?.artists?.length &&
          album?.images?.length &&
          album?.external_urls?.spotify
        ) || candidatos[0].album;

        if (!albumEscolhido) continue;

        const albumData = {
          nome: albumEscolhido.name || 'Nome não disponível',
          artista: albumEscolhido.artists.map(a => a.name).join(', ') || 'Artista não disponível',
          imagem: albumEscolhido.images[0]?.url || '',
          numeroFaixas: albumEscolhido.total_tracks || 0,
          spotifyUrl: albumEscolhido.external_urls.spotify || '',
        };

        console.log(`Álbum retornado: ${albumData.nome} - ${albumData.artista}`);
        return res.json(albumData);
      }
    }

    res.status(404).json({ error: 'Nenhum álbum válido encontrado após várias tentativas' });
  } catch (error) {
    console.error('Erro ao buscar álbum no Spotify:', error.message);
    res.status(500).json({ error: 'Erro ao buscar álbum no Spotify' });
  }
});

// Função para embaralhar array
function shuffleArray(array) {
  const a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

module.exports = router;
