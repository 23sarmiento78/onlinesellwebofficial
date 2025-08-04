import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react';
// Importación dinámica de íconos para mejor rendimiento
const FaFacebookF = lazy(() => import('react-icons/fa').then(module => ({ default: module.FaFacebookF })));
const FaInstagram = lazy(() => import('react-icons/fa').then(module => ({ default: module.FaInstagram })));
const FaWhatsapp = lazy(() => import('react-icons/fa').then(module => ({ default: module.FaWhatsapp })));
const FaMapMarkerAlt = lazy(() => import('react-icons/fa').then(module => ({ default: module.FaMapMarkerAlt })));
const FaEnvelope = lazy(() => import('react-icons/fa').then(module => ({ default: module.FaEnvelope })));
const FaPhone = lazy(() => import('react-icons/fa').then(module => ({ default: module.FaPhone })));
const FaSun = lazy(() => import('react-icons/fa').then(module => ({ default: module.FaSun })));
const FaMoon = lazy(() => import('react-icons/fa').then(module => ({ default: module.FaMoon })));
const FaHeart = lazy(() => import('react-icons/fa').then(module => ({ default: module.FaHeart })));
const FaRocket = lazy(() => import('react-icons/fa').then(module => ({ default: module.FaRocket })));
const FaCode = lazy(() => import('react-icons/fa').then(module => ({ default: module.FaCode })));
const FaArrowUp = lazy(() => import('react-icons/fa').then(module => ({ default: module.FaArrowUp })));
const FaLinkedin = lazy(() => import('react-icons/fa').then(module => ({ default: module.FaLinkedin })));

import './Footer.css';
import './FooterAdditions.css';

// Componente de carga para íconos
const IconLoader = ({ children }) => (
  <Suspense fallback={<span className="icon-placeholder">...</span>}>
    {children}
  </Suspense>
);

