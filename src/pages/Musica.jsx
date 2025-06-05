import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import pageFlipSound from "/sounds/page-flip.mp3";
import paperTexture from "/images/paper-texture.jpg";

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-900 via-emerald-800 to-green-950 bg-[length:200%_200%] animate-gradient-x p-6">
      <div
        className="relative w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
        style={{ backgroundImage: `url(${paperTexture})`, backgroundSize: "cover" }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={music.title}
            initial={{ rotateY: 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: -90, opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="p-6 flex flex-col items-center text-center"
          >
            <img src={music.cover} alt={music.title} className="w-48 h-48 object-cover rounded-xl shadow-lg mb-4" />
            <h2 className="text-3xl font-bold font-[Poppins] text-black drop-shadow-md">{music.title}</h2>
            <p className="text-xl text-gray-800">{music.artist}</p>
            <span className="text-sm italic text-gray-600 mt-2">{music.genre}</span>
          </motion.div>
        </AnimatePresence>

        <button
          onClick={nextMusic}
          className="absolute bottom-4 right-4 bg-white text-green-800 font-semibold px-4 py-2 rounded-xl shadow-md hover:scale-105 active:scale-95 transition"
        >
          Outra música
        </button>
      </div>
    </div>
  );
}
