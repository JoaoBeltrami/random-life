import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../utils/api";

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
      const res = await fetch(`${API_BASE_URL}/api/music/random`);
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
      className="min-h-screen flex flex-col items-center justify-center p-6"
      style={{
        background: "linear-gradient(135deg, #2ecc71 0%, #145a32 100%)",
      }}
    >
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 text-white hover:text-green-200 transition-colors duration-300"
      >
        <ArrowLeftIcon className="h-10 w-10" />
      </button>

      {loading && (
        <p className="text-white text-xl select-none mb-4">Carregando álbum...</p>
      )}

      {erro && (
        <p className="text-white text-xl mb-4">Erro ao carregar o álbum.</p>
      )}

      {!loading && !erro && !album && (
        <p className="text-white text-lg select-none">Nenhum álbum encontrado.</p>
      )}

      {album && (
        <motion.div
          key={album.nome}
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl flex flex-col overflow-hidden border-4 border-green-800"
        >
          <img
            src={album.imagem}
            alt={album.nome}
            className="w-full h-64 object-cover"
          />
          <div className="p-6 text-center">
            <h2 className="text-3xl font-bold text-green-800">{album.nome}</h2>
            <p className="text-md text-gray-700">{album.artista}</p>
            <p className="text-sm text-gray-600">{album.ano} • {album.genero}</p>
            <a
              href={album.spotifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 text-green-700 font-semibold hover:underline"
            >
              Ouvir no Spotify
            </a>
          </div>
        </motion.div>
      )}

      <button
        onClick={buscarAlbum}
        className="mt-8 bg-green-800 hover:bg-green-900 text-white py-3 px-8 rounded-2xl shadow-lg text-lg font-semibold transition-colors duration-300"
      >
        Tentar outro álbum
      </button>
    </div>
  );
};

export default Musica;
