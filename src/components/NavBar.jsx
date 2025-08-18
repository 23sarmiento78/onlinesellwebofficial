import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './NavBar.css';

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const location = useLocation();
  const [activeDropdown, setActiveDropdown] = useState(null);

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
    setActiveDropdown(null);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) {
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

  const navItems = [
    { path: '/', icon: 'fas fa-home', label: 'Inicio' },
    { 
      path: '/articulos', 
      icon: 'fas fa-newspaper', 
      label: 'Blog',
      dropdown: [
        { path: '/articulos', label: 'Todos los Artículos', icon: 'fas fa-list' },
        { path: '/articulos?category=Frontend', label: 'Frontend', icon: 'fab fa-js' },
        { path: '/articulos?category=Backend', label: 'Backend', icon: 'fas fa-server' },
        { path: '/articulos?category=DevOps', label: 'DevOps', icon: 'fas fa-cogs' }
      ]
    },
    { path: '/ebook', icon: 'fas fa-book-open', label: 'eBooks', badge: 'Nuevo' },
    { path: '/recursos', icon: 'fas fa-toolbox', label: 'Recursos' },
    { path: '/contacto', icon: 'fas fa-paper-plane', label: 'Contacto' }
  ];

  return (
    <nav className={`modern-navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        {/* Logo Section */}
        <Link to="/" className="navbar-brand" onClick={closeMenu}>
          <div className="brand-logo">
            <div className="logo-icon">
              <i className="fas fa-code"></i>
            </div>
            <div className="brand-text">
              <span className="brand-name">hgaruna</span>
              <span className="brand-tagline">dev</span>
            </div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="navbar-nav">
          {navItems.map((item, index) => (
            <div 
              key={item.path} 
              className={`nav-item ${item.dropdown ? 'has-dropdown' : ''}`}
              onMouseEnter={() => item.dropdown && setActiveDropdown(index)}
              onMouseLeave={() => item.dropdown && setActiveDropdown(null)}
            >
              <Link
                to={item.path}
                className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                onClick={closeMenu}
              >
                <i className={item.icon}></i>
                <span>{item.label}</span>
                {item.badge && <span className="nav-badge">{item.badge}</span>}
                {item.dropdown && <i className="fas fa-chevron-down dropdown-arrow"></i>}
              </Link>
              
              {item.dropdown && (
                <div className={`dropdown-menu ${activeDropdown === index ? 'show' : ''}`}>
                  {item.dropdown.map((dropItem) => (
                    <Link
                      key={dropItem.path}
                      to={dropItem.path}
                      className="dropdown-item"
                      onClick={closeMenu}
                    >
                      <i className={dropItem.icon}></i>
                      <span>{dropItem.label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Search & Actions */}
        <div className="navbar-actions">
          <div className="search-container">
            <form onSubmit={handleSearch} className="search-form">
              <div className="search-input-wrapper">
                <i className="fas fa-search search-icon"></i>
                <input
                  type="text"
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
                <button type="submit" className="search-btn">
                  <i className="fas fa-arrow-right"></i>
                </button>
              </div>
            </form>
          </div>

          <div className="action-buttons">
            <button className="theme-toggle" title="Cambiar tema">
              <i className="fas fa-moon"></i>
            </button>
            
            <button className="notification-btn" title="Notificaciones">
              <i className="fas fa-bell"></i>
              <span className="notification-badge">3</span>
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className={`mobile-toggle ${isMenuOpen ? 'active' : ''}`}
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <span className="toggle-line"></span>
            <span className="toggle-line"></span>
            <span className="toggle-line"></span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
        <div className="mobile-header">
          <div className="mobile-search">
            <form onSubmit={handleSearch}>
              <div className="mobile-search-wrapper">
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
        </div>

        <div className="mobile-nav">
          {navItems.map((item) => (
            <div key={item.path} className="mobile-nav-item">
              <Link
                to={item.path}
                className={`mobile-nav-link ${location.pathname === item.path ? 'active' : ''}`}
                onClick={closeMenu}
              >
                <div className="mobile-link-content">
                  <i className={item.icon}></i>
                  <span>{item.label}</span>
                  {item.badge && <span className="mobile-badge">{item.badge}</span>}
                </div>
              </Link>
              
              {item.dropdown && (
                <div className="mobile-dropdown">
                  {item.dropdown.map((dropItem) => (
                    <Link
                      key={dropItem.path}
                      to={dropItem.path}
                      className="mobile-dropdown-item"
                      onClick={closeMenu}
                    >
                      <i className={dropItem.icon}></i>
                      <span>{dropItem.label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mobile-footer">
          <div className="mobile-social">
            <a href="#" className="social-btn">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" className="social-btn">
              <i className="fab fa-linkedin"></i>
            </a>
            <a href="#" className="social-btn">
              <i className="fab fa-github"></i>
            </a>
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      <div className={`mobile-overlay ${isMenuOpen ? 'active' : ''}`} onClick={closeMenu}></div>
    </nav>
  );
};

export default NavBar;
