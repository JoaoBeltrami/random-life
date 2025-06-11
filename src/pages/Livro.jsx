import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../utils/api"; // sua base da API backend

const Livro = () => {
  const [livro, setLivro] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(false);
  const navigate = useNavigate();

  const buscarLivro = async () => {
    setLoading(true);
    setErro(false);
    setLivro(null);

    try {
      const resposta = await fetch(`${API_BASE_URL}/api/books/random`);
      const data = await resposta.json();

      if (data && data.titulo) {
        setLivro(data);
      } else {
        setErro(true);
      }
    } catch (error) {
      console.error("Erro ao buscar livro:", error);
      setErro(true);
    }

    setLoading(false);
  };

  useEffect(() => {
    buscarLivro();
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6"
      style={{
        background: "linear-gradient(135deg, #FFD54F 0%, #FFB300 100%)",
      }}
    >
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 text-gray-900 hover:text-yellow-900 transition-colors duration-300"
        aria-label="Voltar"
      >
        <ArrowLeftIcon className="h-10 w-10" />
      </button>

      {loading && <p className="text-gray-900 text-xl select-none">Carregando livro...</p>}

      {erro && <p className="text-gray-900 text-lg select-none">Erro ao carregar o livro.</p>}

      {livro && (
        <motion.div
          key={livro.id}
          initial={{ opacity: 0, rotateY: -90 }}
          animate={{ opacity: 1, rotateY: 0 }}
          exit={{ opacity: 0, rotateY: 90 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl w-full bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden border-4 border-yellow-700"
        >
          {livro.imagem && (
            <img
              src={livro.imagem}
              alt={livro.titulo}
              className="w-full md:w-1/3 object-cover"
              style={{ minHeight: "320px" }}
            />
          )}

          <div className="p-8 flex flex-col justify-between md:w-2/3 text-gray-900">
            <div>
              <h2 className="text-4xl font-serif font-semibold mb-4">{livro.titulo}</h2>
              <p className="text-lg italic mb-8 text-gray-700">
                Autor: {livro.autores ? livro.autores.join(", ") : "Desconhecido"}
              </p>
              <p
                className="text-base font-semibold leading-relaxed max-h-72 overflow-y-auto pr-2 drop-shadow-md"
                style={{ scrollbarWidth: "thin" }}
              >
                {livro.descricao}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      <button
        onClick={buscarLivro}
        className="mt-8 bg-yellow-800 hover:bg-yellow-900 text-white py-3 px-8 rounded-2xl shadow-lg text-lg font-semibold transition-colors duration-300"
      >
        Tentar outro livro
      </button>
    </div>
  );
};

export default Livro;
