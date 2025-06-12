import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const containerVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    scale: 0.7,
    transition: { duration: 0.3, ease: "easeIn" },
  },
};

const Musica = () => {
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(false);
  const navigate = useNavigate();

  const buscarAlbum = async () => {
    try {
      setLoading(true);
      setErro(false);
      setAlbum(null);
      const res = await fetch(`${BASE_URL}/api/music/random`);
      const data = await res.json();
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
      className="min-h-screen flex flex-col items-center justify-center p-6 relative select-none"
      style={{
        background: "linear-gradient(135deg, #2ecc71 0%, #145a32 100%)",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
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
        <p className="text-white text-xl mb-6 animate-pulse">Carregando álbum...</p>
      )}
      {erro && (
        <p className="text-white text-xl mb-6">Erro ao carregar o álbum. Tente novamente.</p>
      )}
      {!loading && !erro && !album && (
        <p className="text-white text-lg mb-6">Nenhum álbum encontrado.</p>
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
            className="w-full max-w-4xl bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden border-4 border-green-900"
          >
            {/* Capa do álbum */}
            <div className="md:w-1/2 h-72 md:h-auto">
              <img
                src={album.imagem}
                alt={`Capa do álbum ${album.nome}`}
                className="w-full h-full object-cover"
                loading="lazy"
                draggable={false}
              />
            </div>

            {/* Informações do álbum */}
            <div className="p-8 flex flex-col justify-center text-center md:text-left md:w-1/2">
              <h2 className="text-4xl font-extrabold text-green-900 mb-3">{album.nome}</h2>
              <p className="text-xl text-gray-800 font-semibold mb-2">{album.artista}</p>
              <p className="text-sm text-gray-600 mb-4">
                {album.ano} • {album.genero} • {album.duracao} faixas
              </p>
              <a
                href={album.spotifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-auto text-green-800 font-semibold hover:text-green-600 underline transition-colors duration-300"
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
        className={`mt-10 px-10 py-3 rounded-3xl font-semibold text-white shadow-lg
          transition-colors duration-300
          ${loading ? "bg-green-500 cursor-not-allowed" : "bg-green-900 hover:bg-green-800"}
        `}
      >
        {loading ? "Carregando..." : "Tentar outro álbum"}
      </button>
    </div>
  );
};

export default Musica;
