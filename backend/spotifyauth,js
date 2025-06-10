const axios = require('axios');
require('dotenv').config();

let accessToken = null;
let tokenExpiration = null;

async function getSpotifyToken() {
  const now = new Date().getTime();

  if (accessToken && tokenExpiration && now < tokenExpiration) {
    return accessToken;
  }

  const response = await axios.post(
    'https://accounts.spotify.com/api/token',
    'grant_type=client_credentials',
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization:
          'Basic ' +
          Buffer.from(
            process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET
          ).toString('base64'),
      },
    }
  );

  accessToken = response.data.access_token;
  tokenExpiration = now + response.data.expires_in * 1000;

  return accessToken;
}

module.exports = getSpotifyToken;
