const express = require('express');
const fetch = require('node-fetch');

const router = express.Router();

const deliveryOptions = [
  "Pizza", "Hambúrguer", "Sushi", "Lasanha", "Churrasco",
  "Comida Mexicana", "Salada", "Sanduíche", "Frango Frito", "Tapioca"
];

// Rota atual que retorna só nomes (mantida)
router.get('/delivery', (req, res) => {
  res.json(deliveryOptions);
});

// Nova rota que retorna lista com nome + imagem real para delivery
router.get('/delivery/full', (req, res) => {
  const deliveryFull = [
    {
      name: "Pizza Margherita",
      image: "https://images.unsplash.com/photo-1601924638867-3c7a1a4d1a1e?auto=format&fit=crop&w=800&q=80"
    },
    {
      name: "Sushi",
      image: "https://images.unsplash.com/photo-1562158070-6a3e6c5e2bc0?auto=format&fit=crop&w=800&q=80"
    },
    {
      name: "Hambúrguer Clássico",
      image: "https://images.unsplash.com/photo-1550317138-10000687a72b?auto=format&fit=crop&w=800&q=80"
    },
    {
      name: "Açaí na Tigela",
      image: "https://images.unsplash.com/photo-1588008361856-1e8264428bfb?auto=format&fit=crop&w=800&q=80"
    },
    {
      name: "Pastel de Feira",
      image: "https://images.unsplash.com/photo-1562967916-eb82221dfb32?auto=format&fit=crop&w=800&q=80"
    },
    {
      name: "Crepe Suíço",
      image: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=800&q=80"
    },
    {
      name: "Crepe Francês",
      image: "https://images.unsplash.com/photo-1505253210343-1b97a9aef7c3?auto=format&fit=crop&w=800&q=80"
    },
    {
      name: "Ramen",
      image: "https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=800&q=80"
    }
  ];
  res.json(deliveryFull);
});

// Mantém seu endpoint de receita
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
