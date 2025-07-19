import React, { useState, useEffect } from 'react';
import './NavBar.css';

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
  };

  const handleClose = () => {
    setMenuOpen(false);
  };

  const handleLinkClick = () => {
    setMenuOpen(false);
  };

  return (
    <>
      <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
        <div className="container nav-flex">
          {/* Logo */}
          <a className="navbar-brand" href="/">
            <img src="/logos-he-imagenes/logonegro-Photoroom.png" alt="Logo de hgaruna" />
            <span>hgaruna</span>
          </a>

          {/* Menú Desktop */}
          <div className="navbar-menu desktop-menu">
            <ul className="main-nav">
              <li><a href="/" className="nav-link">Inicio</a></li>
              <li><a href="/planes/" className="nav-link">Planes</a></li>
              <li><a href="/legal/" className="nav-link">Legal</a></li>
              <li><a href="/blog" className="nav-link">Blog IA</a></li>
            </ul>
            <div className="nav-actions">
              <a href="https://wa.link/6t7cxa" className="btn-filled" target="_blank" rel="noopener">
                <i className="fab fa-whatsapp"></i>
                Cotizar Ahora
              </a>
            </div>
          </div>

          {/* Botón móvil */}
          <button 
            className={`navbar-toggler${menuOpen ? ' active' : ''}`} 
            onClick={handleToggle}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>

      {/* Sidebar móvil */}
      <div className={`mobile-sidebar${menuOpen ? ' open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <img src="/logos-he-imagenes/logonegro-Photoroom.png" alt="Logo" />
            <span>hgaruna</span>
          </div>
          <button className="sidebar-close" onClick={handleClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <div className="sidebar-content">
          <ul className="sidebar-menu">
            <li><a href="/" onClick={handleLinkClick}>Inicio</a></li>
            <li><a href="/planes/" onClick={handleLinkClick}>Planes</a></li>
            <li><a href="/legal/" onClick={handleLinkClick}>Legal</a></li>
            <li><a href="/blog" onClick={handleLinkClick}>Blog IA</a></li>
          </ul>
          
          <div className="sidebar-cta">
            <a href="https://wa.link/6t7cxa" onClick={handleLinkClick} target="_blank" rel="noopener">
              <i className="fab fa-whatsapp"></i>
              Cotizar Ahora
            </a>
          </div>
        </div>
      </div>

      {/* Overlay */}
      <div className={`sidebar-overlay${menuOpen ? ' active' : ''}`} onClick={handleClose}></div>
    </>
  );
} 