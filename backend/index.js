require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const moviesRouter = require('./movies');
const musicRouter = require('./music');
app.use('/api/music', musicRouter);


const app = express();
const PORT = process.env.PORT || 10000;

// Habilita CORS e JSON
app.use(cors());
app.use(express.json());

// Rota da API
app.use('/api/movies', moviesRouter);

// Servir arquivos estáticos da pasta dist
const distPath = path.join(__dirname, '..', 'dist');
app.use(express.static(distPath));

// Rota fallback (SPA do React)
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
