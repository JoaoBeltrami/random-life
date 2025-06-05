import { useNavigate } from "react-router-dom";
import Logo from "../components/Logo";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-fuchsia-800 to-purple-950 bg-[length:200%_200%] animate-gradient-x text-white flex flex-col items-center justify-start pt-16 px-4">
      <Logo />

      <div className="grid grid-cols-2 gap-x-4 gap-y-6 mt-20 md:mt-28 w-full max-w-md md:max-w-2xl justify-items-center">
        <button
          onClick={() => navigate("/filme")}
          className="bg-white text-purple-800 text-sm sm:text-base md:text-2xl font-semibold font-[Poppins] py-4 sm:py-6 md:py-8 px-4 sm:px-6 md:px-10 rounded-full shadow-xl hover:scale-105 active:scale-95 transition-transform duration-150 w-28 sm:w-32 md:w-48 text-center hover:border hover:border-black"
        >
          <span className="block text-2xl mb-1">🍿</span>
          Assistir
        </button>
        <button
          onClick={() => navigate("/comida")}
          className="bg-white text-purple-800 text-sm sm:text-base md:text-2xl font-semibold font-[Poppins] py-4 sm:py-6 md:py-8 px-4 sm:px-6 md:px-10 rounded-full shadow-xl hover:scale-105 active:scale-95 transition-transform duration-150 w-28 sm:w-32 md:w-48 text-center hover:border hover:border-black"
        >
          <span className="block text-2xl mb-1">🍔</span>
          Comer
        </button>
        <button
          onClick={() => navigate("/musica")}
          className="bg-white text-purple-800 text-sm sm:text-base md:text-2xl font-semibold font-[Poppins] py-4 sm:py-6 md:py-8 px-4 sm:px-6 md:px-10 rounded-full shadow-xl hover:scale-105 active:scale-95 transition-transform duration-150 w-28 sm:w-32 md:w-48 text-center hover:border hover:border-black"
        >
          <span className="block text-2xl mb-1">🎵</span>
          Ouvir
        </button>
        <button
          onClick={() => navigate("/jogo")}
          className="bg-white text-purple-800 text-sm sm:text-base md:text-2xl font-semibold font-[Poppins] py-4 sm:py-6 md:py-8 px-4 sm:px-6 md:px-10 rounded-full shadow-xl hover:scale-105 active:scale-95 transition-transform duration-150 w-28 sm:w-32 md:w-48 text-center hover:border hover:border-black"
        >
          <span className="block text-2xl mb-1">🎮</span>
          Jogar
        </button>
      </div>
    </div>
  );
}
