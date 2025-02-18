import React from 'react';
import './App.css';
import logo from '../public/logos-he-imagenes/logo-sell.png'; // Importa tu logo

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" /> {/* Usa tu logo */}
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
      </header>
    </div>
  );
}

export default App;
