import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/index.css";
import "./App.css";
import "./bootstrap-override.css";
import "./dark-green-theme.css";
import App from "./App";

// Inicializar Builder.io

// Registrar componentes personalizados
// Eliminado builder legacy

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
