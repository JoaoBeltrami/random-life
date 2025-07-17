const express = require('express');
const fetch = require('node-fetch');
const router = express.Router();

const popularBooks = [
  'OL45804W', // Pride and Prejudice
  'OL27448W', // 1984
  'OL82563W', // The Great Gatsby
  'OL262758W', // Moby-Dick
  'OL15379W', // The Catcher in the Rye
  'OL15885W', // To Kill a Mockingbird
  'OL1060743W', // War and Peace
  'OL362427W', // Jane Eyre
  'OL2090991W', // Harry Potter and the Sorcerer's Stone
  'OL3190225W' // The Hobbit
];

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} - ${res.statusText}`);
  return res.json();
}

const MAX_ATTEMPTS = 25;

router.get('/random-popular', async (req, res) => {
  try {
    for (let i = 0; i < MAX_ATTEMPTS; i++) {
      const randomId = popularBooks[Math.floor(Math.random() * popularBooks.length)];
      const workUrl = `https://openlibrary.org/works/${randomId}.json`;

      const data = await fetchJson(workUrl);

      // Pega a descrição, pode ser string ou objeto com 'value'
      let description = null;
      if (data.description) {
        if (typeof data.description === 'string' && data.description.trim() !== '') {
          description = data.description.trim();
        } else if (
          typeof data.description === 'object' &&
          data.description.value &&
          data.description.value.trim() !== ''
        ) {
          description = data.description.value.trim();
        }
      }

      // Se não tiver descrição, tenta outro livro
      if (!description) continue;

      // Busca autores
      const authors = [];
      if (data.authors && Array.isArray(data.authors)) {
        for (const a of data.authors) {
          try {
            const authorData = await fetchJson(`https://openlibrary.org${a.author.key}.json`);
            if (authorData.name) authors.push(authorData.name);
          } catch {
            // ignora erro de autor
          }
        }
      }

      const coverId = data.covers?.[0];
      const image = coverId
        ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`
        : null;

      return res.json({
        id: data.key,
        title: data.title || 'Unknown title',
        authors,
        description,
        image,
        link: `https://openlibrary.org${data.key}`,
      });
    }

    res.status(404).json({ error: 'Nenhum livro com descrição encontrado após várias tentativas.' });
  } catch (error) {
    console.error('Erro ao buscar livro:', error.message);
    res.status(500).json({ error: 'Erro ao buscar livro' });
  }
});

module.exports = router;
