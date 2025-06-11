import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Comida() {
  const [view, setView] = useState(null); // 'delivery' ou 'recipe'
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function fetchDelivery() {
    setLoading(true);
    setView('delivery');
    const res = await fetch('/api/food/delivery');
    const json = await res.json();
    setData(json);
    setLoading(false);
  }

  async function fetchRecipe() {
    setLoading(true);
    setView('recipe');
    const res = await fetch('/api/food/recipe');
    const json = await res.json();
    setData(json);
    setLoading(false);
  }

  return (
    <div className="min-h-screen p-6 flex flex-col items-center justify-center bg-gradient-to-r from-red-600 to-red-900 text-white">
      {!view && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-6"
        >
          <h1 className="text-4xl font-bold mb-6">Escolha uma categoria</h1>
          <button
            onClick={fetchDelivery}
            className="bg-red-800 px-8 py-3 rounded-xl font-semibold shadow-lg"
          >
            Delivery
          </button>
          <button
            onClick={fetchRecipe}
            className="bg-red-800 px-8 py-3 rounded-xl font-semibold shadow-lg"
          >
            Prato
          </button>
        </motion.div>
      )}

      {loading && <p>Carregando...</p>}

      {view === 'delivery' && data && (
        <motion.ul
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8 space-y-3 max-w-md"
        >
          {data.map((item, i) => (
            <li
              key={i}
              className="bg-red-700 rounded-lg p-3 shadow-md text-center font-semibold"
            >
              {item}
            </li>
          ))}
          <button
            onClick={() => { setView(null); setData(null); }}
            className="mt-6 bg-red-900 px-6 py-2 rounded-lg"
          >
            Voltar
          </button>
        </motion.ul>
      )}

      {view === 'recipe' && data && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8 max-w-lg bg-red-800 rounded-xl p-6 shadow-lg overflow-auto"
          style={{ maxHeight: '70vh' }}
        >
          <h2 className="text-3xl font-bold mb-3">{data.name}</h2>
          <img src={data.thumbnail} alt={data.name} className="w-full rounded-lg mb-4" />
          <h3 className="font-semibold mb-2">Ingredientes:</h3>
          <ul className="list-disc list-inside mb-4">
            {data.ingredients.map((ing, i) => (
              <li key={i}>{ing}</li>
            ))}
          </ul>
          <h3 className="font-semibold mb-2">Instruções:</h3>
          <p className="whitespace-pre-line">{data.instructions}</p>
          <button
            onClick={() => { setView(null); setData(null); }}
            className="mt-6 bg-red-900 px-6 py-2 rounded-lg"
          >
            Voltar
          </button>
        </motion.div>
      )}

      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 text-white hover:text-red-300 transition-colors"
        aria-label="Voltar para home"
      >
        ←
      </button>
    </div>
  );
}
