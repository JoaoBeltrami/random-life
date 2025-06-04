import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import Home from './pages/Home';
import Filme from './pages/Filme';
import Comida from './pages/Comida';
import Serie from './pages/Serie';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/filme" element={<Filme />} />
        <Route path="/comida" element={<Comida />} />
        <Route path="/serie" element={<Serie />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
