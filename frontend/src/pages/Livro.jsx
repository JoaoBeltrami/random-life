import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";

const Livro = () => {
  const [livro, setLivro] = useState(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(false);
  const [historico, setHistorico] = useState([]);
  const navigate = useNavigate();

  const buscarLivro = async () => {
    setLoading(true);
    setErro(false);

    try {
      // Proxy do Vite já configurado, rota relativa basta
      const resposta = await fetch("/api/books/random-popular");
      if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);

      const data = await resposta.json();

      if (data && data.id && !historico.includes(data.id)) {
        setLivro(data);
        setHistorico((prev) => {
          const novoHist = [data.id, ...prev];
          return novoHist.slice(0, 30);
        });
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
      style={{ background: "linear-gradient(135deg, #FFD54F 0%, #FFB300 100%)" }}
    >
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 text-gray-900 hover:text-yellow-900 transition-colors duration-300"
        aria-label="Voltar"
      >
        <ArrowLeftIcon className="h-10 w-10" />
      </button>

      {loading && (
        <p className="text-gray-900 text-xl select-none">Carregando livro...</p>
      )}

      {erro && (
        <p className="text-red-700 text-lg select-none">
          Erro ao carregar o livro. Tente novamente ou atualize a página.
        </p>
      )}

      {livro && (
        <motion.div
          key={livro.id}
          initial={{ opacity: 0, rotateY: -90 }}
          animate={{ opacity: 1, rotateY: 0 }}
          exit={{ opacity: 0, rotateY: 90 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl w-full bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden border-4 border-yellow-700"
        >
          {livro.image && (
            <img
              src={livro.image}
              alt={livro.title}
              className="w-full md:w-1/3 object-cover"
              style={{ minHeight: "320px" }}
            />
          )}

          <div className="p-8 flex flex-col justify-between md:w-2/3 text-gray-900">
            <div>
              <h2 className="text-4xl font-serif font-semibold mb-4">
                {livro.title}
              </h2>
              <p className="text-lg italic mb-2 text-gray-700">
                Author: {livro.authors?.join(", ") || "Unknown"}
              </p>
              {livro.year && (
                <p className="text-md font-semibold mb-4 text-gray-700">
                  Year: {livro.year}
                </p>
              )}
              <p
                className="text-base font-medium leading-relaxed max-h-72 overflow-y-auto pr-2"
                style={{ scrollbarWidth: "thin" }}
              >
                {livro.description || "No description available."}
              </p>

              {livro.genres && livro.genres.length > 0 && (
                <p className="mt-4 italic text-gray-600">
                  Genres: {livro.genres.join(", ")}
                </p>
              )}

              {livro.pages && (
                <p className="mt-2 font-semibold text-gray-700">
                  Pages: {livro.pages}
                </p>
              )}
            </div>

            {livro.link && (
              <a
                href={livro.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-block text-center bg-yellow-800 hover:bg-yellow-900 text-white py-2 px-6 rounded-xl font-semibold shadow-md transition duration-300"
              >
                View on Open Library
              </a>
            )}
          </div>
        </motion.div>
      )}

      <button
        onClick={buscarLivro}
        disabled={loading}
        className="mt-8 bg-yellow-800 hover:bg-yellow-900 text-white py-3 px-8 rounded-2xl shadow-lg text-lg font-semibold transition-colors duration-300 disabled:opacity-50"
      >
        Try another book
      </button>
    </div>
  );
};

export default Livro;
