import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Livro = () => {
  const [livro, setLivro] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const apiKey = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY;

  const buscarLivroAleatorio = async () => {
    setLoading(true);
    const termos = ["ficção", "aventura", "romance", "história", "tecnologia", "fantasia", "biografia"];
    const termoAleatorio = termos[Math.floor(Math.random() * termos.length)];

    try {
      const response = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=${termoAleatorio}&printType=books&langRestrict=pt&maxResults=20&key=${apiKey}`
      );

      const livrosFiltrados = response.data.items.filter(item => {
        const info = item.volumeInfo;
        const descricaoEmPortugues = info.description && /[à-úÀ-Ú]/.test(info.description);

        return (
          info.title &&
          info.authors &&
          info.publishedDate &&
          info.categories &&
          info.imageLinks?.thumbnail &&
          descricaoEmPortugues
        );
      });

      if (livrosFiltrados.length > 0) {
        const aleatorio = livrosFiltrados[Math.floor(Math.random() * livrosFiltrados.length)];
        setLivro(aleatorio);
      } else {
        setLivro(null);
      }
    } catch (error) {
      console.error("Erro ao buscar livro:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    buscarLivroAleatorio();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-yellow-200 via-yellow-300 to-yellow-500 text-black relative">
      <button
        className="absolute top-4 left-4 text-black bg-yellow-100 p-2 rounded-full shadow-md hover:bg-yellow-200 transition"
        onClick={() => navigate("/")}
      >
        ⬅
      </button>

      {loading ? (
        <p className="text-xl font-bold">Carregando livro...</p>
      ) : livro ? (
        <div className="bg-yellow-100/70 p-6 rounded-2xl shadow-xl max-w-md w-full text-center">
          <h1 className="text-2xl font-bold mb-4">{livro.volumeInfo.title}</h1>
          <img
            src={livro.volumeInfo.imageLinks.thumbnail}
            alt={livro.volumeInfo.title}
            className="mx-auto mb-4 rounded shadow-lg"
          />
          <p className="mb-1"><strong>Autor:</strong> {livro.volumeInfo.authors.join(", ")}</p>
          <p className="mb-1"><strong>Ano:</strong> {livro.volumeInfo.publishedDate}</p>
          <p className="mb-1"><strong>Gênero:</strong> {livro.volumeInfo.categories?.join(", ")}</p>
          <p className="text-sm text-justify">{livro.volumeInfo.description}</p>

          <button
            onClick={buscarLivroAleatorio}
            className="mt-6 px-6 py-2 bg-yellow-400 hover:bg-yellow-500 text-black font-bold rounded-xl transition shadow-md"
          >
            Novo Livro
          </button>
        </div>
      ) : (
        <p className="text-xl font-semibold">Nenhum livro encontrado. Tente novamente.</p>
      )}
    </div>
  );
};

export default Livro;
