import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import pageFlipSound from "/sounds/page-flip.mp3"; // Ajuste o caminho se precisar


const mockMusic = [
  {
    title: "Bohemian Rhapsody",
    artist: "Queen",
    genre: "Rock",
    cover: "https://upload.wikimedia.org/wikipedia/en/9/9f/Bohemian_Rhapsody.png",
  },
  {
    title: "Blinding Lights",
    artist: "The Weeknd",
    genre: "Pop",
    cover: "https://upload.wikimedia.org/wikipedia/en/e/e6/The_Weeknd_-_Blinding_Lights.png",
  },
  {
    title: "Smells Like Teen Spirit",
    artist: "Nirvana",
    genre: "Grunge",
    cover: "https://upload.wikimedia.org/wikipedia/en/b/b7/NirvanaSmellsLikeTeenSpirit.jpg",
  },
];

export default function Musica() {
  const [index, setIndex] = useState(0);
  const music = mockMusic[index];
  const audio = new Audio(pageFlipSound);

  const nextMusic = () => {
    audio.play();
    setIndex((prev) => (prev + 1) % mockMusic.length);
  };

  return (
    <div className="min-h-screen flex items-center justify-center
      bg-gradient-to-br from-green-900 via-emerald-800 to-green-950
      bg-[length:200%_200%] animate-gradient-x p-6"
    >
      <div
        className="relative w-full max-w-md rounded-3xl shadow-2xl overflow-hidden
          bg-gradient-to-br from-green-100/90 to-green-200/80 backdrop-blur-sm"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={music.title}
            initial={{ rotateY: 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: -90, opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="p-8 flex flex-col items-center text-center"
          >
            <img
              src={music.cover}
              alt={music.title}
              className="w-56 h-56 object-cover rounded-xl shadow-lg mb-6"
            />
            <h2 className="text-4xl font-bold font-[Poppins] text-green-900 drop-shadow-md">
              {music.title}
            </h2>
            <p className="text-2xl text-green-800 mt-1">{music.artist}</p>
            <span className="text-lg italic text-green-700 mt-2">{music.genre}</span>
          </motion.div>
        </AnimatePresence>

        <button
          onClick={nextMusic}
          className="absolute bottom-6 right-6 bg-green-700 text-green-100
            font-semibold px-5 py-3 rounded-xl shadow-md hover:bg-green-600
            active:scale-95 transition-transform duration-150"
        >
          Outra música
        </button>
      </div>
    </div>
  );
}
