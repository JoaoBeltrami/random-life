import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeftIcon, ArrowPathIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const containerVariants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    transition: { duration: 0.4, ease: "easeIn" },
  },
};

const Musica = () => {
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(false);
  const navigate = useNavigate();

  const buscarAlbum = async () => {
    setLoading(true);
    setErro(false);
    setAlbum(null);

    try {
      const res = await fetch(`${BASE_URL}/api/music/random`);
      if (!res.ok) throw new Error("Erro na resposta do servidor");
      const data = await res.json();

      if (
        !data.nome ||
        !data.artista ||
        !data.imagem ||
        !data.numeroFaixas ||
        !data.spotifyUrl
      ) {
        throw new Error("Dados incompletos recebidos");
      }

      setAlbum(data);
    } catch (error) {
      console.error("Erro ao buscar álbum:", error);
      setErro(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    buscarAlbum();
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-8 relative select-none"
      style={{
        background: "linear-gradient(135deg, #27ae60 0%, #145a32 100%)",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
      aria-live="polite"
      aria-busy={loading}
    >
      {/* Botão Voltar */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 text-white hover:text-green-300 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-green-400 rounded"
        aria-label="Voltar para a página inicial"
      >
        <ArrowLeftIcon className="h-10 w-10" />
      </button>

      {/* Mensagens de status */}
      {loading && (
        <p
          className="text-white text-2xl font-semibold mb-8 animate-pulse"
          role="alert"
        >
          Carregando álbum...
        </p>
      )}
      {erro && (
        <p className="text-red-300 text-2xl font-semibold mb-8" role="alert">
          Erro ao carregar o álbum. Tente novamente.
        </p>
      )}
      {!loading && !erro && !album && (
        <p className="text-white text-xl mb-8" role="alert">
          Nenhum álbum encontrado.
        </p>
      )}

      {/* Card do álbum com animação */}
      <AnimatePresence mode="wait">
        {album && !loading && !erro && (
          <motion.div
            key={album.nome}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full max-w-4xl bg-white/90 backdrop-blur-md rounded-3xl shadow-lg flex flex-col md:flex-row overflow-hidden border-4 border-green-900"
          >
            {/* Capa do álbum */}
            <div className="md:w-1/2 h-80 md:h-auto overflow-hidden rounded-l-3xl">
              <img
                src={album.imagem}
                alt={`Capa do álbum ${album.nome}`}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                loading="lazy"
                draggable={false}
              />
            </div>

            {/* Informações do álbum */}
            <div className="p-10 flex flex-col justify-center text-center md:text-left md:w-1/2">
              <h2 className="text-5xl font-extrabold text-green-900 mb-3 drop-shadow-md">
                {album.nome}
              </h2>
              <p className="text-3xl text-gray-900 font-semibold mb-4 drop-shadow-sm">
                {album.artista}
              </p>
              <p className="text-lg text-gray-700 mb-8 tracking-wide">
                {album.numeroFaixas} {album.numeroFaixas === 1 ? "faixa" : "faixas"}
              </p>
              <a
                href={album.spotifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-auto px-8 py-4 rounded-full bg-green-800 text-white font-extrabold hover:bg-green-700 shadow-lg transition-colors duration-300"
                aria-label={`Ouvir o álbum ${album.nome} no Spotify`}
              >
                Ouvir no Spotify
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botão "Tentar outro" */}
      <button
        onClick={buscarAlbum}
        disabled={loading}
        className={`mt-14 px-16 py-5 rounded-3xl font-extrabold text-white shadow-lg
          transition-colors duration-300 flex items-center justify-center gap-3
          ${
            loading
              ? "bg-green-500 cursor-not-allowed"
              : "bg-green-900 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-400"
          }
        `}
        aria-label="Buscar outro álbum aleatório"
      >
        {loading ? (
          <>
            Carregando...
            <svg
              className="animate-spin h-6 w-6 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
          </>
        ) : (
          <>
            <ArrowPathIcon className="h-6 w-6" />
            Tentar outro álbum
          </>
        )}
      </button>
    </div>
  );
};

export default Musica;
