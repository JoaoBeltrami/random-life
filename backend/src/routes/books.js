const express = require('express');
const axios = require('axios');
require('dotenv').config();

const router = express.Router();

const GOOGLE_BOOKS_API_KEY = process.env.GOOGLE_BOOKS_API_KEY;

// Termos aleatórios para buscar livros variados
const termosBusca = ['fiction', 'science', 'history', 'fantasy', 'adventure', 'philosophy', 'romance', 'technology'];

function termoAleatorio() {
  return termosBusca[Math.floor(Math.random() * termosBusca.length)];
}

router.get('/random', async (req, res) => {
  try {
    const query = termoAleatorio();

    const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&key=${GOOGLE_BOOKS_API_KEY}&maxResults=20`;

    const response = await axios.get(url);

    const items = response.data.items;

    if (!items || items.length === 0) {
      return res.status(404).json({ error: 'Nenhum livro encontrado' });
    }

    // Pega um livro aleatório da lista
    const livro = items[Math.floor(Math.random() * items.length)];

    // Extrai informações essenciais e garante valores default se faltar algo
    const info = livro.volumeInfo || {};

    const resultado = {
      id: livro.id,
      titulo: info.title || 'Título indisponível',
      autores: info.authors || ['Autor desconhecido'],
      descricao: info.description || 'Sem descrição disponível',
      ano: info.publishedDate ? info.publishedDate.slice(0, 4) : 'Ano desconhecido',
      imagem: info.imageLinks ? info.imageLinks.thumbnail : null,
      link: info.infoLink || null,
      categorias: info.categories || [],
    };

    res.json(resultado);
  } catch (error) {
    console.error('Erro ao buscar livro no Google Books:', error.message);
    res.status(500).json({ error: 'Erro ao buscar livro' });
  }
});

module.exports = router;
