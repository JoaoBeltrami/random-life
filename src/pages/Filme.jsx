import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function Filme() {
  const [movie, setMovie] = useState(null);
  const [clickCount, setClickCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    getRandomMovie();
  }, []);

  async function getRandomMovie() {
    try {
      const response = await (fetch(import.meta.env.VITE_API_URL + "/api/filmes"));
      if (!response.ok) {
        throw new Error("Erro ao buscar filme do backend");
      }
      const movie = await response.json();
      console.log("Filme recebido:", movie);
      setMovie(movie);
    } catch (error) {
      console.error("Erro ao buscar filme:", error);
      setMovie(null);
    }
  }

  const handleRetry = () => {
    setClickCount((prev) => prev + 1);
    getRandomMovie();
  };

  const retryMessage =
    clickCount >= 2 ? "Tá difícil decidir hoje, hein? 😅" : null;

  return (
    <div
      className="relative flex items-center justify-center min-h-screen px-4"
      style={{
        background: `radial-gradient(circle at center, #8b5cf6 0%, #5b21b6 60%, #2c0969 100%)`,
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      {/* Botão de voltar */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-4 left-4 text-white hover:text-zinc-300 transition-colors"
      >
        <ArrowLeft size={32} />
      </button>

      <AnimatePresence mode="wait">
        {movie && (
          <motion.div
            key={movie.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="flex flex-col md:flex-row bg-zinc-900/90 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden max-w-6xl w-full border border-zinc-700"
          >
            {/* Imagem */}
            <motion.img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="w-full md:w-1/2 object-cover brightness-95"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
              transition={{ duration: 0.4 }}
            />

            {/* Texto */}
            <motion.div
              className="p-8 md:w-1/2 flex flex-col justify-between gap-4 text-white"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 50, opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div>
                <h2 className="text-3xl font-bold mb-3 leading-snug">
                  {movie.title}
                </h2>
                <p className="text-lg text-gray-300 mb-1">
                  <span className="text-blue-400 font-semibold">
                    ⭐ {movie.vote_average?.toFixed(1)}
                  </span>{" "}
                  • 🎬 {movie.release_date?.split("-")[0]} • 🕒{" "}
                  {movie.runtime} min
                </p>
                <p className="text-md text-gray-300 font-semibold italic mb-4">
                  {movie.genres?.map((g) => g.name).join(", ")}
                </p>
                <p className="text-base font-semibold text-white leading-relaxed drop-shadow-md">
                  {movie.overview}
                </p>
              </div>

              <div className="mt-6 flex flex-col items-center">
                <motion.button
                  onClick={handleRetry}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 px-5 py-3 rounded-xl text-white font-semibold shadow-md transition-all duration-300 w-full"
                >
                  Tentar novamente
                </motion.button>
                {retryMessage && (
                  <p className="text-sm text-gray-400 mt-3">{retryMessage}</p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
