import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
  const [showBackToTop, setShowBackToTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  const currentYear = new Date().getFullYear()

  const services = [
    { to: '/desarrollo-web-villa-carlos-paz', label: 'Desarrollo Web' },
    { to: '/diseño-web-villa-carlos-paz', label: 'Diseño Web' },
    { to: '/marketing-digital-villa-carlos-paz', label: 'Marketing Digital' },
    { to: '/planes', label: 'Ver Planes' }
  ]

  const company = [
    { to: '/', label: 'Inicio' },
    { to: '/blog', label: 'Blog' },
    { to: '/contacto', label: 'Contacto' },
    { to: '/legal', label: 'Términos Legales' }
  ]

  const socialLinks = [
    {
      href: 'https://www.facebook.com/profile.php?id=61557007626922',
      icon: 'fab fa-facebook-f',
      label: 'Facebook'
    },
    {
      href: 'https://www.instagram.com/onlinesellweb/',
      icon: 'fab fa-instagram',
      label: 'Instagram'
    },
    {
      href: 'https://wa.me/+543541237972',
      icon: 'fab fa-whatsapp',
      label: 'WhatsApp'
    }
  ]

  return (
    <>
      <footer className="footer">
        <div className="footer-content">
          <div className="container">
            {/* Newsletter Section */}
            <div className="footer-newsletter">
              <h3 className="newsletter-title">
                <i className="fas fa-envelope mr-2"></i>
                Mantente Actualizado
              </h3>
              <p className="newsletter-description">
                Recibe tips gratuitos sobre desarrollo web, marketing digital y tecnología directamente en tu email.
              </p>
              <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="tu@email.com"
                  className="newsletter-input"
                  required
                />
                <button type="submit" className="newsletter-button">
                  <i className="fas fa-paper-plane mr-2"></i>
                  Suscribirse
                </button>
              </form>
            </div>

            {/* Main Footer Content */}
            <div className="footer-main">
              {/* Brand Section */}
              <div className="footer-brand">
                <Link to="/" className="footer-logo">
                  <img src="/logos-he-imagenes/logo3.png" alt="hgaruna" />
                  <span>hgaruna</span>
                </Link>
                <p className="footer-description">
                  Desarrollo web profesional en Villa Carlos Paz, Córdoba. Creamos sitios web que convierten visitantes en clientes y potencian el crecimiento de tu negocio local.
                </p>
                <div className="footer-social">
                  {socialLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link.href}
                      className="social-link"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={link.label}
                    >
                      <i className={link.icon}></i>
                    </a>
                  ))}
                </div>
              </div>

              {/* Services Section */}
              <div className="footer-section">
                <h3 className="footer-title">Servicios</h3>
                <ul className="footer-links">
                  {services.map((service, index) => (
                    <li key={index}>
                      <Link to={service.to} className="footer-link">
                        {service.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Company Section */}
              <div className="footer-section">
                <h3 className="footer-title">Empresa</h3>
                <ul className="footer-links">
                  {company.map((item, index) => (
                    <li key={index}>
                      <Link to={item.to} className="footer-link">
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact Section */}
              <div className="footer-section">
                <h3 className="footer-title">Contacto</h3>
                <div className="footer-contact">
                  <div className="contact-info-item">
                    <i className="fas fa-map-marker-alt"></i>
                    <span>Villa Carlos Paz, Córdoba</span>
                  </div>
                  <div className="contact-info-item">
                    <i className="fas fa-phone"></i>
                    <a href="tel:+543541237972">+54 3541 237972</a>
                  </div>
                  <div className="contact-info-item">
                    <i className="fas fa-envelope"></i>
                    <a href="mailto:23sarmiento@gmail.com">23sarmiento@gmail.com</a>
                  </div>
                  <div className="contact-info-item">
                    <i className="fas fa-clock"></i>
                    <span>Lun-Vie: 9:00-18:00</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Bottom */}
            <div className="footer-bottom">
              <div className="footer-copyright">
                <p>© {currentYear} hgaruna. Todos los derechos reservados.</p>
              </div>
              <ul className="footer-legal">
                <li>
                  <Link to="/legal">Términos de Servicio</Link>
                </li>
                <li>
                  <a href="/politicas-privacidad">Política de Privacidad</a>
                </li>
                <li>
                  <a href="/cookies">Cookies</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>

      {/* Back to Top Button */}
      <button
        className={`back-to-top ${showBackToTop ? 'visible' : ''}`}
        onClick={scrollToTop}
        aria-label="Volver arriba"
      >
        <i className="fas fa-arrow-up"></i>
      </button>
    </>
  )
}
