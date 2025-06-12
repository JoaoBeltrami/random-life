const express = require('express');
const axios = require('axios');
const getSpotifyToken = require('./spotifyAuth');

const router = express.Router();

const MAX_ATTEMPTS = 5;

// Gêneros permitidos para cada modo
const GENEROS_DARK = ['metal', 'rock', 'heavy', 'hard'];
const GENEROS_LIGHT = ['pop', 'rap', 'indie', 'acoustic', 'soft'];

// Gêneros indesejados
const GENEROS_INDESEJADOS = ['sertanejo', 'pagode'];

// Função para embaralhar array
function shuffleArray(array) {
  const a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Cache global de gêneros dos artistas para o ciclo da requisição
const artistGenresCache = new Map();

/**
 * Busca os gêneros de um artista pelo ID usando cache para otimizar
 */
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

/**
 * Verifica se o álbum possui pelo menos um gênero permitido
 */
function albumHasAllowedGenre(albumGenres, allowedGenres) {
  return albumGenres.some(g =>
    allowedGenres.some(permitido => g.includes(permitido))
  );
}

/**
 * Verifica se o álbum possui algum gênero indesejado
 */
function albumHasDisallowedGenre(albumGenres) {
  return albumGenres.some(g =>
    GENEROS_INDESEJADOS.some(indesejado => g.includes(indesejado))
  );
}

/**
 * Filtra álbuns conforme gêneros permitidos e indesejados, buscando gêneros dos artistas
 */
async function filterAlbumsByGenre(tracks, token, allowedGenres) {
  const seenAlbumNames = new Set();
  const filteredAlbums = [];

  for (const item of tracks) {
    const album = item?.track?.album;
    if (!album || !album.artists) continue;

    const albumName = album.name || '';
    if (seenAlbumNames.has(albumName)) continue;

    // Buscar gêneros dos artistas do álbum
    let albumGenres = [];
    for (const artist of album.artists) {
      const genres = await getArtistGenres(artist.id, token);
      albumGenres = albumGenres.concat(genres);
    }
    albumGenres = [...new Set(albumGenres.map(g => g.toLowerCase()))];

    if (albumHasDisallowedGenre(albumGenres)) continue;
    if (!albumHasAllowedGenre(albumGenres, allowedGenres)) continue;

    seenAlbumNames.add(albumName);
    filteredAlbums.push({ album, genres: albumGenres });
  }

  return filteredAlbums;
}

/**
 * Filtra os álbuns para dar preferência aos internacionais (~95%)
 */
function filterInternationalAlbums(albums) {
  const internacionais = albums.filter(({ genres }) =>
    !genres.some(g => g.includes('brazil') || g.includes('brasil'))
  );

  if (internacionais.length >= albums.length * 0.95) {
    return internacionais;
  }
  return albums;
}

/**
 * Aplica ponderação nos álbuns para favorecer gêneros específicos
 */
function weightAlbums(albums, favoredGenres) {
  const weighted = [];
  for (const { album, genres } of albums) {
    const isFavored = favoredGenres.some(fav =>
      genres.some(g => g.includes(fav))
    );
    if (isFavored) {
      weighted.push(album, album, album, album); // Peso extra
    } else {
      weighted.push(album);
    }
  }
  return weighted;
}

router.get('/random', async (req, res) => {
  try {
    const token = await getSpotifyToken();
    if (!token) throw new Error('Token Spotify ausente ou inválido');

    const isDark = req.query.dark === 'true';

    const allowedGenres = isDark ? GENEROS_DARK : GENEROS_LIGHT;
    const favoredGenres = allowedGenres; // mesma lista para ponderar

    let attempt = 0;

    while (attempt < MAX_ATTEMPTS) {
      attempt++;

      // Busca playlists contendo álbuns
      const playlistsRes = await axios.get(
        `https://api.spotify.com/v1/search?q=album&type=playlist&limit=10&market=BR`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const playlists = playlistsRes.data?.playlists?.items || [];
      if (playlists.length === 0) {
        console.warn(`Tentativa ${attempt}: Nenhuma playlist encontrada`);
        continue;
      }

      for (const playlist of shuffleArray(playlists)) {
        if (!playlist?.id) continue;

        // Busca tracks da playlist
        const tracksRes = await axios.get(
          `https://api.spotify.com/v1/playlists/${playlist.id}/tracks?limit=100&market=BR`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const tracks = tracksRes.data?.items || [];

        // Limpa cache para cada playlist (opcional)
        artistGenresCache.clear();

        // Filtra álbuns conforme gêneros
        const filteredAlbums = await filterAlbumsByGenre(tracks, token, allowedGenres);
        if (filteredAlbums.length === 0) continue;

        // Prefere álbuns internacionais
        const candidates = filterInternationalAlbums(filteredAlbums);

        // Aplica ponderação para favoritos
        const weightedAlbums = weightAlbums(candidates, favoredGenres);

        // Escolhe um álbum aleatório válido
        const chosenAlbum = shuffleArray(weightedAlbums).find(album =>
          album?.name &&
          album?.artists?.length &&
          album?.images?.length &&
          album?.external_urls?.spotify
        ) || candidates[0].album;

        if (!chosenAlbum) continue;

        // Dados formatados do álbum
        const albumData = {
          nome: chosenAlbum.name || 'Nome não disponível',
          artista: chosenAlbum.artists.map(a => a.name).join(', ') || 'Artista não disponível',
          imagem: chosenAlbum.images[0]?.url || '',
          numeroFaixas: chosenAlbum.total_tracks || 0,
          spotifyUrl: chosenAlbum.external_urls.spotify || '',
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

module.exports = router;
