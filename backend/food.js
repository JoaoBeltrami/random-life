const express = require('express');
const fetch = require('node-fetch');

const router = express.Router();

// Pega a Access Key do Unsplash do .env
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

// Lista de delivery (nomes simples)
const deliveryOptions = [
  "Pizza",
  "Hambúrguer",
  "Sushi",
  "Lasanha",
  "Churrasco",
  "Comida Mexicana",
  "Salada",
  "Sanduíche",
  "Frango Frito",
  "Tapioca",
  "Pastel",
  "Crepe",
  "Açaí",
  "Risoto",
  "Moqueca",
  "Coxinha",
  "Feijoada",
  "Empanada",
  "Yakisoba",
  "Burrito",
  "Falafel",
  "Pho",
  "Kibe",
  "Panqueca",
  "Hot Dog",
  "Batata Recheada",
  "Temaki"
];

// Rota que retorna só nomes (mantida para simplicidade)
router.get('/delivery', (req, res) => {
  res.json(deliveryOptions);
});

// Função utilitária para embaralhar array (Fisher-Yates)
function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Busca imagem no Unsplash pelo termo
async function fetchUnsplashImage(query) {
  try {
    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&client_id=${UNSPLASH_ACCESS_KEY}&per_page=1`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.results && data.results.length > 0) {
      return data.results[0].urls.regular;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Erro ao buscar imagem no Unsplash:', error);
    return null;
  }
}

// Rota que retorna lista com nome + imagem (embaralhada)
router.get('/delivery/full', async (req, res) => {
  try {
    const shuffledOptions = shuffleArray(deliveryOptions);

    const deliveryFull = await Promise.all(
      shuffledOptions.map(async (item) => {
        const image = await fetchUnsplashImage(item + " food");
        return {
          name: item,
          image: image || 'https://via.placeholder.com/800x600?text=No+Image',
        };
      })
    );

    res.json(deliveryFull);
  } catch (error) {
    console.error('Erro ao montar lista delivery/full:', error);
    res.status(500).json({ error: 'Erro ao buscar imagens delivery' });
  }
});

// Rota de receita aleatória (mantida)
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

// Extrai ingredientes e medidas
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
