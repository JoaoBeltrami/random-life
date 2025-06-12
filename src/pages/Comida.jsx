import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export default function Comida() {
  const [view, setView] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deliveryItems, setDeliveryItems] = useState([]);
  const [deliveryIndex, setDeliveryIndex] = useState(0);
  const navigate = useNavigate();

  async function fetchRecipe() {
    setLoading(true);
    setView("recipe");
    try {
      const res = await fetch(`${BASE_URL}/api/food/recipe`);
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error("Erro ao buscar receita:", err);
    }
    setLoading(false);
  }

  async function startDelivery() {
    setLoading(true);
    setView("delivery");
    setDeliveryIndex(0);
    try {
      const res = await fetch(`${BASE_URL}/api/food/delivery/full`);
      const json = await res.json();
      setDeliveryItems(json);
      if (json.length > 0) {
        setData(json[0]);
      } else {
        setData(null);
      }
    } catch (err) {
      console.error("Erro ao buscar delivery:", err);
      setData(null);
    }
    setLoading(false);
  }

  function nextDelivery() {
    if (deliveryItems.length === 0) return;
    setDeliveryIndex((prev) => {
      const nextIndex = (prev + 1) % deliveryItems.length;
      setData(deliveryItems[nextIndex]);
      return nextIndex;
    });
  }

  return (
    <div
      className="min-h-screen p-6 flex flex-col items-center justify-center text-white"
      style={{
        background: "linear-gradient(135deg, #EF5350 0%, #B71C1C 100%)",
      }}
    >
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 text-white hover:text-red-300 transition-colors"
        aria-label="Voltar"
      >
        <ArrowLeftIcon className="h-10 w-10" />
      </button>

      {!view && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-6"
        >
          <h1 className="text-4xl font-bold mb-6 drop-shadow-lg text-center">
            Escolha uma categoria
          </h1>
          <button
            onClick={startDelivery}
            className="bg-red-800 hover:bg-red-900 px-8 py-3 rounded-xl font-semibold shadow-lg transition-colors"
          >
            Delivery
          </button>
          <button
            onClick={fetchRecipe}
            className="bg-red-800 hover:bg-red-900 px-8 py-3 rounded-xl font-semibold shadow-lg transition-colors"
          >
            Prato
          </button>
        </motion.div>
      )}

      {loading && <p className="mt-6 text-lg drop-shadow-sm">Carregando...</p>}

      {view === "delivery" && data && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="mt-8 flex flex-col items-center max-w-md w-full bg-red-800 rounded-xl p-6 shadow-lg text-center cursor-pointer select-none"
          onClick={nextDelivery}
          title="Clique para ver outra comida"
        >
          <h2 className="text-4xl font-bold mb-6">{data.name}</h2>
          <img
            src={data.image}
            alt={data.name}
            className="w-full h-96 object-cover rounded-xl shadow-2xl mb-4"
          />
          <p className="opacity-80 mb-6 text-sm">Clique na imagem para ver outra comida</p>
          <button
            onClick={(e) => {
              e.stopPropagation(); // evitar troca ao clicar no botão
              setView(null);
              setData(null);
              setDeliveryItems([]);
            }}
            className="bg-red-900 hover:bg-red-800 px-6 py-2 rounded-lg transition-colors"
          >
            Voltar
          </button>
        </motion.div>
      )}

      {view === "recipe" && data && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8 max-w-4xl w-full bg-red-800 rounded-xl p-6 shadow-2xl flex flex-col md:flex-row gap-6"
        >
          <img
            src={data.thumbnail}
            alt={data.name}
            className="w-full md:w-1/2 rounded-lg object-cover"
          />
          <div className="flex-1 text-white">
            <h2 className="text-3xl font-bold mb-2">{data.name}</h2>

            <h3 className="text-lg font-semibold mt-4 mb-1">Ingredientes:</h3>
            <ul className="list-disc list-inside mb-4 text-sm">
              {data.ingredients.map((ing, i) => (
                <li key={i}>{ing}</li>
              ))}
            </ul>

            <h3 className="text-lg font-semibold mb-1">Instruções:</h3>
            <p className="text-sm whitespace-pre-line">{data.instructions}</p>

            <button
              onClick={() => {
                setView(null);
                setData(null);
              }}
              className="mt-6 bg-red-900 hover:bg-red-700 px-6 py-2 rounded-lg transition"
            >
              Voltar
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
