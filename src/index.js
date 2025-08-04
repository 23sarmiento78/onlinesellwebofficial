import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/unified-variables.css"; // Variables CSS PRIMERO
import "./styles/index.css"; // Estilos modulares
import "./index.css"; // Estilos base y globales
import "./App.css";
import "./bootstrap-override.css";
import App from "./App";

// Inicializar Builder.io

// Registrar componentes personalizados
// Eliminado builder legacy

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
