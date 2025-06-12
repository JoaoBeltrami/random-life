const express = require('express');
const fetch = require('node-fetch');

const router = express.Router();

// Pega a Access Key do Unsplash do .env
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

// Lista de delivery (nomes simples)
const deliveryOptions = [
  "Pizza", "Hambúrguer", "Sushi", "Lasanha", "Churrasco",
  "Comida Mexicana", "Salada", "Sanduíche", "Frango Frito", "Tapioca"
];

// Rota que retorna só nomes (mantida)
router.get('/delivery', (req, res) => {
  res.json(deliveryOptions);
});

// Função para buscar imagem no Unsplash pelo termo (query)
async function fetchUnsplashImage(query) {
  try {
    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&client_id=${UNSPLASH_ACCESS_KEY}&per_page=1`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.results && data.results.length > 0) {
      // Pega a URL da imagem regular (ou a que preferir)
      return data.results[0].urls.regular;
    } else {
      // Retorna uma imagem genérica ou null se não achar
      return null;
    }
  } catch (error) {
    console.error('Erro ao buscar imagem no Unsplash:', error);
    return null;
  }
}

// Rota que retorna lista com nome + imagem real para delivery, buscando no Unsplash
router.get('/delivery/full', async (req, res) => {
  try {
    // Mapear os itens da lista para objetos com imagem do Unsplash
    const deliveryFull = await Promise.all(
      deliveryOptions.map(async (item) => {
        const image = await fetchUnsplashImage(item + " food"); // adiciona "food" para melhorar resultado
        return {
          name: item,
          image: image || 'https://via.placeholder.com/800x600?text=No+Image', // placeholder se não achar
        };
      })
    );
    res.json(deliveryFull);
  } catch (error) {
    console.error('Erro ao montar lista delivery/full:', error);
    res.status(500).json({ error: 'Erro ao buscar imagens delivery' });
  }
});

// Endpoint que retorna uma receita aleatória do TheMealDB (mantido)
router.get('/recipe', async (req, res) => {
  try {
    const response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
    const data = await response.json();
    if (!data.meals || data.meals.length === 0) {
      return res.status(404).json({ error: 'Nenhuma receita encontrada' });
    }
    const meal = data.meals[0];
    res.json({
      id: meal.idMeal,
      name: meal.strMeal,
      category: meal.strCategory,
      area: meal.strArea,
      instructions: meal.strInstructions,
      thumbnail: meal.strMealThumb,
      tags: meal.strTags?.split(',') || [],
      youtube: meal.strYoutube,
      ingredients: getIngredients(meal),
    });
  } catch (error) {
    console.error('Erro ao buscar receita:', error);
    res.status(500).json({ error: 'Erro ao buscar receita' });
  }
});

function getIngredients(meal) {
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ingredient && ingredient.trim()) {
      ingredients.push(`${measure?.trim() || ''} ${ingredient.trim()}`.trim());
    }
  }
  return ingredients;
}

module.exports = router;
