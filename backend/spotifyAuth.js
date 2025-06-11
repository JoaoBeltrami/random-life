const axios = require('axios');
require('dotenv').config();

let accessToken = null;
let tokenExpiration = null;

async function getSpotifyToken() {
  const now = Date.now();

  if (accessToken && tokenExpiration && now < tokenExpiration) {
    return accessToken;
  }

  // Validar variáveis de ambiente
  if (!process.env.SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_CLIENT_SECRET) {
    throw new Error('SPOTIFY_CLIENT_ID ou SPOTIFY_CLIENT_SECRET não definidos nas variáveis de ambiente');
  }

  try {
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      'grant_type=client_credentials',
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: 'Basic ' + Buffer.from(
            `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
          ).toString('base64'),
        },
      }
    );

    accessToken = response.data.access_token;
    tokenExpiration = now + response.data.expires_in * 1000;

    console.log('🔑 Novo token do Spotify obtido. Expira em', response.data.expires_in, 'segundos.');

    return accessToken;

  } catch (error) {
    console.error('❌ Erro ao obter token do Spotify:', error.response?.data || error.message);
    throw new Error('Falha ao obter token do Spotify');
  }
}

module.exports = getSpotifyToken;
