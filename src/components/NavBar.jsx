import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './NavBar.css';

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const location = useLocation();
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Forzar tema oscuro siempre
    document.body.classList.add('dark-mode');
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Cerrar menú al hacer clic en enlaces
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevenir scroll cuando el menú está abierto
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setIsSearching(true);
      try {
        const { searchArticlesWithCache } = await import('../utils/searchArticles');
        const results = await searchArticlesWithCache(searchTerm);
        setSearchResults(results);
        
        // Redirigir a la página de artículos con los resultados
        const searchParams = new URLSearchParams();
        searchParams.set('q', searchTerm);
        window.location.href = `/articulos?${searchParams.toString()}`;
      } catch (error) {
        console.error('Error en la búsqueda:', error);
      } finally {
        setIsSearching(false);
      }
    }
  };

  // Fecha actual
  const currentDate = new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <>
      <div className="nav-wrapper">
        {/* Top Bar con fecha y estadísticas */}
        <div className="top-bar">
          <div className="container">
            <div className="top-bar-content">
              <div className="date-section">
                <span className="date">
                  <i className="fas fa-calendar"></i>
                  {currentDate}
                </span>
              </div>
              <div className="stats-section">
                <div className="live-readers">
                  <span className="live-indicator"></span>
                  <span>1,247 desarrolladores conectados</span>
                </div>
              </div>
              <div className="social-section">
                <a href="#" className="social-link"><i className="fab fa-twitter"></i></a>
                <a href="#" className="social-link"><i className="fab fa-linkedin"></i></a>
              </div>
            </div>
          </div>
        </div>

      {/* Header Principal */}
      <header className={`main-header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="header-bg">
          <div className="header-glow"></div>
        </div>
        <div className="container">
          <div className="header-main">
            {/* Logo Section */}
            <div className="header-left">
              <Link to="/" className="logo" onClick={closeMenu}>
                <div className="logo-container">
                  <img 
                    src="/public/logos-he-imagenes/logo3.png" 
                    alt="hgaruna Logo" 
                    className="logo-image"
                  />
                  <div className="logo-text">
                    <h1 className="site-title">hgaruna</h1>
                    <div className="site-tagline">
                      <span className="tag-item">Desarrollo</span>
                      <span className="tag-dot"></span>
                      <span className="tag-item">Innovación</span>
                      <span className="tag-dot"></span>
                      <span className="tag-item">Futuro</span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            {/* Navigation Section */}
            <nav className="header-center">
              <ul className="nav-menu">
                <li className="nav-item">
                  <Link 
                    to="/" 
                    className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
                  >
                    <i className="fas fa-home"></i>
                    <span>Inicio</span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link 
                    to="/articulos" 
                    className={`nav-link ${location.pathname === '/articulos' ? 'active' : ''}`}
                  >
                    <i className="fas fa-newspaper"></i>
                    <span>Artículos</span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link 
                    to="/ebook" 
                    className={`nav-link ${location.pathname === '/ebook' ? 'active' : ''}`}
                  >
                    <i className="fas fa-book"></i>
                    <span>eBook</span>
                    <span className="nav-badge">Nuevo</span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link 
                    to="/recursos" 
                    className={`nav-link ${location.pathname === '/recursos' ? 'active' : ''}`}
                  >
                    <i className="fas fa-tools"></i>
                    <span>Recursos</span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link 
                    to="/contacto" 
                    className={`nav-link ${location.pathname === '/contacto' ? 'active' : ''}`}
                  >
                    <i className="fas fa-envelope"></i>
                    <span>Contacto</span>
                  </Link>
                </li>
              </ul>
            </nav>

            {/* Actions Section */}
            <div className="header-right">
              <button 
                className="search-toggle"
                onClick={() => setShowSearch(!showSearch)}
                aria-label="Toggle search"
              >
                <i className="fas fa-search"></i>
              </button>

              {/* Mobile Menu Toggle - Only shows on mobile */}
              <button
                className={`mobile-menu-toggle ${isMenuOpen ? 'active' : ''}`}
                onClick={toggleMenu}
                aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
                aria-expanded={isMenuOpen}
              >
                <span></span>
                <span></span>
                <span></span>
              </button>
            </div>
          </div>

          {/* Search Bar - Shows/Hides based on toggle */}
          <div className={`search-bar ${showSearch ? 'show' : ''}`}>
            <div className="search-container">
              <form onSubmit={handleSearch} className="search-form">
                <i className="fas fa-search"></i>
                <input
                  type="text"
                  placeholder="Buscar artículos, tutoriales, recursos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button type="submit">
                  <i className="fas fa-arrow-right"></i>
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`mobile-menu ${isMenuOpen ? 'show' : ''}`}>
          <div className="mobile-search">
            <form onSubmit={handleSearch} className="search-form">
              <i className="fas fa-search"></i>
              <input
                type="text"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button type="submit">
                <i className="fas fa-arrow-right"></i>
              </button>
            </form>
          </div>
          <nav className="mobile-nav">
            <ul className="mobile-nav-menu">
              <li>
                <Link to="/" onClick={closeMenu}>
                  <i className="fas fa-home"></i>
                  <span>Inicio</span>
                </Link>
              </li>
              <li>
                <Link to="/articulos" onClick={closeMenu}>
                  <i className="fas fa-newspaper"></i>
                  <span>Artículos</span>
                </Link>
              </li>
              <li>
                <Link to="/ebook" onClick={closeMenu}>
                  <i className="fas fa-book"></i>
                  <span>eBook</span>
                  <span className="nav-badge">Nuevo</span>
                </Link>
              </li>
              <li>
                <Link to="/recursos" onClick={closeMenu}>
                  <i className="fas fa-tools"></i>
                  <span>Recursos</span>
                </Link>
              </li>
              <li>
                <Link to="/contacto" onClick={closeMenu}>
                  <i className="fas fa-envelope"></i>
                  <span>Contacto</span>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Overlay para cerrar menú móvil */}
      <div className={`mobile-overlay ${isMenuOpen ? 'active' : ''}`} onClick={closeMenu}></div>
    </div>
    </>
  );
};

export default NavBar;
