import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import Home from './pages/Home';
import Filme from './pages/Filme';
import Comida from './pages/Comida';
import Livro from './pages/Livro';
import Musica from './pages/Musica';  // <-- Importa aqui

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/filme" element={<Filme />} />
        <Route path="/comida" element={<Comida />} />
        <Route path="/livro" element={<Livro />} />
        <Route path="/musica" element={<Musica />} />   {/* <-- Adiciona essa rota */}
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
