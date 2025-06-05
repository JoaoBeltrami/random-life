import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Filme from "./pages/Filme";
// import outras páginas...

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/filme" element={<Filme />} />
        {/* outras rotas aqui */}
      </Routes>
    </BrowserRouter>
  );
}
