import React from 'react';

export default function Footer() {
  const handleSubscribe = (e) => {
    e.preventDefault();
    const email = e.target.elements.email?.value;
    if (!email) return;
    // Aquí podrías integrar tu servicio de newsletters (Brevo, Mailchimp, etc.)
    console.log('Subscribe intent:', email);
    alert('¡Gracias! Te has suscrito para recibir novedades.');
    e.target.reset();
  };

  return (
    <footer className="site-footer neo">
      <div className="container">
        <div className="footer-top">
          <div className="brand">
            <img
              src="/logos-he-imagenes/logonegro-Photoroom.png"
              alt="hgaruna logo"
              className="brand-logo"
              loading="lazy"
            />
            <h3 className="brand-title">hgaruna</h3>
            <p className="brand-tagline">Impulsando tu presencia digital</p>
            <div className="socials">
              <a href="https://www.facebook.com/profile.php?id=61557007626922" target="_blank" rel="noopener" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
              <a href="https://www.instagram.com/onlinesellweb/" target="_blank" rel="noopener" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
              <a href="https://wa.link/6t7cxa" target="_blank" rel="noopener" aria-label="WhatsApp"><i className="fab fa-whatsapp"></i></a>
              <a href="https://linkedin.com/company/hgaruna" target="_blank" rel="noopener" aria-label="LinkedIn"><i className="fab fa-linkedin-in"></i></a>
            </div>
          </div>

          <div className="links">
            <div className="links-col">
              <h4>Producto</h4>
              <ul>
                <li><a href="/">Inicio</a></li>
                <li><a href="/articulos">Artículos</a></li>
                <li><a href="/recursos">Recursos</a></li>
                <li><a href="/ebook">eBook Gratis</a></li>
              </ul>
            </div>
            <div className="links-col">
              <h4>Compañía</h4>
              <ul>
                <li><a href="/nosotros">Sobre mí</a></li>
                <li><a href="/contacto">Contacto</a></li>
                <li><a href="/legal">Legal</a></li>
                <li><a href="/politicas-privacidad">Privacidad</a></li>
              </ul>
            </div>
          </div>

          <div className="newsletter">
            <h4>Suscríbete</h4>
            <p>Recibe tutoriales, artículos y recursos exclusivos en tu correo.</p>
            <form onSubmit={handleSubscribe} className="newsletter-form">
              <input name="email" type="email" placeholder="Tu correo electrónico" aria-label="Email" required />
              <button type="submit" className="btn-subscribe">
                <i className="fas fa-paper-plane"></i>
                Suscribirme
              </button>
            </form>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Israel Sarmiento · hgaruna</p>
          <div className="legal-links">
            <a href="/politicas-privacidad">Privacidad</a>
            <a href="/legal">Legal</a>
            <a href="/sitemap.xml" target="_blank" rel="noopener">Sitemap</a>
            <a href="/robots.txt" target="_blank" rel="noopener">Robots.txt</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
