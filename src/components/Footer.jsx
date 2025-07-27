import React, { useState, useEffect } from 'react';
import { FaFacebookF, FaInstagram, FaWhatsapp, FaMapMarkerAlt, FaEnvelope, FaPhone, FaSun, FaMoon } from 'react-icons/fa';
import './Footer.css';

export default function Footer() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    // Check for saved theme preference or use system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark-theme');
    }

    // Scroll effect
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    
    if (newTheme) {
      document.documentElement.classList.add('dark-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark-theme');
      localStorage.setItem('theme', 'light');
    }
  };

  const currentYear = new Date().getFullYear();
  
  return (
    <footer className={`site-footer ${isScrolled ? 'scrolled' : ''}`}>
      <div className="footer-wave"></div>
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-logo-container">
              <img 
                src="/logos-he-imagenes/logonegro-Photoroom.png" 
                alt="Logo de hgaruna" 
                className="footer-logo" 
                loading="lazy" 
                width="120"
                height="40"
              />
            </div>
            <h3 className="footer-title">hgaruna</h3>
            <p className="slogan">Tu éxito en línea, nuestra misión.</p>
            <div className="social-links">
              <a 
                href="https://www.facebook.com/profile.php?id=61557007626922" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="social-link"
                aria-label="Facebook"
              >
                <FaFacebookF className="social-icon" />
              </a>
              <a 
                href="https://www.instagram.com/onlinesellweb/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-link"
                aria-label="Instagram"
              >
                <FaInstagram className="social-icon" />
              </a>
              <a 
                href="https://wa.link/6t7cxa" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-link"
                aria-label="WhatsApp"
              >
                <FaWhatsapp className="social-icon" />
              </a>
            </div>
          </div>
          
          <div className="footer-links">
            <h4 className="footer-heading">Navegación</h4>
            <ul className="footer-nav">
              <li className="footer-nav-item">
                <a href="/" className="footer-link">Inicio</a>
              </li>
              <li className="footer-nav-item">
                <a href="/planes/" className="footer-link">Planes</a>
              </li>
              <li className="footer-nav-item">
                <a href="/legal/" className="footer-link">Legal</a>
              </li>
              <li className="footer-nav-item">
                <a href="/politicas-privacidad/" className="footer-link">Políticas de Privacidad</a>
              </li>
              <li className="footer-nav-item">
                <a href="https://wa.link/6t7cxa" className="footer-link">Contacto</a>
              </li>
            </ul>
          </div>
          
          <div className="footer-contact">
            <h4 className="footer-heading">Contáctanos</h4>
            <div className="contact-info">
              <div className="contact-item">
                <FaMapMarkerAlt className="contact-icon" />
                <span>Villa Carlos Paz, Argentina</span>
              </div>
              <div className="contact-item">
                <FaEnvelope className="contact-icon" />
                <a href="mailto:23sarmiento@gmail.com" className="contact-link">23sarmiento@gmail.com</a>
              </div>
              <div className="contact-item">
                <FaPhone className="contact-icon" />
                <a href="tel:+543541237972" className="contact-link">+54 3541 237972</a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p className="copyright">
            &copy; {currentYear} hgaruna. Todos los derechos reservados.
          </p>
          <div className="footer-legal">
            <a href="/politicas-privacidad/" className="legal-link">Políticas de Privacidad</a>
            <span className="divider">|</span>
            <a href="/legal/" className="legal-link">Términos Legales</a>
          </div>
          <button 
            onClick={toggleTheme} 
            className={`theme-toggle ${isDarkMode ? 'dark' : 'light'}`}
            aria-label={isDarkMode ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
          >
            {isDarkMode ? <FaSun className="theme-icon" /> : <FaMoon className="theme-icon" />}
          </button>
        </div>
      </div>
    </footer>
  );
}