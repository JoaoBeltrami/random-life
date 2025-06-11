const express = require('express');
const fetch = require('node-fetch');

const router = express.Router();

const deliveryOptions = [
  "Pizza", "Hambúrguer", "Sushi", "Lasanha", "Churrasco",
  "Comida Mexicana", "Salada", "Sanduíche", "Frango Frito", "Tapioca"
];

router.get('/delivery', (req, res) => {
  res.json(deliveryOptions);
});

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