export default function Footer() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [currentYear] = useState(new Date().getFullYear());
  const [stats] = useState({
    projectsCompleted: 25,
    clientsSatisfied: 100,
    yearsExperience: 3
  });

  useEffect(() => {
    // Check for saved theme preference or use system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark-theme');
    }

    // Enhanced scroll effects
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 100);
      setShowScrollTop(scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = useCallback(() => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    
    if (newTheme) {
      document.documentElement.classList.add('dark-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark-theme');
      localStorage.setItem('theme', 'light');
    }
    
    // Disparar evento personalizado para notificar el cambio de tema
    window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: newTheme ? 'dark' : 'light' } }));
  }, [isDarkMode]);

  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    
    // Mejora de accesibilidad: mover el foco al inicio de la página
    const mainContent = document.querySelector('main, #main-content, .app-main');
    if (mainContent) {
      mainContent.setAttribute('tabIndex', '-1');
      mainContent.focus();
    }
  }, []);


  
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
                decoding="async"
                fetchPriority="low"
              />
            </div>
            <h3 className="footer-title">hgaruna</h3>
            <p className="slogan">
              <FaRocket style={{ marginRight: '8px', color: 'var(--footer-accent)' }} />
              Tu éxito en línea, nuestra misión.
            </p>

            {/* Stats modernos */}
            <div className="footer-stats">
              <div className="stat-item">
                <span className="stat-number">{stats.projectsCompleted}+</span>
                <span className="stat-label">Proyectos</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{stats.clientsSatisfied}%</span>
                <span className="stat-label">Satisfacción</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{stats.yearsExperience}+</span>
                <span className="stat-label">Años</span>
              </div>
            </div>
            <div className="social-links" role="list" aria-label="Redes sociales">
              <IconLoader>
                <a
                  href="https://www.facebook.com/profile.php?id=61557007626922"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link facebook"
                  aria-label="Síguenos en Facebook (se abre en una nueva pestaña)"
                  title="Facebook"
                >
                  <FaFacebookF className="social-icon" aria-hidden="true" />
                  <span className="sr-only">Facebook</span>
                </a>
              </IconLoader>
              <IconLoader>
                <a
                  href="https://www.instagram.com/onlinesellweb/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link instagram"
                  aria-label="Síguenos en Instagram (se abre en una nueva pestaña)"
                  title="Instagram"
                >
                  <FaInstagram className="social-icon" aria-hidden="true" />
                  <span className="sr-only">Instagram</span>
                </a>
              </IconLoader>
              <IconLoader>
                <a
                  href="https://wa.link/6t7cxa"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link whatsapp"
                  aria-label="Contáctanos por WhatsApp (se abre en una nueva pestaña)"
                  title="WhatsApp"
                >
                  <FaWhatsapp className="social-icon" aria-hidden="true" />
                  <span className="sr-only">WhatsApp</span>
                </a>
              </IconLoader>
              <IconLoader>
                <a
                  href="https://linkedin.com/company/hgaruna"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link linkedin"
                  aria-label="Conéctate en LinkedIn (se abre en una nueva pestaña)"
                  title="LinkedIn"
                >
                  <FaLinkedin className="social-icon" aria-hidden="true" />
                  <span className="sr-only">LinkedIn</span>
                </a>
              </IconLoader>
            </div>
          </div>
          
          <div className="footer-links">
            <h4 className="footer-heading">Servicios</h4>
            <ul className="footer-nav">
              <li className="footer-nav-item">
                <a href="/desarrollo-web-villa-carlos-paz" className="footer-link">
                  <FaCode style={{ marginRight: '8px', fontSize: '0.9rem' }} />
                  Desarrollo Web
                </a>
              </li>
              <li className="footer-nav-item">
                <a href="/diseño-web-villa-carlos-paz" className="footer-link">
                  Diseño Web
                </a>
              </li>
              <li className="footer-nav-item">
                <a href="/marketing-digital-villa-carlos-paz" className="footer-link">
                  Marketing Digital
                </a>
              </li>
              <li className="footer-nav-item">
                <a href="/planes" className="footer-link">
                  Ver Planes
                </a>
              </li>
              <li className="footer-nav-item">
                <a href="/blog" className="footer-link">
                  Blog Técnico
                </a>
              </li>
            </ul>
          </div>

          <div className="footer-links">
            <h4 className="footer-heading">Empresa</h4>
            <ul className="footer-nav">
              <li className="footer-nav-item">
                <a href="/" className="footer-link">Inicio</a>
              </li>
              <li className="footer-nav-item">
                <a href="/contacto" className="footer-link">Contacto</a>
              </li>
              <li className="footer-nav-item">
                <a href="/legal" className="footer-link">Legal</a>
              </li>
              <li className="footer-nav-item">
                <a href="/politicas-privacidad" className="footer-link">Privacidad</a>
              </li>
            </ul>
          </div>
          
          <div className="footer-contact" style={{ gridColumn: 'span 2' }}>
            <h4 id="contact-heading" className="footer-heading">Contáctanos</h4>
            <div className="contact-info" aria-labelledby="contact-heading">
              <div className="contact-item">
                <FaMapMarkerAlt className="contact-icon" />
                <div>
                  <strong>Villa Carlos Paz, Córdoba</strong>
                  <br />
                  <small>Argentina</small>
                </div>
              </div>
              <div className="contact-item">
                <FaEnvelope className="contact-icon" />
                <div>
                  <a href="mailto:23sarmiento@gmail.com" className="contact-link">
                    23sarmiento@gmail.com
                  </a>
                  <br />
                  <small>Respuesta en 24hs</small>
                </div>
              </div>
              <div className="contact-item">
                <FaPhone className="contact-icon" />
                <div>
                  <a href="tel:+543541237972" className="contact-link">
                    +54 3541 237972
                  </a>
                  <br />
                  <small>Lun-Vie 9:00-18:00</small>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom" role="contentinfo" aria-label="Información legal y derechos de autor">
          <div className="footer-bottom-left">
            <p className="copyright">
              &copy; {currentYear} hgaruna. Hecho con <FaHeart style={{ color: 'var(--footer-accent)', margin: '0 4px' }} /> en Villa Carlos Paz.
            </p>
            <p className="footer-tagline">
              Transformando ideas en experiencias digitales extraordinarias.
            </p>
          </div>

          <div className="footer-bottom-center">
            <div className="footer-legal">
              <a href="/politicas-privacidad" className="legal-link">Privacidad</a>
              <span className="divider">•</span>
              <a href="/legal" className="legal-link">Términos</a>
              <span className="divider">•</span>
              <a href="/contacto" className="legal-link">Contacto</a>
            </div>
          </div>

          <div className="footer-bottom-right">
            <IconLoader>
              <button
                onClick={toggleTheme}
                className={`theme-toggle ${isDarkMode ? 'dark' : 'light'}`}
                aria-label={isDarkMode ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
                title={isDarkMode ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
                aria-pressed={isDarkMode}
              >
                {isDarkMode ? (
                  <FaSun className="theme-icon" aria-hidden="true" />
                ) : (
                  <FaMoon className="theme-icon" aria-hidden="true" />
                )}
                <span className="sr-only">
                  {isDarkMode ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
                </span>
              </button>
            </IconLoader>
          </div>
        </div>

        {/* Scroll to top button */}
        {showScrollTop && (
          <IconLoader>
            <button 
              onClick={scrollToTop} 
              className="scroll-to-top"
              aria-label="Volver al inicio de la página"
              title="Volver arriba"
            >
              <FaArrowUp aria-hidden="true" />
              <span className="sr-only">Volver al inicio de la página</span>
            </button>
          </IconLoader>
        )}

      </div>

      {/* Partículas decorativas */}
      <div className="footer-particles">
        <div className="particle particle-1"></div>
        <div className="particle particle-2"></div>
        <div className="particle particle-3"></div>
        <div className="particle particle-4"></div>
        <div className="particle particle-5"></div>
      </div>
    </footer>
  );
}
