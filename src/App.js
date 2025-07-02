import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Importar páginas
import Home from './pages/Home';
import Contacto from './pages/Contacto';
import Planes from './pages/Planes';
import Legal from './pages/Legal';
import PoliticasPrivacidad from './pages/PoliticasPrivacidad';
import Foro from './pages/Foro';
import DesarrolloWebVillaCarlosPaz from './pages/DesarrolloWebVillaCarlosPaz';
import DisenoWebVillaCarlosPaz from './pages/DisenoWebVillaCarlosPaz';
import MarketingDigitalVillaCarlosPaz from './pages/MarketingDigitalVillaCarlosPaz';
import Articulo from './pages/articulos/[slug]';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/planes" element={<Planes />} />
          <Route path="/legal" element={<Legal />} />
          <Route path="/politicas-privacidad" element={<PoliticasPrivacidad />} />
          <Route path="/foro" element={<Foro />} />
          <Route path="/desarrollo-web-villa-carlos-paz" element={<DesarrolloWebVillaCarlosPaz />} />
          <Route path="/diseño-web-villa-carlos-paz" element={<DisenoWebVillaCarlosPaz />} />
          <Route path="/marketing-digital-villa-carlos-paz" element={<MarketingDigitalVillaCarlosPaz />} />
          <Route path="/articulos/:slug" element={<Articulo />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 