import React from "react";
import ReactDOM from "react-dom/client";
import "./main.css"; // Estilos principales y variables
import "./components.css"; // Estilos de componentes
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
