import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";

const albunsMock = [
  {
    nome: "Abbey Road",
    artista: "The Beatles",
    ano: 1969,
    genero: "Rock",
    imagem:
      "https://upload.wikimedia.org/wikipedia/en/4/42/Beatles_-_Abbey_Road.jpg",
    descricao:
      "Último álbum gravado pelos Beatles, conhecido pela icônica capa da faixa de pedestres.",
  },
  {
    nome: "Thriller",
    artista: "Michael Jackson",
    ano: 1982,
    genero: "Pop",
    imagem:
      "https://upload.wikimedia.org/wikipedia/en/5/55/Michael_Jackson_-_Thriller.png",
    descricao:
      "O álbum mais vendido da história, com hits como 'Beat It' e 'Billie Jean'.",
  },
  {
    nome: "Kind of Blue",
    artista: "Miles Davis",
    ano: 1959,
    genero: "Jazz",
    imagem:
      "https://upload.wikimedia.org/wikipedia/en/9/9c/MilesDavisKindofBlue.jpg",
    descricao:
      "Álbum clássico de jazz, um marco na história do gênero e influência para muitos músicos.",
  },
];

const Musica = () => {
  const [album, setAlbum] = useState(albunsMock[0]);
  const navigate = useNavigate();

  const trocarAlbum = () => {
    const aleatorio = albunsMock[Math.floor(Math.random() * albunsMock.length)];
    setAlbum(aleatorio);
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6"
      style={{
        background: "linear-gradient(135deg, #1B5E20 0%, #4CAF50 100%)",
      }}
    >
      {/* Botão voltar */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 text-white hover:text-yellow-300 transition-colors duration-300"
        aria-label="Voltar"
      >
        <ArrowLeftIcon className="h-10 w-10" />
      </button>

      <motion.div
        key={album.nome}
        initial={{ opacity: 0, rotateY: -90 }}
        animate={{ opacity: 1, rotateY: 0 }}
        exit={{ opacity: 0, rotateY: 90 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl w-full bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden text-gray-900"
      >
        {/* Imagem */}
        <img
          src={album.imagem}
          alt={album.nome}
          className="w-full md:w-1/3 object-cover"
          style={{ minHeight: "320px" }}
        />

        {/* Infos */}
        <div className="p-8 flex flex-col justify-center md:w-2/3">
          <h2 className="text-4xl font-serif font-semibold mb-2">{album.nome}</h2>
          <p className="text-lg italic mb-2 text-gray-700">Artista: {album.artista}</p>
          <p className="text-base font-light mb-2">Ano: {album.ano}</p>
          <p className="text-base font-light mb-4">Gênero: {album.genero}</p>
          <p className="text-base font-light leading-relaxed">{album.descricao}</p>
        </div>
      </motion.div>

      <button
        onClick={trocarAlbum}
        className="mt-8 bg-yellow-800 hover:bg-yellow-900 text-white py-3 px-8 rounded-2xl shadow-lg text-lg font-semibold transition-colors duration-300"
      >
        Tentar outro álbum
      </button>
    </div>
  );
};

export default Musica;
