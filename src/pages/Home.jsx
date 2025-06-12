import { useNavigate } from "react-router-dom";
import Logo from "../components/Logo";
import ThemeToggle from "../components/ThemeToggle"; // importando seu toggle

export default function Home() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-purple-900 via-fuchsia-800 to-purple-950 bg-[length:200%_200%] animate-gradient-x
                 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-950
                 text-white dark:text-white flex flex-col items-center justify-start pt-16 px-4 relative"
    >
      <ThemeToggle />

      <Logo />

      <div className="grid grid-cols-2 gap-x-4 gap-y-6 mt-20 md:mt-28 w-full max-w-md md:max-w-2xl justify-items-center">
        {[
          { emoji: "🍿", label: "Assistir", route: "/filme" },
          { emoji: "🍔", label: "Comer", route: "/comida" },
          { emoji: "🎵", label: "Ouvir", route: "/musica" },
          { emoji: "📕", label: "Ler", route: "/livro" },
        ].map((item, idx) => (
          <button
            key={idx}
            onClick={() => navigate(item.route)}
            className="
              bg-white text-purple-800 border-4 border-white 
              dark:bg-purple-900 dark:border-purple-500 dark:text-purple-300
              text-sm sm:text-base md:text-2xl font-semibold font-poppins
              py-4 sm:py-6 md:py-8 px-4 sm:px-6 md:px-10
              rounded-full shadow-2xl
              hover:scale-105 active:scale-95 transition-transform duration-150
              w-28 sm:w-32 md:w-48
              text-center
              "
            style={{ borderWidth: "4px" }}
          >
            <span className="block text-2xl mb-1">{item.emoji}</span>
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
