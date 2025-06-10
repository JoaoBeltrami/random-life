require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const moviesRouter = require('./movies');
const musicRouter = require('./music');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

// Rotas da API
app.use('/api/movies', moviesRouter);
app.use('/api/music', musicRouter);

// Servir frontend (React)
const distPath = path.join(__dirname, '..', 'dist');
app.use(express.static(distPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`✅ Servidor rodando na porta ${PORT}`);
});
