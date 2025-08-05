import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ARTICLE_CATEGORIES } from '@utils/articleGenerator'

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [showBlogDropdown, setShowBlogDropdown] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsOpen(false)
  }, [location])

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const navLinks = [
    { to: '/', label: 'Inicio' },
    { to: '/planes', label: 'Planes' },
    {
      to: '/blog',
      label: 'Blog',
      dropdown: true,
      items: [
        { to: '/blog', label: 'Todos los Artículos', icon: 'fas fa-list' },
        { type: 'divider' },
        ...Object.entries(ARTICLE_CATEGORIES).map(([key, category]) => ({
          to: `/blog/categoria/${key}`,
          label: category.name,
          icon: category.icon
        }))
      ]
    },
    { to: '/contacto', label: 'Contacto' },
  ]

  return (
    <>
      <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="navbar-container container">
          {/* Brand */}
          <Link to="/" className="navbar-brand">
            <img src="/logos-he-imagenes/logo3.png" alt="hgaruna" />
            <span>hgaruna</span>
          </Link>

          {/* Desktop Navigation */}
          <ul className="navbar-nav">
            {navLinks.map((link) => (
              <li
                key={link.to}
                className={`nav-item ${link.dropdown ? 'nav-dropdown' : ''}`}
                onMouseEnter={() => link.dropdown && setShowBlogDropdown(true)}
                onMouseLeave={() => link.dropdown && setShowBlogDropdown(false)}
              >
                {link.dropdown ? (
                  <>
                    <span className={`nav-link ${location.pathname.startsWith(link.to) ? 'active' : ''}`}>
                      {link.label}
                      <i className="fas fa-chevron-down ml-1"></i>
                    </span>
                    {showBlogDropdown && (
                      <div className="nav-dropdown-menu">
                        {link.items.map((item, index) => (
                          item.type === 'divider' ? (
                            <div key={index} className="nav-dropdown-divider"></div>
                          ) : (
                            <Link
                              key={item.to}
                              to={item.to}
                              className={`nav-dropdown-item ${location.pathname === item.to ? 'active' : ''}`}
                            >
                              <i className={item.icon}></i>
                              {item.label}
                            </Link>
                          )
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    to={link.to}
                    className={`nav-link ${location.pathname === link.to ? 'active' : ''}`}
                  >
                    {link.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>

          {/* CTA Button */}
          <div className="navbar-cta">
            <a
              href="https://wa.me/+543541237972?text=Hola%2C%20necesito%20un%20sitio%20web%20para%20mi%20negocio"
              className="btn btn-primary btn-sm"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-whatsapp"></i>
              Consulta Gratis
            </a>
          </div>

          {/* Mobile Toggle */}
          <button
            className={`navbar-toggle ${isOpen ? 'active' : ''}`}
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className={`mobile-nav ${isOpen ? 'open' : ''}`}>
        <ul className="mobile-nav-list">
          {navLinks.map((link) => (
            <li key={link.to}>
              <Link
                to={link.to}
                className={`nav-link ${location.pathname === link.to ? 'active' : ''}`}
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <a
              href="https://wa.me/+543541237972?text=Hola%2C%20necesito%20un%20sitio%20web%20para%20mi%20negocio"
              className="nav-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-whatsapp"></i>
              Consulta Gratis
            </a>
          </li>
        </ul>
      </div>

      {/* Mobile Overlay */}
      <div
        className={`mobile-overlay ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(false)}
      />
    </>
  )
}
