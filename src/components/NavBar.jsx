import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './NavBar.css';

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.classList.add('dark-mode');
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      try {
        const searchParams = new URLSearchParams();
        searchParams.set('q', searchTerm);
        window.location.href = `/articulos?${searchParams.toString()}`;
      } catch (error) {
        console.error('Error en la búsqueda:', error);
      }
    }
  };

  return (
    <header className={`clean-navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-wrapper">
        <div className="navbar-content">
          {/* Logo */}
          <Link to="/" className="navbar-logo" onClick={closeMenu}>
            <div className="logo-icon">
              <i className="fas fa-code"></i>
            </div>
            <div className="logo-text">
              <span className="logo-title">hgaruna</span>
              <span className="logo-subtitle">dev</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="desktop-nav">
            <Link 
              to="/" 
              className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}
            >
              <i className="fas fa-home"></i>
              <span>Inicio</span>
            </Link>
            <Link 
              to="/nosotros" 
              className={`nav-item ${(location.pathname === '/nosotros' || location.pathname === '/autores') ? 'active' : ''}`}
            >
              <i className="fas fa-user"></i>
              <span>Sobre mí y Autor</span>
            </Link>
            <Link 
              to="/articulos" 
              className={`nav-item ${location.pathname === '/articulos' ? 'active' : ''}`}
            >
              <i className="fas fa-newspaper"></i>
              <span>Blog</span>
            </Link>
            <Link 
              to="/ebook" 
              className={`nav-item ${location.pathname === '/ebook' ? 'active' : ''}`}
            >
              <i className="fas fa-book"></i>
              <span>eBooks</span>
              <span className="nav-badge">Nuevo</span>
            </Link>
            <Link 
              to="/recursos" 
              className={`nav-item ${location.pathname === '/recursos' ? 'active' : ''}`}
            >
              <i className="fas fa-tools"></i>
              <span>Recursos</span>
            </Link>
            <Link 
              to="/contacto" 
              className={`nav-item ${location.pathname === '/contacto' ? 'active' : ''}`}
            >
              <i className="fas fa-envelope"></i>
              <span>Contacto</span>
            </Link>
          </nav>

          {/* Right Section */}
          <div className="navbar-actions">
            {/* Search */}
            <div className="search-box">
              <form onSubmit={handleSearch}>
                <div className="search-wrapper">
                  <i className="fas fa-search"></i>
                  <input
                    type="text"
                    placeholder="Buscar..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </form>
            </div>

            {/* Mobile Toggle */}
            <button
              className={`mobile-menu-btn ${isMenuOpen ? 'active' : ''}`}
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-content">
          <div className="mobile-search">
            <form onSubmit={handleSearch}>
              <div className="search-wrapper">
                <i className="fas fa-search"></i>
                <input
                  type="text"
                  placeholder="Buscar artículos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </form>
          </div>

          <nav className="mobile-nav">
            <Link 
              to="/" 
              className={`mobile-nav-item ${location.pathname === '/' ? 'active' : ''}`}
              onClick={closeMenu}
            >
              <i className="fas fa-home"></i>
              <span>Inicio</span>
            </Link>
            <Link 
              to="/nosotros" 
              className={`mobile-nav-item ${(location.pathname === '/nosotros' || location.pathname === '/autores') ? 'active' : ''}`}
              onClick={closeMenu}
            >
              <i className="fas fa-user"></i>
              <span>Sobre mí y Autor</span>
            </Link>
            <Link 
              to="/articulos" 
              className={`mobile-nav-item ${location.pathname === '/articulos' ? 'active' : ''}`}
              onClick={closeMenu}
            >
              <i className="fas fa-newspaper"></i>
              <span>Blog</span>
            </Link>
            <Link 
              to="/ebook" 
              className={`mobile-nav-item ${location.pathname === '/ebook' ? 'active' : ''}`}
              onClick={closeMenu}
            >
              <i className="fas fa-book"></i>
              <span>eBooks</span>
              <span className="mobile-badge">Nuevo</span>
            </Link>
            <Link 
              to="/recursos" 
              className={`mobile-nav-item ${location.pathname === '/recursos' ? 'active' : ''}`}
              onClick={closeMenu}
            >
              <i className="fas fa-tools"></i>
              <span>Recursos</span>
            </Link>
            <Link 
              to="/contacto" 
              className={`mobile-nav-item ${location.pathname === '/contacto' ? 'active' : ''}`}
              onClick={closeMenu}
            >
              <i className="fas fa-envelope"></i>
              <span>Contacto</span>
            </Link>
          </nav>
        </div>
      </div>

      {/* Mobile Overlay */}
      <div className={`mobile-overlay ${isMenuOpen ? 'active' : ''}`} onClick={closeMenu}></div>
    </header>
  );
};

export default NavBar;
