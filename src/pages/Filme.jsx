import { useState, useEffect } from "react";
import movies from "../database/movies";
import { motion, AnimatePresence } from "framer-motion";

export default function Filme() {
  const [tries, setTries] = useState(0);
  const [message, setMessage] = useState("");
  const [movie, setMovie] = useState(getRandomMovie());
  const [imageIndex, setImageIndex] = useState(0);

  function getRandomMovie() {
    const index = Math.floor(Math.random() * movies.length);
    return movies[index];
  }

  function handleTryAgain() {
    const newTries = tries + 1;
    setTries(newTries);

    if (newTries > 2) {
      setMessage("Calma aí! Vai ficar escolhendo pra sempre? 😂");
      setTimeout(() => setMessage(""), 5000);
      setTries(0);
    }

    const newMovie = getRandomMovie();
    setMovie(newMovie);
    setImageIndex(0);
  }

  // Rotação de imagens a cada 3 segundos (se houver várias imagens)
  useEffect(() => {
    if (!Array.isArray(movie.image)) return;

    const interval = setInterval(() => {
      setImageIndex((prev) => (prev + 1) % movie.image.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [movie]);

  const displayedImage = Array.isArray(movie.image) ? movie.image[imageIndex] : movie.image;

  return (
    <div className="min-h-screen bg-purple-700 text-white flex flex-col items-center justify-center gap-6 p-6 relative overflow-hidden">
      {/* Sombra preta de fundo */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm z-0"></div>

      {/* Conteúdo principal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 flex flex-col items-center gap-6 max-w-md w-full"
      >
        <motion.h1
          className="text-4xl sm:text-5xl font-extrabold text-center drop-shadow-lg"
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          🎬 Filme Aleatório
        </motion.h1>

        {/* Imagem rotativa */}
        <AnimatePresence mode="wait">
          <motion.img
            key={displayedImage}
            src={displayedImage}
            alt={movie.title}
            className="w-72 sm:w-80 rounded-2xl shadow-2xl border-4 border-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          />
        </AnimatePresence>

        {/* Informações */}
        <motion.div
          className="bg-white text-purple-800 p-6 rounded-3xl shadow-2xl text-left space-y-3 text-base sm:text-lg w-full"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold">{movie.title} ({movie.year})</h2>
          <p><strong>🎬 Diretor:</strong> {movie.director}</p>
          <p><strong>🎞️ Gênero:</strong> {movie.genre}</p>
          <p><strong>📝 Sinopse:</strong> {movie.synopsis}</p>
        </motion.div>

        {/* Botão */}
        <motion.button
          onClick={handleTryAgain}
          className="bg-white text-purple-800 text-lg px-8 py-4 rounded-2xl shadow-lg font-semibold hover:scale-105 transition-transform"
          whileTap={{ scale: 0.95 }}
        >
          Escolher Outro
        </motion.button>

        {/* Mensagem */}
        <AnimatePresence>
          {message && (
            <motion.div
              className="bg-yellow-400 text-purple-900 font-semibold px-4 py-2 rounded shadow-lg text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {message}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
