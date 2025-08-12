import React from 'react';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <img 
              id="footer-logo" 
              src="/logos-he-imagenes/logonegro-Photoroom.png" 
              alt="Logo de hgaruna" 
              className="footer-logo" 
              loading="lazy" 
            />
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
              <li><a href="/articulos/">Artículos</a></li>
              <li><a href="/recursos/">Recursos</a></li>
              <li><a href="/ebook/">eBook Gratis</a></li>
              <li><a href="/contacto/">Contacto</a></li>
            </ul>
          </div>
          <div className="footer-contact">
            <h4>Contáctanos</h4>
            <div className="contact-info">
              <p><i className="fas fa-map-marker-alt"></i> Villa Carlos Paz, Argentina</p>
              <p><i className="fas fa-envelope"></i> 23sarmiento@gmail.com</p>
              <p><i className="fas fa-phone"></i> +54 3541 237972</p>
              <p><i className="fas fa-clock"></i> Lun - Vie: 9:00 - 18:00 hs</p>
            </div>
          </div>
          <div className="footer-about">
            <h4>Acerca de hgaruna</h4>
            <p>
              Somos un equipo especializado en desarrollo web, 
              creando soluciones digitales innovadoras para empresas 
              y emprendedores en Villa Carlos Paz y toda Argentina.
            </p>
            <div className="footer-badges">
              <span className="badge">Desarrollo Web</span>
              <span className="badge">Innovación</span>
              <span className="badge">Calidad</span>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} hgaruna. Todos los derechos reservados.</p>
          <div className="footer-bottom-links">
            <a href="/politicas-privacidad/" className="footer-bottom-link">Políticas de Privacidad</a>
            <a href="/legal/" className="footer-bottom-link">Términos Legales</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
