require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const moviesRouter = require('./movies');
const musicRouter = require('./music');
const booksRouter = require('./books');
const foodRouter = require('./food'); // <-- Novo

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

app.use('/api/movies', moviesRouter);
app.use('/api/music', musicRouter);
app.use('/api/books', booksRouter);
app.use('/api/food', foodRouter); // <-- Novo

const distPath = path.join(__dirname, '..', 'dist');
app.use(express.static(distPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`✅ Servidor rodando na porta ${PORT}`);
});
