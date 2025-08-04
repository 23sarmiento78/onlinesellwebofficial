import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/index.css"; // Importamos el archivo principal de estilos
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
