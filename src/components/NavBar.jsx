import React, { useState, useEffect } from 'react';

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleToggle = () => {
    setMenuOpen(!menuOpen);
    document.body.classList.toggle('menu-open', !menuOpen);
  };

  const handleClose = () => {
    setMenuOpen(false);
    document.body.classList.remove('menu-open');
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && menuOpen) handleClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [menuOpen]);

  return (
    <header className={`main-header${scrolled ? ' scrolled' : ''}`}>
      <nav className="navbar">
        <div className="container nav-flex">
          {/* Logo alineado a la izquierda */}
          <a className="navbar-brand nav-logo-left" href="/">
            <img id="nav-logo" src="/logos-he-imagenes/logonegro-Photoroom.png" alt="Logo de hgaruna" />
            <span>hgaruna</span>
          </a>

          {/* Botón de menú móvil */}
          <button className={`navbar-toggler${menuOpen ? ' active' : ''}`} type="button" aria-label="Toggle navigation" onClick={handleToggle}>
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Overlay para cerrar menú móvil */}
          <div className={`overlay${menuOpen ? ' active' : ''}`} onClick={handleClose}></div>

          {/* Menú y acciones alineados a la derecha */}
          <div className={`navbar-collapse nav-right-group${menuOpen ? ' show' : ''}`}>
            <ul className="main-nav">
              <li>
                <a href="/" className="nav-link" onClick={handleClose}>
                  <i className="fas fa-home"></i>
                  <span>Inicio</span>
                </a>
              </li>
              <li>
                <a href="/planes/" className="nav-link" onClick={handleClose}>
                  <i className="fas fa-tags"></i>
                  <span>Planes</span>
                </a>
              </li>
              <li>
                <a href="/legal/" className="nav-link" onClick={handleClose}>
                  <i className="fas fa-shield-alt"></i>
                  <span>Legal</span>
                </a>
              </li>
              <li>
                <a href="/foro/" className="nav-link" onClick={handleClose}>
                  <i className="fas fa-comments"></i>
                  <span>Foro</span>
                </a>
              </li>
            </ul>
            <div className="nav-actions">
              <a href="https://wa.link/6t7cxa" className="nav-btn primary" target="_blank" rel="noopener">
                <i className="fab fa-whatsapp"></i>
                <span>Cotizar Ahora</span>
              </a>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
} 