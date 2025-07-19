import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./App.css";
import "./BlogIA.css";
import "./bootstrap-override.css";
import App from "./App";

// Inicializar Builder.io
import "./utils/builder";
import { registerBuilderComponents } from "./components/BuilderComponents";

// Registrar componentes personalizados
registerBuilderComponents();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
