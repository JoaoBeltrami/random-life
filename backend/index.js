require('dotenv').config();
const express = require('express');
const cors = require('cors');
const moviesRouter = require('./movies');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Backend rodando certinho!');
});

// Usar o router para a rota /api/movies
app.use('/api/movies', moviesRouter);

app.listen(PORT, () => {
  console.log(`Backend rodando na porta ${PORT}`);
});
