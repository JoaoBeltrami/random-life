import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Filme from "./pages/Filme";
import Musica from "./pages/Musica";
import Comida from "./pages/Comida"; // ✅ importando Comida
import Livro from "./pages/Livro";     // ✅ importando Jogo

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/filme" element={<Filme />} />
        <Route path="/comida" element={<Comida />} />
        <Route path="/livro" element={<Livro />} />
        <Route path="/musica" element={<Musica />} />
      </Routes>
    </BrowserRouter>
  );
}
