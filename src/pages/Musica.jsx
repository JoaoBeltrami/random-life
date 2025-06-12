import { useEffect, useState, useCallback } from "react";

export default function Musica() {
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains("dark")
  );

  // Detecta mudanças no modo dark no documento
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const darkNow = document.documentElement.classList.contains("dark");
      setIsDark(darkNow);
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const fetchAlbum = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    setError(null);
    setAlbum(null);
    try {
      const res = await fetch(`/api/spotify/random?dark=${isDark}`);
      if (!res.ok) throw new Error(`Erro na resposta: ${res.status}`);
      const data = await res.json();
      setAlbum(data);
    } catch (err) {
      console.error("Erro ao buscar álbum:", err);
      setError("Não foi possível carregar o álbum. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }, [isDark, loading]);

  useEffect(() => {
    fetchAlbum();
  }, [fetchAlbum]);

  return (
    <div className="p-4 max-w-md mx-auto">
      {loading && (
        <p className="text-center text-gray-500" role="status" aria-live="polite">
          Carregando álbum...
        </p>
      )}

      {error && (
        <div className="text-center text-red-600 mb-4" role="alert" aria-live="assertive">
          <p>{error}</p>
          <button
            onClick={fetchAlbum}
            className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
            disabled={loading}
          >
            Tentar novamente
          </button>
        </div>
      )}

      {!loading && album && !error && (
        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg text-center">
          <img
            src={album.imagem || "/placeholder-album.png"}
            alt={album.nome || "Imagem do álbum"}
            className="mx-auto rounded-md mb-4 max-h-64 object-contain"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "/placeholder-album.png";
            }}
          />
          <h2 className="text-xl font-bold dark:text-white">{album.nome}</h2>
          <p className="text-gray-700 dark:text-gray-300">{album.artista}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{album.numeroFaixas} faixa{album.numeroFaixas !== 1 ? "s" : ""}</p>
          <a
            href={album.spotifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            Ouvir no Spotify
          </a>
          <button
            onClick={fetchAlbum}
            className={`mt-6 px-4 py-2 rounded text-white transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
            aria-label="Buscar outro álbum"
            disabled={loading}
          >
            {loading ? "Carregando..." : "Buscar outro álbum"}
          </button>
        </div>
      )}
    </div>
  );
}
