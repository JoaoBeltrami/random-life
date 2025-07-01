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
        className="absolute top-6 left-6 text-white hover:text-red-300 transition-colors focus:outline-none focus:ring-2 focus:ring-white rounded-full p-1"
        aria-label="Voltar"
      >
        <ArrowLeftIcon className="h-10 w-10" />
      </button>

      {!view && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-6 text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold drop-shadow-lg">
            Escolha uma categoria
          </h1>
          <div className="flex flex-col sm:flex-row gap-4 mt-4 justify-center">
            <button
              onClick={startDelivery}
              className="bg-red-800 hover:bg-red-900 px-8 py-3 rounded-xl font-semibold shadow-lg transition-colors focus:ring-2 focus:ring-white"
            >
              Delivery
            </button>
            <button
              onClick={fetchRecipe}
              className="bg-red-800 hover:bg-red-900 px-8 py-3 rounded-xl font-semibold shadow-lg transition-colors focus:ring-2 focus:ring-white"
            >
              Prato
            </button>
          </div>
        </motion.div>
      )}

      {loading && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 text-lg drop-shadow-sm"
        >
          Carregando...
        </motion.p>
      )}

      {view === "delivery" && data && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="mt-10 flex flex-col items-center max-w-md w-full bg-red-800/90 backdrop-blur-sm rounded-xl p-6 shadow-2xl text-center cursor-pointer select-none"
          onClick={nextDelivery}
          title="Clique para ver outra comida"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">{data.name}</h2>
          <img
            src={data.image}
            alt={data.name}
            className="w-full h-96 object-cover rounded-xl border-4 border-red-200 shadow-lg mb-4"
          />
          <p className="opacity-80 mb-6 text-sm italic">
            Clique na imagem para ver outra comida
          </p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setView(null);
              setData(null);
              setDeliveryItems([]);
            }}
            className="bg-red-900 hover:bg-red-700 px-6 py-2 rounded-lg transition-colors focus:ring-2 focus:ring-white"
          >
            Voltar
          </button>
        </motion.div>
      )}

      {view === "recipe" && data && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-10 max-w-5xl w-full bg-red-800/90 backdrop-blur-sm rounded-xl p-6 shadow-2xl flex flex-col md:flex-row gap-6"
        >
          <img
            src={data.thumbnail}
            alt={data.name}
            className="w-full md:w-1/2 rounded-xl border-4 border-red-200 object-cover"
          />
          <div className="flex-1 text-white overflow-y-auto max-h-[32rem] pr-2">
            <h2 className="text-3xl font-bold mb-3">{data.name}</h2>

            <h3 className="text-lg font-semibold mt-4 mb-1">Ingredientes:</h3>
            <ul className="list-disc list-inside mb-4 text-sm space-y-1">
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
              className="mt-6 bg-red-900 hover:bg-red-700 px-6 py-2 rounded-lg transition-colors focus:ring-2 focus:ring-white"
            >
              Voltar
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
