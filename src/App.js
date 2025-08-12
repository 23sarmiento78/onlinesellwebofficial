import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import "./App.css";
import "./dark-green-theme.css";

// Importar NavBar
import NavBar from "./components/NavBar";

// Importar componentes de AdSense
import AdSenseErrorBoundary, { AdSenseInitializer } from "./components/AdSenseErrorBoundary";

// Importar páginas
import Home from "./pages/Home";
import Contacto from "./pages/Contacto";
import Articles from "./pages/Articles";
import ArticleDetail from "./pages/ArticleDetail";
import EbookPage from "./pages/EbookPage";
import DeveloperResources from "./pages/DeveloperResources";
import Legal from "./pages/Legal";
import PoliticasPrivacidad from "./pages/PoliticasPrivacidad";

function App() {
  return (
    <HelmetProvider>
      <AdSenseErrorBoundary>
        <AdSenseInitializer>
          <Router>
            <div className="App">
              <NavBar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/contacto" element={<Contacto />} />
                <Route path="/articulos" element={<Articles />} />
                <Route path="/articulos/:slug" element={<ArticleDetail />} />
                <Route path="/ebook" element={<EbookPage />} />
                <Route path="/recursos" element={<DeveloperResources />} />
                <Route path="/legal" element={<Legal />} />
                <Route
                  path="/politicas-privacidad"
                  element={<PoliticasPrivacidad />}
                />
              </Routes>
            </div>
          </Router>
        </AdSenseInitializer>
      </AdSenseErrorBoundary>
    </HelmetProvider>
  );
}

export default App;
