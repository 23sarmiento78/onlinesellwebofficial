import React from 'react';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <img id="footer-logo" src="/logos-he-imagenes/logonegro-Photoroom.png" alt="Logo de hgaruna" className="footer-logo" loading="lazy" />
            <h3>hgaruna</h3>
            <p className="slogan">Tu éxito en línea, nuestra misión.</p>
            <div className="social-links">
              <a href="https://www.facebook.com/profile.php?id=61557007626922" target="_blank" rel="noopener" aria-label="Facebook">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="https://www.instagram.com/onlinesellweb/" target="_blank" rel="noopener" aria-label="Instagram">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://wa.link/6t7cxa" target="_blank" rel="noopener" aria-label="WhatsApp">
                <i className="fab fa-whatsapp"></i>
              </a>
            </div>
          </div>
          <div className="footer-links">
            <h4>Navegación</h4>
            <ul>
              <li><a href="/">Inicio</a></li>
              <li><a href="/planes/">Planes</a></li>
              <li><a href="/legal/">Legal</a></li>
              <li><a href="/politicas-privacidad/">Políticas de Privacidad</a></li>
              <li><a href="https://wa.link/6t7cxa">Contacto</a></li>
            </ul>
          </div>
          <div className="footer-contact">
            <h4>Contáctanos</h4>
            <p><i className="fas fa-map-marker-alt"></i> Villa Carlos Paz, Argentina</p>
            <p><i className="fas fa-envelope"></i> 23sarmiento@gmail.com</p>
            <p><i className="fas fa-phone"></i> +54 3541 237972</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} hgaruna. Todos los derechos reservados.</p>
          <div className="footer-bottom-links">
            <a href="/politicas-privacidad/" className="footer-bottom-link">Políticas de Privacidad</a>
            <a href="/legal/" className="footer-bottom-link">Términos Legales</a>
          </div>
          <button id="theme-toggle" className="btn-outline theme-toggle-btn" aria-label="Alternar tema oscuro/claro">
            <i className="fas fa-sun"></i>
          </button>
        </div>
      </div>
    </footer>
  );
} 