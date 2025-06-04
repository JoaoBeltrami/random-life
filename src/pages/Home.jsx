import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-purple-700 flex flex-col items-center justify-center gap-4 p-4">
      <h1 className="text-white text-3xl font-bold mb-6">Random Life 🎲</h1>
      <Link to="/filme" className="w-full max-w-xs bg-white text-purple-700 text-xl font-semibold p-4 rounded-xl text-center shadow-lg">Escolher Filme</Link>
      <Link to="/comida" className="w-full max-w-xs bg-white text-purple-700 text-xl font-semibold p-4 rounded-xl text-center shadow-lg">Escolher Comida</Link>
      <Link to="/serie" className="w-full max-w-xs bg-white text-purple-700 text-xl font-semibold p-4 rounded-xl text-center shadow-lg">Escolher Série</Link>
    </div>
  );
}
