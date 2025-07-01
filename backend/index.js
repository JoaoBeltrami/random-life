require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

// Caminhos corrigidos com base na nova estrutura
const moviesRouter = require('./src/routes/movies');
const musicRouter = require('./src/routes/music');
const booksRouter = require('./src/routes/books');
const foodRouter = require('./src/routes/food');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

app.use('/api/movies', moviesRouter);
app.use('/api/music', musicRouter);
app.use('/api/books', booksRouter);
app.use('/api/food', foodRouter);

// Serve arquivos estáticos do frontend
const distPath = path.join(__dirname, '..', 'frontend', 'dist');
app.use(express.static(distPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`✅ Servidor rodando na porta ${PORT}`);
});
