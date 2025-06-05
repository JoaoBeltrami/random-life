import { useNavigate } from "react-router-dom";
import Logo from "../components/Logo";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-fuchsia-800 to-purple-950 bg-[length:200%_200%] animate-gradient-x text-white flex flex-col items-center justify-start pt-16 px-4">
      <Logo />

      <div className="grid grid-cols-2 gap-6 mt-20 md:mt-28 w-full max-w-md md:max-w-2xl justify-items-center">
        <button
          onClick={() => navigate("/filme")}
          className="bg-white text-purple-800 text-lg md:text-2xl font-semibold font-[Poppins] py-6 px-6 md:py-8 md:px-10 rounded-full shadow-xl hover:scale-105 transition-all w-36 md:w-48 text-center"
        >
          🍿 Assistir
        </button>
        <button
          onClick={() => navigate("/comida")}
          className="bg-white text-purple-800 text-lg md:text-2xl font-semibold font-[Poppins] py-6 px-6 md:py-8 md:px-10 rounded-full shadow-xl hover:scale-105 transition-all w-36 md:w-48 text-center"
        >
          🍔 Comer
        </button>
        <button
          onClick={() => navigate("/musica")}
          className="bg-white text-purple-800 text-lg md:text-2xl font-semibold font-[Poppins] py-6 px-6 md:py-8 md:px-10 rounded-full shadow-xl hover:scale-105 transition-all w-36 md:w-48 text-center"
        >
          🎵 Ouvir
        </button>
        <button
          onClick={() => navigate("/jogo")}
          className="bg-white text-purple-800 text-lg md:text-2xl font-semibold font-[Poppins] py-6 px-6 md:py-8 md:px-10 rounded-full shadow-xl hover:scale-105 transition-all w-36 md:w-48 text-center"
        >
          🎮 Jogar
        </button>
      </div>
    </div>
  );
}
