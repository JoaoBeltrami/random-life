import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";

export default function Musica() {
  const navigate = useNavigate();
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains("dark")
  );
  const [clickCount, setClickCount] = useState(0);
  const [showFunnyMsg, setShowFunnyMsg] = useState(false);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const fetchAlbum = useCallback(async () => {
    setLoading(true);
    setError(null);
    setAlbum(null);
    setShowFunnyMsg(false);
    try {
      const res = await fetch(`/api/music/random?dark=${isDark}`);
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const data = await res.json();
      setAlbum(data);
      setClickCount(0); // zera contagem ao buscar novo álbum com sucesso
    } catch (err) {
      console.error(err);
      setError("Não foi possível carregar o álbum 😞");
    } finally {
      setLoading(false);
    }
  }, [isDark]);

  useEffect(() => {
    fetchAlbum();
  }, [fetchAlbum]);

  const handleClick = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);
    if (newCount >= 3) {
      setShowFunnyMsg(true);
      setTimeout(() => {
        setShowFunnyMsg(false);
        fetchAlbum();
      }, 1500);
    } else {
      fetchAlbum();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-800 to-black flex flex-col items-center py-12 px-6">
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 text-white hover:text-green-300"
        aria-label="Voltar"
      >
        <ArrowLeftIcon className="h-10 w-10" />
      </button>

      <AnimatePresence mode="wait">
        {loading && (
          <motion.p key="loading" className="text-white text-2xl font-medium animate-pulse">
            Carregando álbum...
          </motion.p>
        )}

        {error && (
          <motion.div key="error" className="bg-red-600 text-white p-4 rounded-lg shadow-lg">
            {error}
            <button className="mt-2 px-4 py-2 bg-red-700 rounded hover:bg-red-800"
                    onClick={fetchAlbum} disabled={loading}>
              Tentar novamente
            </button>
          </motion.div>
        )}

        {!loading && album && (
          <motion.div
            key={album.nome}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white dark:bg-gray-800/90 backdrop-blur-md p-8 rounded-3xl shadow-2xl border-4 border-green-700 dark:border-green-500 max-w-lg text-center"
          >
            <img
              src={album.imagem || "/placeholder-album.png"}
              alt={album.nome}
              className="mx-auto w-full max-w-xs h-auto rounded-lg shadow-xl mb-6"
              onError={e => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "/placeholder-album.png";
              }}
            />
            <h1 className="text-3xl font-extrabold text-green-800 dark:text-green-200 mb-2">
              {album.nome}
            </h1>
            <h2 className="text-xl text-gray-700 dark:text-gray-300 mb-4">
              {album.artista}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              {album.numeroFaixas} faixa{album.numeroFaixas !== 1 ? "s" : ""}
            </p>
            <a
              href={album.spotifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-green-600 text-white px-6 py-3 rounded-full font-bold shadow-md hover:bg-green-700 transition"
            >
              Ouvir no Spotify
            </a>

            {showFunnyMsg && (
              <p className="mt-4 text-sm text-green-300 italic">
                Calma aí, DJ! 🎧 Vamos variar um pouco...
              </p>
            )}

            <button
              onClick={handleClick}
              disabled={loading}
              className="mt-6 px-6 py-3 bg-green-700 hover:bg-green-800 text-white rounded-lg font-semibold shadow transition disabled:bg-gray-500"
            >
              {loading ? "Carregando..." : "Buscar outro álbum"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
