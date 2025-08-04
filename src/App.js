import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

// Importar páginas
import Home from "./pages/Home";
import Contacto from "./pages/Contacto";
import Planes from "./pages/Planes";
import Legal from "./pages/Legal";
import PoliticasPrivacidad from "./pages/PoliticasPrivacidad";
import BlogIA from "./pages/BlogIA";
import BlogArticle from "./pages/BlogArticle";
import DesarrolloWebVillaCarlosPaz from "./pages/DesarrolloWebVillaCarlosPaz";
import DisenoWebVillaCarlosPaz from "./pages/DisenoWebVillaCarlosPaz";
import MarketingDigitalVillaCarlosPaz from "./pages/MarketingDigitalVillaCarlosPaz";
// import Articulo from "./pages/articulos/[slug]"; // Eliminado porque el archivo ya no existe
import BuilderExample from "./pages/BuilderExample";

function App() {
  return (
    <HelmetProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="/planes" element={<Planes />} />
            <Route path="/legal" element={<Legal />} />
            <Route
              path="/politicas-privacidad"
              element={<PoliticasPrivacidad />}
            />
            <Route path="/blog" element={<BlogIA />} />
            <Route path="/blog/:slug" element={<BlogArticle />} />
            <Route
              path="/desarrollo-web-villa-carlos-paz"
              element={<DesarrolloWebVillaCarlosPaz />}
            />
            <Route
              path="/diseño-web-villa-carlos-paz"
              element={<DisenoWebVillaCarlosPaz />}
            />
            <Route
              path="/marketing-digital-villa-carlos-paz"
              element={<MarketingDigitalVillaCarlosPaz />}
            />
            {/* <Route path="/articulos/:slug" element={<Articulo />} /> */}
            <Route path="/builder-example" element={<BuilderExample />} />
          </Routes>
        </div>
      </Router>
    </HelmetProvider>
  );
}

export default App;
