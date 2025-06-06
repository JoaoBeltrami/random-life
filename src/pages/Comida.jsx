import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";

const comidas = [
  "Pizza",
  "Sushi",
  "Hambúrguer",
  "Comida Mexicana",
  "Pastel",
  "Churrasco",
  "Coxinha",
  "Frango Frito",
  "Açaí",
  "Massas Italianas",
  "Ramen",
  "Feijoada",
  "Tapioca",
  "Bolo de Chocolate",
  "Salada Caesar",
];

const gerarImagem = (nomePrato) =>
  `https://source.unsplash.com/800x600/?${encodeURIComponent(nomePrato)},food`;

const Comida = () => {
  const [comida, setComida] = useState(null);
  const navigate = useNavigate();

  const escolherComida = () => {
    const nome = comidas[Math.floor(Math.random() * comidas.length)];
    const imagem = gerarImagem(nome);
    setComida({ nome, imagem });
  };

  useEffect(() => {
    escolherComida();
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6"
      style={{
        background: "linear-gradient(135deg, #FF6B6B 0%, #B71C1C 100%)",
      }}
    >
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 text-white hover:text-red-200 transition-colors duration-300"
      >
        <ArrowLeftIcon className="h-10 w-10" />
      </button>

      {comida && (
        <motion.div
          key={comida.nome + Date.now()}
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl flex flex-col overflow-hidden border-4 border-red-800"
        >
          <img
            src={comida.imagem}
            alt={comida.nome}
            className="w-full h-64 object-cover"
          />
          <div className="p-6 text-center">
            <h2 className="text-4xl font-bold text-red-800">{comida.nome}</h2>
          </div>
        </motion.div>
      )}

      <button
        onClick={escolherComida}
        className="mt-8 bg-red-800 hover:bg-red-900 text-white py-3 px-8 rounded-2xl shadow-lg text-lg font-semibold transition-colors duration-300"
      >
        Tentar outro prato
      </button>
    </div>
  );
};

export default Comida;
