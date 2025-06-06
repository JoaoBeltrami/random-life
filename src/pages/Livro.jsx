import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";

const termosBusca = [
  "subject:literature+classics",
  "subject:fiction",
  "Machado de Assis",
  "Jane Austen",
  "Victor Hugo",
  "Dostoiévski",
  "Tolstói",
  "George Orwell",
  "Franz Kafka",
  "Stephen King",
  "Agatha Christie",
  "J.K. Rowling",
  "Gabriel García Márquez",
  "Haruki Murakami",
  "RL Stine",
  "Neil Gaiman",
  "Ray Bradbury",
  "H.G. Wells",
  "Isaac Asimov",
  "Arthur C. Clarke",
];

const Livro = () => {
  const [livro, setLivro] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const buscarLivro = async () => {
    setLoading(true);
    setLivro(null);

    try {
      const termoAleatorio =
        termosBusca[Math.floor(Math.random() * termosBusca.length)];

      const resposta = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
          termoAleatorio
        )}&printType=books&maxResults=10&key=${import.meta.env.VITE_GOOGLE_BOOKS_API_KEY}`
      );

      const data = await resposta.json();

      if (data.items && data.items.length > 0) {
        const candidatos = data.items
          .map((item) => item.volumeInfo)
          .filter(
            (info) =>
              info.title &&
              info.authors &&
              info.imageLinks?.thumbnail &&
              info.description
          );

        if (candidatos.length > 0) {
          const escolhido =
            candidatos[Math.floor(Math.random() * candidatos.length)];
          setLivro(escolhido);
        } else {
          setLivro(null);
        }
      } else {
        setLivro(null);
      }
    } catch (error) {
      console.error("Erro ao buscar livro:", error);
      setLivro(null);
    }

    setLoading(false);
  };

  useEffect(() => {
    buscarLivro();
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6"
      style={{
        background: "linear-gradient(135deg, #FFD54F 0%, #FFB300 100%)",
      }}
    >
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 text-gray-900 hover:text-yellow-900 transition-colors duration-300"
        aria-label="Voltar"
      >
        <ArrowLeftIcon className="h-10 w-10" />
      </button>

      {loading ? (
        <p className="text-gray-900 text-xl select-none">Carregando livro...</p>
      ) : livro ? (
        <motion.div
          key={livro.title}
          initial={{ opacity: 0, rotateY: -90 }}
          animate={{ opacity: 1, rotateY: 0 }}
          exit={{ opacity: 0, rotateY: 90 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl w-full bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden border-4 border-yellow-700"
        >
          <img
            src={livro.imageLinks.thumbnail}
            alt={livro.title}
            className="w-full md:w-1/3 object-cover"
            style={{ minHeight: "320px" }}
          />

          <div className="p-8 flex flex-col justify-between md:w-2/3 text-gray-900">
            <div>
              <h2 className="text-4xl font-serif font-semibold mb-4">
                {livro.title}
              </h2>
              <p className="text-lg italic mb-8 text-gray-700">
                Autor: {livro.authors.join(", ")}
              </p>
              <p
                className="text-base font-semibold leading-relaxed max-h-72 overflow-y-auto pr-2 drop-shadow-md"
                style={{ scrollbarWidth: "thin" }}
              >
                {livro.description}
              </p>
            </div>
          </div>
        </motion.div>
      ) : (
        <p className="text-gray-900 text-lg select-none">
          Nenhum livro encontrado.
        </p>
      )}

      <button
        onClick={buscarLivro}
        className="mt-8 bg-yellow-800 hover:bg-yellow-900 text-white py-3 px-8 rounded-2xl shadow-lg text-lg font-semibold transition-colors duration-300"
      >
        Tentar outro livro
      </button>
    </div>
  );
};

export default Livro;
